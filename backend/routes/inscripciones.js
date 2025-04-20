const express = require('express');
const { guardarInscripcion, listarInscriptos } = require('../controllers/inscripcionController');

module.exports = (io) => {
  const router = express.Router();

  router.post('/', (req, res) => guardarInscripcion(req, res, io));
  router.get('/', listarInscriptos);

  return router;
};
