const db = require('../models/db');

const guardarInscripcion = (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    genero,
    fechaNacimiento,
    email,
    telefono,
    ciudad,
    categoria,
    talle,
    descuento
  } = req.body;

  // Primero: verificar si ya existe ese DNI
  const checkSql = `SELECT * FROM inscripciones WHERE dni = ?`;
  db.get(checkSql, [dni], (err, row) => {
    if (err) {
      console.error('Error al verificar DNI:', err.message);
      return res.status(500).json({ error: 'Error al verificar el DNI' });
    }

    if (row) {
      return res.status(400).json({ error: 'Ya existe una inscripción con este DNI' });
    }

    // Si no existe, insertar
    const insertSql = `
      INSERT INTO inscripciones 
      (nombre, apellido, dni, genero, fechaNacimiento, email, telefono, ciudad, categoria, talle, descuento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      nombre,
      apellido,
      dni,
      genero,
      fechaNacimiento,
      email,
      telefono,
      ciudad,
      categoria,
      talle,
      descuento
    ];

    db.run(insertSql, params, function (err) {
      if (err) {
        console.error('Error al guardar inscripción:', err.message);
        return res.status(500).json({ error: 'Error al guardar inscripción' });
      }

      return res.status(200).json({ message: 'Inscripción guardada correctamente', id: this.lastID });
    });
  });
};
const listarInscriptos = (req, res) => {
    const sql = `SELECT * FROM inscripciones ORDER BY fechaRegistro DESC`;
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error al obtener inscriptos:', err.message);
        return res.status(500).json({ error: 'Error al obtener inscriptos' });
      }
  
      return res.status(200).json(rows);
    });
  };

module.exports = {
  guardarInscripcion,
  listarInscriptos
};
