const express = require('express');
const router = express.Router();

// Mock de distancias disponibles para inscripción
router.get('/', (req, res) => {
  const distancias = [
    { title: "5K", precio: 6000 },
    { title: "10K", precio: 8000 },
    { title: "20K", precio: 10000 },
    { title: "KIDS", precio: 12000 },
    { title: "Caminata", precio: 0 }
  ];
  res.json(distancias);
});

module.exports = router;
