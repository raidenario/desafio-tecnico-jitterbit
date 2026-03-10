const { createOrder, getOrderById, listOrders, updateOrder, deleteOrder } = require('./orderController');
const Order = require('../models/Order');

jest.mock('../models/Order');

// Payload PT valido
const validBodyRequest = {
    numeroPedido: 'v999',
    valorTotal: 100,
    dataCriacao: '2023-01-01T00:00:00.000Z',
    items: [{ idItem: '1', quantidadeItem: 2, valorItem: 50 }]
};

// Documento MongoDB Mock simulado (Saída EN)
const mockOrderDocument = {
    orderId: 'v999',
    value: 100,
    creationDate: new Date('2023-01-01T00:00:00.000Z'),
    items: [
        { productId: 1, quantity: 2, price: 50 }
    ]
};

describe('Controller: orderController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('deve retornar 400 se faltar campos obrigatórios', async () => {
            req.body = { numeroPedido: '123' }; // Falta resto
            await createOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });

        it('deve retornar 400 se items for vazio ou inválido', async () => {
            req.body = { ...validBodyRequest, items: [] };
            await createOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);

            req.body = { ...validBodyRequest, items: "nao_array" };
            await createOrder(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 201 e criar ordem com sucesso', async () => {
            req.body = validBodyRequest;
            const mockSave = jest.fn().mockResolvedValue(mockOrderDocument);
            Order.mockImplementation(() => ({
                ...mockOrderDocument,
                save: mockSave
            }));

            await createOrder(req, res, next);

            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Pedido criado com sucesso.',
                order: expect.objectContaining({ orderId: 'v999' })
            }));
        });

        it('deve retornar 409 se numero do pedido (orderId) ja existir', async () => {
            req.body = validBodyRequest;
            const error = new Error('Duplicate key');
            error.code = 11000;

            const mockSave = jest.fn().mockRejectedValue(error);
            Order.mockImplementation(() => ({ save: mockSave }));

            await createOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Já existe um pedido com este número.' });
        });
    });

    describe('getOrderById', () => {
        it('deve retornar 404 se não for encontrado', async () => {
            req.params.orderId = 'v000';
            Order.findOne.mockResolvedValue(null);

            await getOrderById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Pedido com número 'v000' não encontrado." });
        });

        it('deve retornar 200 com os dados mapeados se encontrado', async () => {
            req.params.orderId = 'v999';
            Order.findOne.mockResolvedValue(mockOrderDocument);

            await getOrderById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ orderId: 'v999' }));
        });
    });

    describe('listOrders', () => {
        it('deve retornar 200 e a lista de pedidos mapeada', async () => {
            const mockSort = jest.fn().mockResolvedValue([mockOrderDocument, mockOrderDocument]);
            Order.find.mockReturnValue({ sort: mockSort });

            await listOrders(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                total: 2,
                orders: expect.any(Array)
            });
        });
    });

    describe('updateOrder', () => {
        it('deve retornar 404 se pedido nao existir na tentativa de update', async () => {
            req.params.orderId = 'v000';
            req.body = validBodyRequest;
            Order.findOne.mockResolvedValue(null);

            await updateOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 200 e os dados atualizados em sucesso', async () => {
            req.params.orderId = 'v999';
            req.body = validBodyRequest;
            Order.findOne.mockResolvedValue(mockOrderDocument);
            Order.findOneAndUpdate.mockResolvedValue(mockOrderDocument); // simulando update

            await updateOrder(req, res, next);

            expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
                { orderId: 'v999' },
                expect.any(Object),
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Pedido atualizado com sucesso.' }));
        });
    });

    describe('deleteOrder', () => {
        it('deve retornar 404 se pedido não existir na exclusao', async () => {
            req.params.orderId = 'v000';
            Order.findOneAndDelete.mockResolvedValue(null);

            await deleteOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 200 indicando exclusao em sucesso', async () => {
            req.params.orderId = 'v999';
            Order.findOneAndDelete.mockResolvedValue(mockOrderDocument);

            await deleteOrder(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Pedido 'v999' excluído com sucesso." });
        });
    });
});
