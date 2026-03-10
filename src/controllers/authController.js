const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Campos obrigatórios: username e password.',
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                error: 'Este nome de usuário já está em uso.',
            });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({
            message: 'Usuário registrado com sucesso.',
            user: { id: user._id, username: user.username },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Campos obrigatórios: username e password.',
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: 'Credenciais inválidas.',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Credenciais inválidas.',
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
