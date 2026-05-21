const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const usuarioRoutes = require('./routes/usuarioRoutes');
const criancaRoutes = require('./routes/criancaRoutes');
const vacinaRoutes = require('./routes/vacinaRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use(express.static(path.join(__dirname, '../public')));

// routes
app.use('/usuarios', usuarioRoutes);
app.use('/criancas', criancaRoutes);
app.use('/vacinas', vacinaRoutes);
app.use('/email', emailRoutes);

// teste
app.get('/', (req, res) => {
    res.json({ ok: true, message: "API Vacina Infantil OK" });
});

module.exports = app;
