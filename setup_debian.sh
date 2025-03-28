#!/bin/bash

# Atualizar o sistema
echo "Atualizando o sistema..."
apt update && apt upgrade -y

# Instalar dependências necessárias
echo "Instalando dependências..."
apt install -y curl git build-essential

# Instalar Node.js e npm
echo "Instalando Node.js e npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar Docker e Docker Compose
echo "Instalando Docker e Docker Compose..."
apt install -y ca-certificates gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Adicionar usuário ao grupo docker
usermod -aG docker $USER

# Criar diretório do projeto
echo "Configurando o projeto..."
mkdir -p /gamificacao
cd /gamificacao

# Copiar arquivos do projeto
echo "Copiando arquivos do projeto..."
cp -r /caminho/do/projeto/* .

# Instalar dependências do projeto
echo "Instalando dependências do projeto..."
npm install

# Iniciar o banco de dados com Docker Compose
echo "Iniciando o banco de dados..."
docker-compose up -d db

# Inicializar o banco de dados
echo "Inicializando o banco de dados..."
npm run db:init
npm run db:seed

# Iniciar o servidor
echo "Iniciando o servidor..."
npm start

echo "Instalação concluída!"
echo "Para acessar o sistema:"
echo "1. Frontend: http://[IP_DA_SUA_VM]:3000"
echo "2. Backend: http://[IP_DA_SUA_VM]:3001"
echo "3. Banco de dados: localhost:5432" 