const { register, login } = require('./authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock dependencias externas
jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Controller: authController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'secret_test';
    });

    describe('register', () => {
        it('deve retornar 400 se faltar username ou password', async () => {
            req.body = { username: 'admin' }; // missing password
            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios: username e password.' });
        });

        it('deve retornar 409 se usuario ja existir', async () => {
            req.body = { username: 'admin', password: '123' };
            User.findOne.mockResolvedValue({ _id: '123', username: 'admin' });

            await register(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'admin' });
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Este nome de usuário já está em uso.' });
        });

        it('deve retornar 201 e criar um novo usuario com sucesso', async () => {
            req.body = { username: 'admin', password: '123' };
            User.findOne.mockResolvedValue(null);

            const mockedSave = jest.fn();
            User.mockImplementation(() => ({
                _id: 'db_id_123',
                username: 'admin',
                save: mockedSave
            }));

            await register(req, res, next);

            expect(mockedSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Usuário registrado com sucesso.',
                user: { id: 'db_id_123', username: 'admin' }
            });
        });

        it('deve chamar next(error) se houver erro interno', async () => {
            req.body = { username: 'admin', password: '123' };
            const err = new Error('Database falhou');
            User.findOne.mockRejectedValue(err);

            await register(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('login', () => {
        it('deve retornar 400 se faltar username ou password', async () => {
            req.body = { password: '123' }; // missing username
            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios: username e password.' });
        });

        it('deve retornar 401 se credenciais invalidas (usuario nao encontrado)', async () => {
            req.body = { username: 'admin', password: '123' };
            User.findOne.mockResolvedValue(null);

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' });
        });

        it('deve retornar 401 se senha estiver incorreta', async () => {
            req.body = { username: 'admin', password: 'wrong' };
            const mockedCompare = jest.fn().mockResolvedValue(false);
            User.findOne.mockResolvedValue({ username: 'admin', comparePassword: mockedCompare });

            await login(req, res, next);

            expect(mockedCompare).toHaveBeenCalledWith('wrong');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' });
        });

        it('deve retornar 200 e um token JWT válido em caso de sucesso', async () => {
            req.body = { username: 'admin', password: 'correctpwd' };
            const mockUserObj = { _id: '1234', username: 'admin', comparePassword: jest.fn().mockResolvedValue(true) };
            User.findOne.mockResolvedValue(mockUserObj);
            jwt.sign.mockReturnValue('mocked.jwt.token');

            await login(req, res, next);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: '1234', username: 'admin' },
                'secret_test',
                { expiresIn: '24h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login realizado com sucesso.',
                token: 'mocked.jwt.token'
            });
        });

        it('deve passar o erro para o next em falhas imprevistas', async () => {
            req.body = { username: 'admin', password: '123' };
            const err = new Error('Falha catastrófica');
            User.findOne.mockRejectedValue(err);

            await login(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
