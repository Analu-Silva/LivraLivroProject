# LivraLivro

O **LivraLivro** é uma plataforma destinada à compra e venda de livros usados, composta por um conjunto de microsserviços no backend e um aplicativo mobile desenvolvido em React Native no frontend. Este documento descreve principalmente como executar o projeto localmente.

---

## 1. Pré-requisitos

Para executar o projeto, é necessário ter instalado:

* Docker e Docker Compose
* Java 17
* Node.js e npm
* Expo CLI (`npm install -g expo-cli`)

---

## 2. Executando o Backend

O backend é composto pelos seguintes microsserviços, configurados no arquivo `docker-compose.yml`:

* discovery-service (Eureka)
* config-service
* gateway-service
* book-service
* user-service
* order-service
* wishlist-service
* cart-service
* currency-service

Para iniciar todos os serviços, execute no diretório raiz do projeto:

```bash
Docker compose up --build
```

Após a inicialização:

* Eureka estará disponível em: `http://localhost:8761`
* O API Gateway estará disponível em: `http://localhost:8765`

Todos os microsserviços são registrados automaticamente no Discovery Server.

---

## 3. Executando o Frontend

O frontend é desenvolvido com React Native e Expo.

Para iniciar o aplicativo:

```bash
cd frontend
npm install
npx expo start
```

O aplicativo pode ser executado via Expo Go em dispositivo físico ou em emuladores Android/iOS.

---

## 4. Comunicação entre Frontend e Backend

O frontend se comunica com o backend por meio do API Gateway, utilizando a URL base:

```
http://<IP_DA_MAQUINA>:8765
```
---

## 6. Tecnologias Utilizadas

### Backend

* Java 17
* Spring Boot
* Spring Cloud (Eureka, Config Server, API Gateway)
* OpenFeign
* Docker

### Frontend

* React Native
* Expo
* Fetch
* Context API

---

## 7. Equipe

* **Alice Segatto**
* **Aline Hoffmann**
* **Ana Luisa**
* **Gabriel Mascarenhas**
* **Lauro Ferneda**
* **Pedro Segatto**
* **Pedro Leal**
* **Thaise Zanin**
