require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Swagger - desafio tecnico Jitterbit',
}));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API rodando! - desafio tecnico Jitterbit',
        documentation: '/api-docs',
        endpoints: {
            auth: {
                register: 'POST /auth/register',
                login: 'POST /auth/login',
            },
            orders: {
                create: 'POST /order',
                getById: 'GET /order/:orderId',
                list: 'GET /order/list',
                update: 'PUT /order/:orderId',
                delete: 'DELETE /order/:orderId',
            },
        },
    });
});

app.use('/auth', authRoutes);

app.use('/order', orderRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
            console.log(`📋 Health check: http://localhost:${PORT}/\n`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o servidor:', error.message);
        process.exit(1);
    }
};

startServer();
