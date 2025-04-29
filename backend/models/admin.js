const db = require('../database/connection');
const bcrypt = require('bcrypt');

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
