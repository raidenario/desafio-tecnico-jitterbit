# Desafio Técnico Jitterbit (Order Management API)

API RESTful para criação, leitura, atualização e exclusão de pedidos, desenvolvida com Node.js, Express e MongoDB.

## Funcionalidades

- CRUD completo de pedidos (Create, Read, Update, Delete)
- Transformação de dados: recebe campos em português e armazena em inglês
- Autenticação JWT: endpoints protegidos com Bearer token
- Documentação Swagger: interface interativa em /api-docs
- Tratamento de erros: respostas padronizadas com códigos HTTP adequados
- Dockerizado: pronto para rodar instantaneamente com Docker Compose

## Pré-requisitos

- Docker e Docker Compose
- Ou: Node.js (v18+) e MongoDB local

## Instalação via Docker

A forma recomendada de rodar o projeto é via Docker. A API e o banco de dados MongoDB serão inicializados simultaneamente.

```bash
docker compose up --build -d
```

A API estará exposta em http://localhost:3000 e o MongoDb na porta 27017.

---

## Instalação Manual (Sem Docker)

```bash
npm install
npm run dev
```

Assegure-se de ter um MongoDB rodando na porta 27017 antes de iniciar a aplicação.

## Estrutura do Projeto

```
teste-tecnico/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── orderController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── mapper.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Autenticação

A API utiliza autenticação via JWT (JSON Web Token). Para acessar os endpoints de pedidos, é necessário autenticação.

### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
```

### 2. Fazer login para obter o token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
```

Resposta:
```json
{
  "message": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Usar o token nas requisições

Inclua o cabeçalho `Authorization: Bearer <token>` em todas as requisições de pedidos.

## Endpoints

### Autenticação (Públicos)

| Método | URL              | Descrição                  |
|--------|------------------|----------------------------|
| POST   | `/auth/register` | Registrar novo usuário     |
| POST   | `/auth/login`    | Login (retorna token JWT)  |

### Pedidos (Protegidos)

| Método | URL                 | Descrição                      |
|--------|---------------------|--------------------------------|
| POST   | `/order`            | Criar um novo pedido           |
| GET    | `/order/list`       | Listar todos os pedidos        |
| GET    | `/order/:orderId`   | Obter pedido por número        |
| PUT    | `/order/:orderId`   | Atualizar pedido por número    |
| DELETE | `/order/:orderId`   | Excluir pedido por número      |

## Exemplos de Uso

### Criar um pedido

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Obter pedido por número

```bash
curl http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

### Listar todos os pedidos

```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

### Atualizar pedido

```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 20000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 10000
      }
    ]
  }'
```

### Excluir pedido

```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

## Transformação de Dados

A API recebe dados no padrão português e transforma para o padrão inglês antes de salvar no banco de dados:

| Entrada (PT)              | Banco de Dados (EN)     |
|---------------------------|-------------------------|
| `numeroPedido`            | `orderId`               |
| `valorTotal`              | `value`                 |
| `dataCriacao`             | `creationDate`          |
| `items[].idItem`          | `items[].productId`     |
| `items[].quantidadeItem`  | `items[].quantity`      |
| `items[].valorItem`       | `items[].price`         |

## Documentação Swagger

Acesse a documentação interativa em: http://localhost:3000/api-docs

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Swagger
- dotenv
- CORS
- nodemon
