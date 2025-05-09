// backend/routes/discounts.js
const express = require('express');
const router = express.Router();
const {getValidDiscountsCtlr} = require('../controllers/discountsController');


router.get('/', getValidDiscountsCtlr);

module.exports = router;
