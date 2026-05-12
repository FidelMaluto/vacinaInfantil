// VACINA-INFANTIL - SERVER NODE.JS

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');


const app = express();

// CONFIGURAÇÕES
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CONEXÃO COM MYSQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Angola@123',
    database: 'vacinainfantil'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar no banco:', err);
        return;
    }
    console.log('✅ Banco de dados conectado!');
});

// CONFIGURAÇÃO DO EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'SEUEMAIL@gmail.com',
        pass: 'SUA_SENHA_DE_APP'
    }
});

// ROTA TESTE

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/', (req, res) => {
    res.send('🚀 API Vacina-Infantil funcionando!');
});

// CADASTRAR USUÁRIO

app.post('/usuarios', (req, res) => {
    const { nome, email, telefone, senha, tipo } = req.body;

    const sql = `INSERT INTO usuarios(nome, email, telefone, senha, tipo) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [nome, email, telefone, senha, tipo],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    erro: 'Erro ao cadastrar usuário'
                });
            }

            res.json({ mensagem: '✅ Usuário cadastrado com sucesso!' });
        });
});

// CADASTRAR CRIANÇA

app.post('/criancas', (req, res) => {
    const { usuario_id, nome, nascimento, sexo } = req.body;

    const sql = `INSERT INTO criancas(usuario_id, nome, nascimento, sexo) VALUES (?, ?, ?, ?)`;

    db.query(sql, [usuario_id, nome, nascimento, sexo],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    erro: 'Erro ao cadastrar criança'
                });
            }

            res.json({ mensagem: '👶 Criança cadastrada com sucesso!' });

        });
});

// LISTAR VACINAS

app.get('/vacinas', (req, res) => {
    const sql = `SELECT * FROM vacinas`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                erro: 'Erro ao buscar vacinas'
            });
        }
        res.json(results);
    });
});

// REGISTRAR VACINAÇÃO

app.post('/vacinacoes', (req, res) => {
    const { crianca_id, vacina_id, data_aplicacao, proxima_dose } = req.body;

    const sql = `INSERT INTO vacinacoes(crianca_id, vacina_id, data_aplicacao, proxima_dose,status) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [crianca_id, vacina_id, data_aplicacao, proxima_dose, 'Tomada'],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.statu(500).json({
                    erro: 'Erro ao registrar vacinação'
                });
            }

            res.json({ mensagem: '💉 Vacinação registrada!' });

        });
});

// LISTAR VACINAÇÕES

app.get('/vacinacoes', (req, res) => {
    const sql = `SELECT * FROM vacinacoes`;

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

// ENVIAR NOTIFICAÇÃO POR EMAIL

app.post('/enviar-email', (req, res) => {
    const { email, nomeCrianca, vacina, data } = req.body;

    const mailOptions = {
        from: 'SEUEMAIL@gmail.com',
        to: email,
        subject: '💉 Lembrete de Vacinação',
        html: `        
            <div style="font-family:Arial;padding:20px;">

                <h2 style="color:#2563eb;">
                    VacinaKids
                </h2>

                <p>
                    Olá,
                </p>

                <p>
                    A criança <strong>${nomeCrianca}</strong>
                    deve tomar a vacina
                    <strong>${vacina}</strong>.
                </p>

                <p>
                    Data prevista:
                    <strong>${data}</strong>
                </p>

                <br>

                <p>
                    Não esqueça da vacinação 💙
                </p>

            </div>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                erro: 'Erro ao enviar email'
            });

        }

        res.json({ mensagem: '📧 Email enviado com sucesso!' });
    });
});

// LISTAR CRIANÇAS

app.get('/criancas', (req, res) => {

    const sql = `SELECT criancas.*, usuarios.nome AS responsavel FROM criancas JOIN usuarios
        ON criancas.usuario_id = usuarios.id `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                erro: 'Erro ao buscar crianças'
            });

        }

        res.json(results);

    });
});

// LOGIN

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

            mensagem: 'Login OK'

        });

    });

});

// SERVIDOR

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
