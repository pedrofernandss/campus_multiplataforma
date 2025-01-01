# Campus Multiplataforma    

<p align="center">  
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">  
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">  
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">  
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">  
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">  
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">  
</p>  

<p align="center">  
  <img src="./assets/images/cover.png" alt="Campus Multiplataforma Logo" width="85%">  
</p>  

---

## Sobre o Projeto  

O **Campus Multiplataforma** é um aplicativo desenvolvido para o **Laboratório de Jornalismo** do **Departamento de Comunicação** da Universidade de Brasília. O projeto centraliza todas as publicações do jornal _Campus Multiplataforma_ em uma única plataforma, integrando conteúdos de diferentes canais de comunicação:  

- **LinkedIn**  
- **TikTok**  
- **Instagram**  
- **YouTube**  

Com o objetivo de fortalecer a presença digital do jornal, o aplicativo oferece acesso centralizado ao conteúdo multimídia e uma experiência unificada para os usuários.  

---

## Equipe  

- **Pedro Fernandes**  
  **Ciências da Computação**, Universidade de Brasília  
  [GitHub](https://github.com/pedrofernandss)  

- **Pedro Henrique**  
  **Engenharia de Software**, Universidade de Brasília  
  [GitHub](https://github.com/pedronascimentos)  

- **Ithalo Medeiros**  
  **Ciências da Computação**, Universidade de Brasília  
  [GitHub](https://github.com/IthaloDekki)  

---

## Configuração do Projeto  

### Requisitos  

- **Node.js** >= 18.x  
- **Yarn** ou **npm**  

### Variáveis de Ambiente  

Antes de executar o projeto, configure as seguintes variáveis de ambiente no arquivo `.env`:  

```env
# Configurações do Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=sua_chave_api
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=sua_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_id_projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Configurações do YouTube
EXPO_PUBLIC_YOUTUBE_API_KEY=sua_chave_api_youtube
EXPO_PUBLIC_CHANNEL_ID=seu_id_canal
```  

### Rodando o Projeto com Docker  

1. **Clone o repositório:**  
   ```bash
   git clone https://github.com/pedrofernandss/campus_multiplataforma.git
   ```  

2. **Inicie o ambiente de desenvolvimento:**  
   ```bash
   docker-compose up
   ```  

### Rodando o Projeto sem Docker  

1. **Clone o repositório:**  
   ```bash
   git clone https://github.com/pedrofernandss/campus_multiplataforma.git  
   ```  

2. **Instale as dependências:**  
   ```bash
   cd app && yarn install
   ```  

3. **Inicie o servidor Expo:**  
   ```bash
   npx expo start
   ```  

---

## Licença  

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.  
