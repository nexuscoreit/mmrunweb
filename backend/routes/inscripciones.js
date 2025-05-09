const express = require('express');
const { saveTempInscriptionCtrl, saveInscriptionCtrl, listarInscriptos, checkCupoCtrl } = require('../controllers/inscripcionController');

module.exports = (io) => {
  const router = express.Router();

  router.post("/inscripciones-temp", saveTempInscriptionCtrl);
  router.post('/', (req, res) => saveInscriptionCtrl(req, res, io));
  router.get('/', listarInscriptos);
  router.get('/cupo-disponible', checkCupoCtrl);


  return router;
};
