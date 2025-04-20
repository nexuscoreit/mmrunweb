const db = require('./db');
const bcrypt = require('bcrypt');

// Crear tabla si no existe (esto es lo que te faltaba)
db.run(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

const crearAdmin = async (email, plainPassword, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    db.run(
      `INSERT INTO admin (email, password) VALUES (?, ?)`,
      [email, hashedPassword],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  } catch (err) {
    callback(err, null);
  }
};

const obtenerAdminPorEmail = (email, callback) => {
  db.get(`SELECT * FROM admin WHERE email = ?`, [email], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  crearAdmin,
  obtenerAdminPorEmail
};
