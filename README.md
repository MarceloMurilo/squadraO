# Squadra - Volleyball Management App 🏐

## 👋 Welcome to Squadra!

Squadra é um aplicativo de gerenciamento de jogos de vôlei, desenvolvido para ajudar jogadores a organizar partidas, reservar quadras, formar times balanceados e engajar a comunidade com funcionalidades interativas.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** 🌐
- **React Native** 📱
- **Expo** ⚛️
- **PostgreSQL** 🗄️

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

- **Node.js** (versão 14 ou superior) e **npm** (geralmente vem junto com Node.js).
- **Git** para clonar o repositório.
- **Expo CLI** (instalado globalmente) para rodar o aplicativo.
- **PostgreSQL** para o banco de dados (se você estiver configurando o backend).

### 🛠️ Instalando Expo CLI
```bash
npm install -g expo-cli
```

---

## 📦 Passos para Instalação

1. **Clone o repositório** 🖥️

   Abra o terminal e execute o comando abaixo:
   ```bash
   git clone https://github.com/seu-usuario/squadra.git
   ```

2. **Navegue até a pasta do projeto** 📁

   ```bash
   cd squadra
   ```

3. **Instale as dependências do frontend** 🔧

   Entre na pasta `volley-frontend` e execute o seguinte comando:
   ```bash
   cd volley-frontend
   npm install
   ```

4. **Instale as dependências do backend** 🔧

   Em uma nova aba ou janela do terminal, navegue até a pasta `volley-backend` e execute:
   ```bash
   cd volley-backend
   npm install
   ```

5. **Configuração do banco de dados** 🗄️

   Certifique-se de ter o PostgreSQL instalado e rodando em sua máquina. Configure o banco de dados no arquivo `.env` na pasta `volley-backend` com as informações do seu banco (host, porta, usuário, senha e nome do banco).

6. **Execute as migrações** 🔄

   Ainda na pasta `volley-backend`, execute:
   ```bash
   npx prisma migrate dev --name init
   ```

   Este comando vai configurar o banco de dados de acordo com os modelos definidos no Prisma.

---

## 🏃 Executando o Projeto

### Backend 🖥️

1. No terminal na pasta `volley-backend`, inicie o servidor:
   ```bash
   npm start
   ```

   O servidor estará rodando em `http://localhost:3000`.

### Frontend 📱

1. No terminal na pasta `volley-frontend`, inicie o projeto Expo:
   ```bash
   npx expo start --clear
   ```

   O comando `--clear` limpa o cache para evitar problemas de cache antigo. Você pode abrir o app no seu emulador ou escanear o QR code com o aplicativo **Expo Go** no seu dispositivo móvel para testar.

   **Dica:** Caso tenha dúvidas de como rodar o projeto com Expo Go ou virtualizando com SDK, consulte a documentação oficial [aqui](https://reactnative.dev/docs/set-up-your-environment).

---

## 🔍 Comandos Úteis

- **Instalar dependências**:
  ```bash
  npm install
  ```
- **Iniciar o backend**:
  ```bash
  npm start
  ```
- **Iniciar o frontend com Expo**:
  ```bash
  npx expo start --clear
  ```
- **Limpar cache do Expo**:
  ```bash
  npx expo start --clear
  ```

---

## 📂 Estrutura do Projeto

```
squadra/
├── volley-frontend/
│   ├── app/
│   ├── src/
│   ├── App.js
│   └── package.json
├── volley-backend/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com este projeto! Se você tiver ideias ou encontrar bugs, crie uma **issue** ou abra um **pull request**.

---

Espero que esse README tenha ficado claro e fácil de seguir! Se precisar de mais alguma coisa, é só me avisar. 🎉
