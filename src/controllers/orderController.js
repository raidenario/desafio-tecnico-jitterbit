const Order = require('../models/Order');
const { mapRequestToOrder, mapOrderToResponse } = require('../utils/mapper');

const createOrder = async (req, res, next) => {
    try {
        const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

        if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
            return res.status(400).json({
                error: 'Campos obrigatórios ausentes. Envie: numeroPedido, valorTotal, dataCriacao e items.',
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'O pedido deve conter pelo menos um item.',
            });
        }

        const orderData = mapRequestToOrder(req.body);

        const order = new Order(orderData);
        await order.save();

        res.status(201).json({
            message: 'Pedido criado com sucesso.',
            order: mapOrderToResponse(order),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Já existe um pedido com este número.',
            });
        }
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                error: `Pedido com número '${orderId}' não encontrado.`,
            });
        }

        res.status(200).json(mapOrderToResponse(order));
    } catch (error) {
        next(error);
    }
};

const listOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            total: orders.length,
            orders: orders.map(mapOrderToResponse),
        });
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const existingOrder = await Order.findOne({ orderId });

        if (!existingOrder) {
            return res.status(404).json({
                error: `Pedido com número '${orderId}' não encontrado.`,
            });
        }

        const updateData = mapRequestToOrder(req.body);

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            { ...updateData, orderId },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Pedido atualizado com sucesso.',
            order: mapOrderToResponse(updatedOrder),
        });
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await Order.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({
                error: `Pedido com número '${orderId}' não encontrado.`,
            });
        }

        res.status(200).json({
            message: `Pedido '${orderId}' excluído com sucesso.`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrderById,
    listOrders,
    updateOrder,
    deleteOrder,
};
