const errorHandler = require('./errorHandler');

describe('Middleware: errorHandler', () => {
    let err, req, res, next;

    beforeEach(() => {
        err = new Error('Erro padrão');
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        // Suprime o console.error durante os testes para não poluir o output
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('deve lidar com ValidationError do Mongoose e retornar status 400', () => {
        err.name = 'ValidationError';
        err.errors = {
            campo1: { message: 'Erro no campo 1' },
            campo2: { message: 'Erro no campo 2' },
        };

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro de validação.',
            details: ['Erro no campo 1', 'Erro no campo 2'],
        });
    });

    it('deve lidar com CastError do Mongoose e retornar status 400', () => {
        err.name = 'CastError';
        err.path = 'idProduto';
        err.value = 'invalid';

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Valor inválido para o campo 'idProduto': invalid",
        });
    });

    it('deve lidar com erro de Duplicate Key (11000) e retornar status 409', () => {
        err.code = 11000;
        err.keyValue = { orderId: 'v123' };

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Valor duplicado para o campo: orderId',
        });
    });

    it('deve lidar com JSON malformado (entity.parse.failed) e retornar status 400', () => {
        err.type = 'entity.parse.failed';

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'JSON inválido no corpo da requisição.',
        });
    });

    it('deve lidar com erros genéricos da API usando status 500 se não definido', () => {
        const errorMsg = 'Algo de errado não está certo';
        const genericError = new Error(errorMsg);

        errorHandler(genericError, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
    });

    it('deve lidar com erros que já possuam statusCode customizado', () => {
        const errorMsg = 'Não autorizado';
        const customError = new Error(errorMsg);
        customError.status = 403;

        errorHandler(customError, req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: errorMsg });
    });
});
