const authMiddleware = require('./auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Middleware: auth', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test_secret';
    });

    it('deve retornar 401 se nao houver header de autorizacao', () => {
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. Token de autenticação não fornecido.' });
    });

    it('deve retornar 401 se o formato do token for invalido (sem Bearer)', () => {
        req.headers.authorization = 'InvalidFormat token123';
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Formato de token inválido. Utilize: Bearer <token>.' });
    });

    it('deve chamar next e anexar user no req se o token for valido', () => {
        req.headers.authorization = 'Bearer validtoken';
        const decodedUser = { id: 'user123', username: 'admin' };
        jwt.verify.mockReturnValue(decodedUser);

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test_secret');
        expect(req.user).toEqual(decodedUser);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token estiver expirado', () => {
        req.headers.authorization = 'Bearer expiredtoken';
        const error = new Error('Expired');
        error.name = 'TokenExpiredError';
        jwt.verify.mockImplementation(() => { throw error; });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token expirado. Faça login novamente.' });
    });

    it('deve retornar 401 se o token for invalido', () => {
        req.headers.authorization = 'Bearer invalidtoken';
        const error = new Error('Invalid');
        error.name = 'JsonWebTokenError';
        jwt.verify.mockImplementation(() => { throw error; });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido.' });
    });
});
