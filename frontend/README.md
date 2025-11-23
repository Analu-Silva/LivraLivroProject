# Aplicativo de E-commerce - PROJETO, DESIGN E ENGENHARIA DE PROCESSOS

Este é um aplicativo mobile desenvolvido em React Native com Expo que simula uma loja virtual, utilizando a FakeStore API para autenticação e exibição de produtos.

## 📱 Funcionalidades

- **Sistema de Login**: Autenticação de usuários
- **Catálogo de Produtos**: Visualização de produtos por categoria
- **Detalhes do Produto**: Informações completas de cada item
- **Navegação**: Interface intuitiva com navegação entre telas
- **Design Responsivo**: Interface moderna com tema roxo

## 🚀 Passos para Rodar o Projeto com Expo

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Dispositivo móvel com o app [Expo Go](https://expo.dev/client) instalado

### Instalação e Execução

1. **Clone o repositório** (se aplicável):
   ```bash
   git clone <url-do-repositorio>
   cd trabalho
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```
   
   Ou use os comandos específicos:
   ```bash
   # Para Android
   npm run android
   
   # Para iOS
   npm run ios
   
   # Para Web
   npm run web
   ```

4. **Execute no dispositivo**:
   - Abra o app Expo Go no seu dispositivo móvel
   - Escaneie o QR Code exibido no terminal ou navegador
   - Certifique-se de que o computador e dispositivo estão na mesma rede Wi-Fi

### Estrutura do Projeto

```
trabalho/
├── App.js                 # Componente principal com navegação
├── screens/               # Telas do aplicativo
│   ├── LoginScreen.js     # Tela de login
│   ├── HomeScreen.js      # Tela principal com produtos
│   ├── ProductDetailScreen.js # Detalhes do produto
│   └── InfoScreen.js      # Informações do grupo
├── assets/                # Imagens e ícones
└── package.json           # Dependências do projeto
```

## 🔐 Como Verificar os Usuários Disponíveis para Login

Este aplicativo utiliza a **FakeStore API** para autenticação. Para testar o login, você pode verificar os usuários disponíveis, consumir o endpoint GET: https://fakestoreapi.com/users

### Como Testar:
1. Abra o aplicativo
2. Na tela de login, insira qualquer uma das combinações de usuário e senha de um usuário válido
3. Clique em "Entrar"
4. Se as credenciais estiverem corretas, você será redirecionado para a tela de produtos


## 👥 Integrantes do Grupo

### Alice Bohnen Segatto
- **RA**: 1136046

### Aline Hoffmann Passamni 
- **RA**: 1136614

### Ana Luisa Silva do Amaral
- **RA**: 1136385

### Thaise Chaves Zanin
- **RA**: 1136629

> **Observação**: As informações dos integrantes também podem ser visualizadas diretamente no aplicativo através da tela "Informações" acessível pelo menu superior direito na tela principal.

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento React Native
- **React Navigation**: Navegação entre telas
- **Axios**: Cliente HTTP para requisições à API

## 📋 Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run android`: Executa no Android
- `npm run ios`: Executa no iOS  
- `npm run web`: Executa no navegador web

## 🔧 Dependências Principais

```json
{
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/native-stack": "^7.3.26",
  "axios": "^1.12.2",
  "expo": "~54.0.9",
  "react": "19.1.0",
  "react-native": "0.81.4"
}
```

## 📱 Compatibilidade

- **Android**: 5.0+ (API level 21+)
- **iOS**: 11.0+
- **Expo SDK**: 54.0.9

---