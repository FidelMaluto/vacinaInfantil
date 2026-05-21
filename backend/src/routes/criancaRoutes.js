const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ ok: true, message: "criancas route OK" });
});

module.exports = router;
