# Use uma imagem oficial do Node.js como base
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração das dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código do backend
COPY . .

# Exponha a porta que o servidor backend usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
