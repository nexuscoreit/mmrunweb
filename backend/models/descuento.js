// backend/models/descuento.js
const db = require('./db');

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS descuentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discountName TEXT UNIQUE,
    percentage INTEGER
  )
`);

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
