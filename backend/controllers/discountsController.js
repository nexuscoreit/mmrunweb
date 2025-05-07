const {getValidDiscounts} = require('../models/discount');

const getValidDiscountsCtlr = (req, res) => {
    getValidDiscounts((err, rows) => {
      if (err) {
        console.error("Error al obtener descuentos:", err.message);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      res.json(rows);
      console.log(rows);
    });
};

module.exports = { getValidDiscountsCtlr};
