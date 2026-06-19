const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ ok: true, message: "usuarios route OK" });
});

module.exports = router;