// backend/routes/mercadopago.js
const express = require("express");
const router = express.Router();
const {createPreference, successPayment} = require("../controllers/mercadopagoController")

router.post("/create-preference", createPreference);
router.get("/success", successPayment);

module.exports = router;
