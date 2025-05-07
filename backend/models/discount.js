const db = require('../database/connection');

function getDiscountByCode(codigo, callback) {
  const today = new Date().toISOString().split("T")[0];
  console.log(codigo);
  const sql = `
    SELECT * FROM codigos_descuento
    WHERE codigo = ?
      AND (fecha_vencimiento IS NULL OR fecha_vencimiento >= ?)
      AND (usos_restantes IS NULL OR usos_restantes > 0)
  `;

  db.get(sql, [codigo.toUpperCase(), today], (err, row) => {
    callback(err, row);
  });
}


// Obtener descuentos válidos (por fecha y usos)
function getValidDiscounts(callback) {
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT * FROM codigos_descuento
    WHERE (fecha_vencimiento IS NULL OR fecha_vencimiento >= ?)
      AND (usos_restantes IS NULL OR usos_restantes > 0)
  `;

  db.all(sql, [today], (err, rows) => {
    callback(err, rows);
  });
}

function discountUse(codigo, callback) {
  const sql = `
    UPDATE codigos_descuento
    SET usos_restantes = usos_restantes - 1
    WHERE codigo = ?
      AND usos_restantes > 0
  `;

  db.run(sql, [codigo], function (err) {
    if (err) {
      console.error("Error al descontar uso del código:", err.message);
    }
    callback(err, this.changes); // Cuántas filas se modificaron
  });
}

function applyDiscount(codigo, precioOriginal, callback) {
  const hoy = new Date().toISOString().slice(0, 10);
  const sql = `SELECT * FROM codigos_descuento WHERE codigo = ?`;

  db.get(sql, [codigo.toUpperCase()], (err, row) => {
    if (err || !row || row.usosDisponibles <= 0 || row.fecha_vencimiento < hoy) {
      return callback(null, { precioFinal: precioOriginal, porcentaje: 0 });
    }

    const porcentaje = row.percentage;
    const precioFinal = precioOriginal - (precioOriginal * porcentaje / 100);
    callback(null, { precioFinal, porcentaje });
  });
}

const crearDescuento = (descuento, callback) => {
  const { discountName, percentage } = descuento;
  db.run(
    `INSERT INTO descuentos (codigo, percentaje) VALUES (?, ?)`,
    [discountName, percentage],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

module.exports = { getDiscountByCode, getValidDiscounts, discountUse, applyDiscount, crearDescuento};
