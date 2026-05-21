const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const sequelize = require('./database');

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);

sequelize.authenticate()
    .then(() => {
        console.log('✅ MySQL conectado!');
    })
    .catch(err => {
        console.log('❌ Erro:', err);
    });
