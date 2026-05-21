const router = require('express').Router();

const usuarioController =
require('../controllers/usuarioController');

router.post('/', usuarioController.criar);

router.get('/', usuarioController.listar);

module.exports = router;
