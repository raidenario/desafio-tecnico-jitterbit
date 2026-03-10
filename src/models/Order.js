const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: [true, 'O ID do produto é obrigatório'],
    },
    quantity: {
        type: Number,
        required: [true, 'A quantidade é obrigatória'],
        min: [1, 'A quantidade deve ser no mínimo 1'],
    },
    price: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
        min: [0, 'O preço não pode ser negativo'],
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: [true, 'O número do pedido é obrigatório'],
        unique: true,
        trim: true,
    },
    value: {
        type: Number,
        required: [true, 'O valor total é obrigatório'],
        min: [0, 'O valor total não pode ser negativo'],
    },
    creationDate: {
        type: Date,
        required: [true, 'A data de criação é obrigatória'],
    },
    items: {
        type: [itemSchema],
        required: [true, 'Os itens do pedido são obrigatórios'],
        validate: {
            validator: (items) => items.length > 0,
            message: 'O pedido deve conter pelo menos um item',
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model('Order', orderSchema);
