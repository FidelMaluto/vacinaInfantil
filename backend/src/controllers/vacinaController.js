const db = require('../config/database');

exports.create = (req, res) => {

    const { nome, descricao, idade_recomendada, cuidados } = req.body;

    const imagem = req.file ? req.file.filename : null;

    db.query(
        `INSERT INTO vacinas(nome,descricao,idade_recomendada,cuidados,imagem)
         VALUES (?,?,?,?,?)`,
        [nome, descricao, idade_recomendada, cuidados, imagem],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ mensagem: "Vacina criada" });
        }
    );
};

exports.getAll = (req, res) => {
    db.query('SELECT * FROM vacinas', (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};
