const db = require('../database/connection');

const getDistancesPrice = (fechaHoy) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT d.id, d.nombre, d.descripcion, d.con_remera, pp.precio
      FROM distancias d
      JOIN periodos_precio pp ON d.id = pp.distancia_id
      WHERE ? BETWEEN pp.fecha_inicio AND pp.fecha_fin
    `;

    db.all(query, [fechaHoy], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
    getDistancesPrice
};
