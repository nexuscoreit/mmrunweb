// backend/routes/mercadopago.js
const express = require("express");
const router = express.Router();

router.post("/create-preference", (req, res) => {
  console.log("📩 Simulando preferencia de MercadoPago");
  console.log("Body recibido:", req.body);

  // Devuelve una URL ficticia que redirige con parámetros de éxito
  res.json({
    init_point: "http://localhost:5500/form/index.html?status=approved&runner_id=1"
  });
});

module.exports = router;
