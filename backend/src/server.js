const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const app = require('./app');

const PORT = process.env.PORT || 3000;

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
