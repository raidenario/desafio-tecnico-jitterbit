const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'desafio tecnico Jitterbit',
            version: '1.0.0',
            description: 'API RESTful para criação, leitura, atualização e exclusão de pedidos (Desafio Jitterbit). Desenvolvida com Node.js, Express e MongoDB.',
            contact: {
                name: 'Teste Técnico',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT obtido no endpoint /auth/login',
                },
            },
            schemas: {
                OrderInput: {
                    type: 'object',
                    required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
                    properties: {
                        numeroPedido: {
                            type: 'string',
                            description: 'Número identificador do pedido',
                            example: 'v10089015vdb-01',
                        },
                        valorTotal: {
                            type: 'number',
                            description: 'Valor total do pedido',
                            example: 10000,
                        },
                        dataCriacao: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação do pedido (ISO 8601)',
                            example: '2023-07-19T12:24:11.5299601+00:00',
                        },
                        items: {
                            type: 'array',
                            description: 'Lista de itens do pedido',
                            items: {
                                type: 'object',
                                required: ['idItem', 'quantidadeItem', 'valorItem'],
                                properties: {
                                    idItem: {
                                        type: 'string',
                                        description: 'ID do produto',
                                        example: '2434',
                                    },
                                    quantidadeItem: {
                                        type: 'integer',
                                        description: 'Quantidade do item',
                                        example: 1,
                                    },
                                    valorItem: {
                                        type: 'number',
                                        description: 'Valor unitário do item',
                                        example: 1000,
                                    },
                                },
                            },
                        },
                    },
                },
                OrderResponse: {
                    type: 'object',
                    properties: {
                        orderId: {
                            type: 'string',
                            description: 'ID do pedido',
                            example: 'v10089015vdb-01',
                        },
                        value: {
                            type: 'number',
                            description: 'Valor total do pedido',
                            example: 10000,
                        },
                        creationDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação (ISO 8601)',
                            example: '2023-07-19T12:24:11.529Z',
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    productId: {
                                        type: 'integer',
                                        description: 'ID do produto',
                                        example: 2434,
                                    },
                                    quantity: {
                                        type: 'integer',
                                        description: 'Quantidade',
                                        example: 1,
                                    },
                                    price: {
                                        type: 'number',
                                        description: 'Preço unitário',
                                        example: 1000,
                                    },
                                },
                            },
                        },
                    },
                },
                AuthRegister: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Nome de usuário',
                            example: 'admin',
                        },
                        password: {
                            type: 'string',
                            description: 'Senha do usuário',
                            example: '123456',
                        },
                    },
                },
                AuthLogin: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            example: 'admin',
                        },
                        password: {
                            type: 'string',
                            example: '123456',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
