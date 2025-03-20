#!/bin/bash

# Carregar variáveis de ambiente
set -a
source .env
set +a

# Executar o script readSheet.js
node readSheet.js &

sleep 5

# Executar o servidor backend
node server.js &

sleep 5

# Iniciar o frontend
npm start