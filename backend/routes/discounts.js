// backend/routes/discounts.js
const express = require('express');
const router = express.Router();
const {
  obtenerDescuentos,
  crearDescuento
} = require('../models/descuento');

// Obtener todos los descuentos
router.get('/', (req, res) => {
  obtenerDescuentos((err, descuentos) => {
    if (err) {
      console.error('Error al obtener descuentos:', err.message);
      return res.status(500).json({ error: 'Error al obtener descuentos' });
    }
    res.status(200).json(descuentos);
  });
});

// Crear un nuevo descuento (opcional, si se usa desde admin o scripts)
router.post('/', (req, res) => {
  const { discountName, percentage } = req.body;

  if (!discountName || !percentage) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  crearDescuento({ discountName, percentage }, (err, id) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'El nombre del descuento ya existe' });
      }
      console.error('Error al crear descuento:', err.message);
      return res.status(500).json({ error: 'Error al crear descuento' });
    }

    res.status(201).json({ message: 'Descuento creado correctamente', id });
  });
});

module.exports = router;
