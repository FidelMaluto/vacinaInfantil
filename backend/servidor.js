const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔥 isto é o que serve imagens corretamente
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use(express.static(path.join(__dirname, '../public')));

// MYSQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Angola@123',
    database: 'vacinainfantil'
});

db.connect(() => console.log('DB conectado'));

// MULTER (UPLOAD)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// LOGIN
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email=? AND senha=?',
        [email, senha],
        (err, results) => {
            if (err) return res.status(500).json({ erro: 'erro servidor' });

            if (results.length === 0)
                return res.json({ erro: 'dados inválidos' });

            res.json({ mensagem: 'OK', usuario: results[0] });
        }
    );
});

// VACINAS (LISTAR)
app.get('/vacinas', (req, res) => {
    db.query('SELECT * FROM vacinas', (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
});

// VACINAS (CRIAR + IMAGEM)
app.post('/vacinas', upload.single('imagem'), (req, res) => {
    const { nome, descricao, idade_recomendada, cuidados } = req.body;

    const imagem = req.file ? req.file.filename : null;

    db.query(
        `INSERT INTO vacinas(nome,descricao,idade_recomendada,cuidados,imagem)
     VALUES (?,?,?,?,?)`,
        [nome, descricao, idade_recomendada, cuidados, imagem],
        (err) => {
            if (err) return res.status(500).json({ erro: err });

            res.json({ mensagem: 'Vacina criada' });
        }
    );
});

// CRIANÇAS
app.post('/criancas', (req, res) => {
    const { usuario_id, nome, nascimento, sexo } = req.body;

    db.query(
        `INSERT INTO criancas(usuario_id,nome,nascimento,sexo)
     VALUES (?,?,?,?)`,
        [usuario_id, nome, nascimento, sexo],
        (err) => {
            if (err) return res.status(500).json({ erro: err });

            res.json({ mensagem: 'Criança adicionada' });
        }
    );
});

app.get('/criancas', (req, res) => {
    db.query(
        `SELECT c.*, u.nome AS responsavel
     FROM criancas c
     JOIN usuarios u ON c.usuario_id=u.id`,
        (err, results) => {
            if (err) return res.status(500).json({ erro: err });
            res.json(results);
        }
    );
});

// LISTAR VACINAÇÕES

app.get('/vacinacoes', (req, res) => {

    const sql = `
        SELECT
            vacinacoes.*,
            criancas.nome AS crianca,
            vacinas.nome AS vacina
        FROM vacinacoes
        JOIN criancas
            ON vacinacoes.crianca_id = criancas.id
        JOIN vacinas
            ON vacinacoes.vacina_id = vacinas.id
        ORDER BY vacinacoes.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                erro: 'Erro ao buscar vacinações'
            });

        }

        res.json(results);

    });

});

// EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fidel.maluto77@gmail.com',
        pass: 'd g m t m f u x v p b b s r e f'
    }
});

app.post('/enviar-email', async (req, res) => {
    try {
        const { email, nomeCrianca, vacina, data } = req.body;

        await transporter.sendMail({
            from: 'Vacina',
            to: email,
            subject: 'Vacina',
            html: `
        <h3>Vacinação</h3>
        <p>${nomeCrianca} - ${vacina} - ${data}</p>
      `
        });

        res.json({ mensagem: 'Email enviado' });

    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});
