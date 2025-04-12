const express = require('express');
const router = express.Router();

// Mock de descuentos disponibles
router.get('/', (req, res) => {
  const descuentos = [
    { discountName: "CLUB2024", percentage: 20 },
    { discountName: "MMRUN10", percentage: 10 },
    { discountName: "RUNFAMILY", percentage: 15 }
  ];
  res.json(descuentos);
});

module.exports = router;
