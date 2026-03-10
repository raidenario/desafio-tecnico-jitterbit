const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    createOrder,
    getOrderById,
    listOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     description: >
 *       Recebe os dados do pedido no formato português (numeroPedido, valorTotal,
 *       dataCriacao, items) e transforma para o formato inglês antes de salvar no MongoDB.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Pedido já existe
 */
router.post('/', auth, createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     description: Retorna a lista completa de pedidos cadastrados, ordenados do mais recente para o mais antigo.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de pedidos
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Não autenticado
 */
router.get('/list', auth, listOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Obter pedido por número
 *     description: Retorna os dados de um pedido específico pelo seu número identificador.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Dados do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:orderId', auth, getOrderById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza os dados de um pedido existente pelo seu número identificador.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido a ser atualizado
 *         example: v10089015vdb-01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:orderId', auth, updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Excluir pedido
 *     description: Remove um pedido do banco de dados pelo seu número identificador.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido a ser excluído
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:orderId', auth, deleteOrder);

module.exports = router;
