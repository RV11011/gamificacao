const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'gamificacao_user',
  password: 'gamificacao_password',
  host: 'localhost',
  database: 'gamificacao_db',
  port: 5432
});

const initialUsers = [
  {
    username: 'AliferTibes',
    password: 'alifer123',
    full_name: 'Alifer Vinicius Tibes',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'AlyssonKooke',
    password: 'alysson123',
    full_name: 'Alysson Alquieri Kooke',
    department: 'ACS',
    role: 'Suporte'
  },
  {
    username: 'AndrePereira',
    password: 'andre123',
    full_name: 'André Filipe Lima Valença Pereira',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'AngeloSfreddo',
    password: 'angelo123',
    full_name: 'Angelo Guilherme Sfreddo',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'AnisioLeite',
    password: 'anisio123',
    full_name: 'Anísio Silva Leite',
    department: 'Redes',
    role: 'Implantador'
  },
  {
    username: 'BrunoSilva',
    password: 'bruno123',
    full_name: 'Bruno Cabral da Silva',
    department: 'Inmap',
    role: 'Implantador'
  },
  {
    username: 'CaioDuarte',
    password: 'caio123',
    full_name: 'Caio Vinícius Aragão Duarte',
    department: 'ACS',
    role: 'Suporte'
  },
  {
    username: 'CamileZanela',
    password: 'camile123',
    full_name: 'Camile Vitória Zanela',
    department: 'Inmap',
    role: 'Suporte'
  },
  {
    username: 'DouglasAlmeida',
    password: 'douglas123',
    full_name: 'Douglas Rodrigues de Almeida',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'EduardoPorfirio',
    password: 'eduardo123',
    full_name: 'Eduardo Vitor Porfirio',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'ElielLopes',
    password: 'eliel123',
    full_name: 'Eliel José Rossi Diniz Lopes',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'EmersonComar',
    password: 'emerson123',
    full_name: 'Emerson Henrique Comar',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'EzequielMulinari',
    password: 'ezequiel123',
    full_name: 'Ezequiel José Mulinari',
    department: 'Inmap',
    role: 'Implantador'
  },
  {
    username: 'FranciscoZattera',
    password: 'francisco123',
    full_name: 'Francisco Júnior Pansera Zattera',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'GabrielReck',
    password: 'gabriel123',
    full_name: 'Gabriel Donini Reck',
    department: 'Servidores',
    role: 'Implantador'
  },
  {
    username: 'HenriqueKuhn',
    password: 'henrique123',
    full_name: 'Henrique Miguel Hart Kuhn',
    department: 'Inmap',
    role: 'Suporte'
  },
  {
    username: 'HevellymMelo',
    password: 'hevellym123',
    full_name: 'Hevellym Larissa de Siqueira Melo',
    department: 'Inmap',
    role: 'Implantador'
  },
  {
    username: 'HigorOliveira',
    password: 'higor123',
    full_name: 'Higor Sousa de Oliveira',
    department: 'Inmap',
    role: 'Suporte'
  },
  {
    username: 'JailsonLemes',
    password: 'jailson123',
    full_name: 'Jailson Pirã Lemes',
    department: 'Servidores',
    role: 'Implantador'
  },
  {
    username: 'JeffersonSantos',
    password: 'jefferson123',
    full_name: 'Jefferson Byller Gomes dos Santos',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'JoaoZandona',
    password: 'joao123',
    full_name: 'João Pedro Zandoná',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'JoseSilva',
    password: 'jose123',
    full_name: 'Jose Marinho da Silva',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'LeodimarCollette',
    password: 'leodimar123',
    full_name: 'Leodimar Collette',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'LucasPrigol',
    password: 'lucas123',
    full_name: 'Lucas Prigol',
    department: 'ACS',
    role: 'Implantador'
  },
  {
    username: 'LuizGabrielSilva',
    password: 'luizgabriel123',
    full_name: 'Luiz Gabriel Paganini da Silva',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'LuizMiguelFraga',
    password: 'luizmiguel123',
    full_name: 'Luiz Miguel Martins de Fraga',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'MarcusSilva',
    password: 'marcus123',
    full_name: 'Marcus Antônio Toledo Silva',
    department: 'ACS',
    role: 'Suporte'
  },
  {
    username: 'NalberthSantos',
    password: 'nalberth123',
    full_name: 'Nalberth Alberto Macedo dos Santos',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'PedroSousa',
    password: 'pedro123',
    full_name: 'Pedro Felipe Silva de Sousa',
    department: 'Redes',
    role: 'Implantador'
  },
  {
    username: 'RafaelConceicao',
    password: 'rafaels123',
    full_name: 'Rafael da Conceição Silveira',
    department: 'Servidores',
    role: 'Implantador'
  },
  {
    username: 'RafaelVargas',
    password: 'rafaelv123',
    full_name: 'Rafael Vargas Rodrigues Alves',
    department: 'Servidores',
    role: 'Suporte'
  },
  {
    username: 'TamaraOliveira',
    password: 'tamara123',
    full_name: 'Tamara Ramalho de Oliveira',
    department: 'Redes',
    role: 'Implantador'
  },
  {
    username: 'TamirysAltenhofer',
    password: 'tamirys123',
    full_name: 'Tamirys Tereza Altenhofer',
    department: 'Inmap',
    role: 'Implantador'
  },
  {
    username: 'ThaliaMohr',
    password: 'thalia123',
    full_name: 'Thalia Mohr',
    department: 'Inmap',
    role: 'Suporte'
  },
  {
    username: 'VictorDantas',
    password: 'victor123',
    full_name: 'Victor Hugo Araújo Dantas',
    department: 'Inmap',
    role: 'Suporte'
  },
  {
    username: 'WillianHora',
    password: 'willian123',
    full_name: 'Willian Santos Hora',
    department: 'Redes',
    role: 'Suporte'
  },
  {
    username: 'WillyanBueno',
    password: 'willyan123',
    full_name: 'Willyan Paproski Bueno',
    department: 'Redes',
    role: 'Suporte'
  }
];

async function seedUsers() {
  try {
    for (const user of initialUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        `INSERT INTO users (username, password, full_name, department, role) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO NOTHING`,
        [user.username, hashedPassword, user.full_name, user.department, user.role]
      );
    }
    console.log('Usuários iniciais criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await pool.end();
  }
}

seedUsers();