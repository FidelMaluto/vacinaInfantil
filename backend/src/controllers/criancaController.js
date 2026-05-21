const db = require('../config/database');

exports.create = (req, res) => {
    const { usuario_id, nome, nascimento, sexo } = req.body;

    db.query(
        'INSERT INTO criancas(usuario_id,nome,nascimento,sexo) VALUES (?,?,?,?)',
        [usuario_id, nome, nascimento, sexo],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ mensagem: "Criança criada" });
        }
    );
};

exports.getAll = (req, res) => {
    db.query(
        `SELECT criancas.*, usuarios.nome AS responsavel
         FROM criancas
         JOIN usuarios ON criancas.usuario_id = usuarios.id`,
        (err, results) => {
            if (err) return res.status(500).json({ erro: err });
            res.json(results);
        }
    );
};
