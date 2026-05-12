// VACINA-INFANTIL - SERVER NODE.JS (CORRIGIDO)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');

// ======================================
// APP
// ======================================
const app = express();

// ======================================
// MIDDLEWARES
// ======================================
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================================
// MYSQL CONNECTION
// ======================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Angola@123',
    database: 'vacinainfantil'
});

db.connect((err) => {
    if (err) {
        console.log('❌ Erro ao conectar no banco:', err);
        return;
    }
    console.log('✅ Banco de dados conectado!');
});

// ======================================
// EMAIL CONFIG
// ======================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'SEUEMAIL@gmail.com',
        pass: 'SUA_SENHA_DE_APP'
    }
});

// ======================================
// UPLOAD CONFIG (MULTER)
// ======================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// ======================================
// ROTAS BÁSICAS
// ======================================
app.get('/', (req, res) => {
    res.send('🚀 API Vacina-Infantil funcionando!');
});

// ======================================
// LOGIN
// ======================================
app.post('/login', (req, res) => {

    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ? AND senha = ?
    `;

    db.query(sql, [email, senha], (err, results) => {

        if (err) {
            return res.status(500).json({
                erro: 'Erro no servidor'
            });
        }

        if (results.length === 0) {
            return res.json({
                erro: 'Email ou senha inválidos'
            });
        }

        res.json({
            mensagem: 'Login OK',
            usuario: results[0]
        });

    });
});

// ======================================
// USUÁRIOS
// ======================================
app.post('/usuarios', (req, res) => {

    const { nome, email, telefone, senha, tipo } = req.body;

    const sql = `
        INSERT INTO usuarios(nome, email, telefone, senha, tipo)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, email, telefone, senha, tipo],
        (err) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao cadastrar usuário'
                });
            }

            res.json({
                mensagem: 'Usuário cadastrado com sucesso!'
            });

        });
});

// ======================================
// CRIANÇAS
// ======================================
app.post('/criancas', (req, res) => {

    const { usuario_id, nome, nascimento, sexo } = req.body;

    const sql = `
        INSERT INTO criancas(usuario_id, nome, nascimento, sexo)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [usuario_id, nome, nascimento, sexo],
        (err) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao cadastrar criança'
                });
            }

            res.json({
                mensagem: 'Criança cadastrada com sucesso!'
            });

        });
});

app.get('/criancas', (req, res) => {

    const sql = `
        SELECT criancas.*, usuarios.nome AS responsavel
        FROM criancas
        JOIN usuarios ON criancas.usuario_id = usuarios.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                erro: 'Erro ao buscar crianças'
            });
        }

        res.json(results);

    });
});

// ======================================
// VACINAS
// ======================================

// LISTAR VACINAS
app.get('/vacinas', (req, res) => {

    const sql = `SELECT * FROM vacinas`;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                erro: 'Erro ao buscar vacinas'
            });
        }

        res.json(results);

    });
});

// CADASTRAR VACINA COM IMAGEM (UPLOAD)
app.post('/vacinas', upload.single('imagem'), (req, res) => {

    const { nome, descricao, idade_recomendada, cuidados } = req.body;

    if (!req.file) {
        return res.status(400).json({
            mensagem: 'Imagem obrigatória'
        });
    }

    const imagem = req.file.filename;

    const sql = `
        INSERT INTO vacinas
        (nome, descricao, idade_recomendada, cuidados, imagem)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [nome, descricao, idade_recomendada, cuidados, imagem],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    mensagem: 'Erro ao inserir vacina'
                });
            }

            res.json({
                mensagem: 'Vacina cadastrada com sucesso!',
                imagem: imagem
            });

        }
    );

});

// VACINAÇÕES

app.get('/vacinacoes', (req, res) => {

    const sql = `SELECT * FROM vacinacoes`;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                erro: 'Erro ao buscar vacinações'
            });
        }

        res.json(results);

    });
});

// EMAIL

app.post('/enviar-email', (req, res) => {

    const { email, nomeCrianca, vacina, data } = req.body;

    const mailOptions = {
        from: 'SEUEMAIL@gmail.com',
        to: email,
        subject: '💉 Lembrete de Vacinação',
        html: `
            <div style="font-family:Arial;padding:20px;">
                <h2 style="color:#2563eb;">VacinaKids</h2>
                <p>Olá,</p>
                <p>A criança <strong>${nomeCrianca}</strong> deve tomar a vacina <strong>${vacina}</strong>.</p>
                <p>Data: <strong>${data}</strong></p>
                <p>💙 Não esqueça da vacinação!</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (err) => {

        if (err) {
            return res.status(500).json({
                erro: 'Erro ao enviar email'
            });
        }

        transporter.sendMail(mailOptions, (err, info) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    mensagem: 'Erro ao enviar email'
                });
            }

            return res.json({
                mensagem: '📧 Email enviado com sucesso!',
                info: info.response
            });

        });

    });
});

// SERVER START

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
