const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Carregue as credenciais do arquivo JSON
const credentialsPath = path.join(__dirname, 'credentials.json');
if (!fs.existsSync(credentialsPath)) {
  console.error('Arquivo credentials.json não encontrado.');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath));
console.log('Credenciais carregadas:', credentials);

// Configure a autenticação OAuth2
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'urn:ietf:wg:oauth:2.0:oob');
console.log('OAuth2Client configurado');

// Função para obter um novo token de acesso
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Salve o token para reutilização futura
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
      callback(oAuth2Client);
    });
  });
}

// Função para ler dados da planilha
function readSheet(auth) {
  console.log('Lendo dados da planilha...');
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1n01Pj7vZftKbmGW4SoLhankSl1Rqua7zwqqscPhN4ow';
  const range = 'Atendente'; // Nome da aba

  sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  }, (err, res) => {
    if (err) {
      console.log('A API retornou um erro: ' + err);
      return;
    }
    const rows = res.data.values;
    if (rows && rows.length) {
      console.log('Dados da planilha:');
      rows.forEach((row) => {
        console.log(row.join(', '));
      });
    } else {
      console.log('Nenhum dado encontrado.');
    }
  });
}

// Carregue o token de acesso salvo, se existir
if (fs.existsSync(TOKEN_PATH)) {
  console.log('Token found, loading...');
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  readSheet(oAuth2Client);
} else {
  console.log('No token found, requesting new one...');
  getNewToken(oAuth2Client, readSheet);
}