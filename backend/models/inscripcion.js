const db = require('../database/connection');

function saveTempInscription(inscripcion, callback) {
  const sql = `
    INSERT INTO inscripciones_temp (
      id, nombre, apellido, dni, genero, fechaNacimiento, email, telefono,
      ciudad, distancia_id, distancia, talle, codigoDescuento, precio
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const params = [
    inscripcion.id,
    inscripcion.nombre,
    inscripcion.apellido,
    inscripcion.dni,
    inscripcion.genero,
    inscripcion.fechaNacimiento,
    inscripcion.email,
    inscripcion.telefono,
    inscripcion.ciudad,
    inscripcion.distancia_id,
    inscripcion.distancia,
    inscripcion.talle,
    inscripcion.codigoDescuento,
    inscripcion.precio
  ];

  console.log(params);
  db.run(sql, params, function (err) {
    callback(err, this.lastID);
  });
}

function getTempInscriptionById(id, callback) {
  db.get(`SELECT * FROM inscripciones_temp WHERE id = ?`, [id], callback);
}

function deleteTempInscriptionById(id, callback) {
  db.run(`DELETE FROM inscripciones_temp WHERE id = ?`, [id], callback);
}

function saveInscription(inscripcion, callback) {
  const sql = `
    INSERT INTO inscripciones (
      id, nombre, apellido, dni, genero, fechaNacimiento, email, telefono, 
      ciudad, distancia_id, distancia, talle, codigoDescuento, precio, mpPayerId, mpPayerEmail
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    inscripcion.id,
    inscripcion.nombre,
    inscripcion.apellido,
    inscripcion.dni,
    inscripcion.genero,
    inscripcion.fechaNacimiento,
    inscripcion.email,
    inscripcion.telefono,
    inscripcion.ciudad,
    inscripcion.distancia_id,
    inscripcion.distancia,
    inscripcion.talle,
    inscripcion.codigoDescuento || '',
    inscripcion.precio,
    mpPayerId,
    mpPayerEmail
  ];
  console.log("inscripto", params);
  db.run(sql, params, function (err) {
    callback(err, this.lastID);
  });
}

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

module.exports = { saveTempInscription, getTempInscriptionById, deleteTempInscriptionById, saveInscription, crearInscripcion, existeDNI };
