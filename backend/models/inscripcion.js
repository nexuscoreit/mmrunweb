// backend/models/inscripcion.js
const db = require('./db');

db.run(`
  CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    dni TEXT UNIQUE,
    genero TEXT,
    fechaNacimiento TEXT,
    email TEXT,
    telefono TEXT,
    ciudad TEXT,
    categoria TEXT,
    talle TEXT,
    descuento TEXT,
    pagado INTEGER DEFAULT 0,
    fechaRegistro TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

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
