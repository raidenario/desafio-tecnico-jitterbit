const { mapRequestToOrder, mapOrderToResponse } = require('./mapper');

describe('Utils: mapper', () => {
    it('deve converter os dados do formato de request (PT) para o formato do banco (EN)', () => {
        const mockRequest = {
            numeroPedido: 'v123456',
            valorTotal: 500,
            dataCriacao: '2023-01-01T10:00:00.000Z',
            items: [
                {
                    idItem: '12',
                    quantidadeItem: 2,
                    valorItem: 250,
                },
            ],
        };

        const result = mapRequestToOrder(mockRequest);

        expect(result.orderId).toBe('v123456');
        expect(result.value).toBe(500);
        expect(result.creationDate).toBeInstanceOf(Date);
        expect(result.items.length).toBe(1);
        expect(result.items[0].productId).toBe(12);
        expect(result.items[0].quantity).toBe(2);
        expect(result.items[0].price).toBe(250);
    });

    it('deve converter os dados do banco (EN) para o formato de resposta da API', () => {
        const mockDbOrder = {
            orderId: 'v123456',
            value: 500,
            creationDate: new Date('2023-01-01T10:00:00.000Z'),
            items: [
                {
                    productId: 12,
                    quantity: 2,
                    price: 250,
                },
            ],
        };

        const result = mapOrderToResponse(mockDbOrder);

        expect(result.orderId).toBe('v123456');
        expect(result.value).toBe(500);
        expect(result.creationDate).toEqual(new Date('2023-01-01T10:00:00.000Z'));
        expect(result.items.length).toBe(1);
        expect(result.items[0].productId).toBe(12);
        expect(result.items[0].quantity).toBe(2);
        expect(result.items[0].price).toBe(250);
    });
});
