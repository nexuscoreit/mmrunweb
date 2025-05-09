const db = require('../database/connection');

const obtenerDescuentos = (callback) => {
  db.all(`SELECT * FROM descuentos`, (err, rows) => {
    callback(err, rows);
  });
};

const crearDescuento = (descuento, callback) => {
  const { discountName, percentage } = descuento;
  db.run(
    `INSERT INTO descuentos (discountName, percentage) VALUES (?, ?)`,
    [discountName, percentage],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

module.exports = {
  obtenerDescuentos,
  crearDescuento
};
