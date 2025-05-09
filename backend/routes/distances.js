const express = require("express");
const router = express.Router();
const { getDistancesCtlr, getPriceByNameCtlr } = require('../controllers/distancesController') 

router.get("/", getDistancesCtlr);
router.get("/:nombre/precio", getPriceByNameCtlr);

module.exports = router;
