const express = require('express');
const { saveTempInscriptionCtrl, saveInscriptionCtlr, listarInscriptos } = require('../controllers/inscripcionController');

module.exports = (io) => {
  const router = express.Router();

  router.post("/inscripciones-temp", saveTempInscriptionCtrl);
  router.post('/', (req, res) => saveInscriptionCtlr(req, res, io));
  router.get('/', listarInscriptos);

  return router;
};
