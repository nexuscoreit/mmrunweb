const db = require('../database/connection');

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE,
    precio REAL
  )
`);

const obtenerCategorias = (callback) => {
  db.all(`SELECT * FROM categorias`, (err, rows) => {
    callback(err, rows);
  });
};

const crearCategoria = (categoria, callback) => {
  const { title, precio } = categoria;
  db.run(
    `INSERT INTO categorias (title, precio) VALUES (?, ?)`,
    [title, precio],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

module.exports = {
  obtenerCategorias,
  crearCategoria
};
