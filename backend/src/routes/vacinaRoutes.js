const router = require('express').Router();
const multer = require('multer');
const controller = require('../controllers/vacinaController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.get('/', controller.getAll);
router.post('/', upload.single('imagem'), controller.create);

module.exports = router;
