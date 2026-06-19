const router = require('express').Router();

router.post('/enviar', (req, res) => {
    res.json({ mensagem: "email route OK" });
});

module.exports = router;