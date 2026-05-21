const express = require('express');
const cors = require('cors');
const path = require('path');

const usuarioRoutes = require('./routes/usuarioRoutes');
const criancaRoutes = require('./routes/criancaRoutes');
const vacinaRoutes = require('./routes/vacinaRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/usuarios', usuarioRoutes);
app.use('/criancas', criancaRoutes);
app.use('/vacinas', vacinaRoutes);
app.use('/emails', emailRoutes);

module.exports = app;
