const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            error: 'Erro de validação.',
            details: messages,
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            error: `Valor inválido para o campo '${err.path}': ${err.value}`,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(', ');
        return res.status(409).json({
            error: `Valor duplicado para o campo: ${field}`,
        });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'JSON inválido no corpo da requisição.',
        });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor.',
    });
};

module.exports = errorHandler;
