const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

class UsuarioController {

    async criar(req, res) {

        try {

            const { nome, email, telefone, senha, tipo } = req.body;

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await Usuario.create({
                nome,
                email,
                telefone,
                senha: senhaHash,
                tipo
            });

            return res.status(201).json(usuario);

        } catch (err) {

            return res.status(500).json({
                erro: err.message
            });

        }

    }

    async listar(req, res) {

        try {

            const usuarios = await Usuario.findAll();

            return res.json(usuarios);

        } catch (err) {

            return res.status(500).json({
                erro: err.message
            });

        }

    }

}

module.exports = new UsuarioController();
