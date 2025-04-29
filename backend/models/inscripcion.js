const db = require('../database/connection');

const crearInscripcion = (data, callback) => {
  const {
    nombre, apellido, dni, genero, fechaNacimiento,
    email, telefono, ciudad, categoria, talle, descuento
  } = data;

  const sql = `
    INSERT INTO inscripciones (
      nombre, apellido, dni, genero, fechaNacimiento,
      email, telefono, ciudad, categoria, talle, descuento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    nombre, apellido, dni, genero, fechaNacimiento,
    email, telefono, ciudad, categoria, talle, descuento
  ];

  db.run(sql, params, function (err) {
    callback(err, this?.lastID);
  });
};

const existeDNI = (dni, callback) => {
  const sql = `SELECT * FROM inscripciones WHERE dni = ?`;
  db.get(sql, [dni], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  crearInscripcion,
  existeDNI
};
