# Usa a imagem oficial do Node.js
FROM node:20

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração das dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código do frontend
COPY . .

# Expõe a porta que o Expo usa (ajuste para a porta correta, se necessário)
EXPOSE 19000

# Comando para iniciar o Expo
CMD ["npx", "expo", "start", "--no-interactive"]

