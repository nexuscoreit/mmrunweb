const express = require("express");
const router = express.Router();
const { getDistances, getPriceByName } = require('../controllers/distancesController') 

router.get("/", getDistances);
router.get("/:nombre/precio", getPriceByName);

module.exports = router;
