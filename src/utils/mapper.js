const mapRequestToOrder = (body) => {
    const { numeroPedido, valorTotal, dataCriacao, items } = body;

    return {
        orderId: numeroPedido,
        value: valorTotal,
        creationDate: new Date(dataCriacao),
        items: items.map((item) => ({
            productId: parseInt(item.idItem, 10),
            quantity: item.quantidadeItem,
            price: item.valorItem,
        })),
    };
};

const mapOrderToResponse = (order) => {
    return {
        orderId: order.orderId,
        value: order.value,
        creationDate: order.creationDate,
        items: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        })),
    };
};

module.exports = {
    mapRequestToOrder,
    mapOrderToResponse,
};
