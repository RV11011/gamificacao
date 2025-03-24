#!/bin/bash

# Carregar variáveis de ambiente
set -a
source .env
set +a

# Matar processos anteriores
pkill -f "node server.js"
pkill -f "npm start"

# Limpar o cache do node
npm cache clean --force

# Executar o servidor backend
node server.js &

sleep 5

# Iniciar o frontend
npm start