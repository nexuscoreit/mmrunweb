const express = require('express');
const router = express.Router(); // ✅ Esta línea es clave
const { guardarInscripcion, listarInscriptos } = require('../controllers/inscripcionController');

router.post('/', guardarInscripcion);
router.get('/', listarInscriptos);

module.exports = router;
