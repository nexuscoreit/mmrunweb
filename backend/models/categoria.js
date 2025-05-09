const db = require('../database/connection');

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
