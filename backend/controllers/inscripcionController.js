const db = require('../database/connection');
const server = require('../server');
const io = server.io;

async function guardarInscripcion(req, res, io) {
  try {
    const nuevaInscripcion = { ...req.body, fechaRegistro: new Date().toISOString() };

    const result = await db.run(`
      INSERT INTO inscripciones (
        nombre, apellido, dni, genero, fechaNacimiento, email,
        telefono, ciudad, categoria, talle, descuento, fechaRegistro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nuevaInscripcion.nombre,
      nuevaInscripcion.apellido,
      nuevaInscripcion.dni,
      nuevaInscripcion.genero,
      nuevaInscripcion.fechaNacimiento,
      nuevaInscripcion.email,
      nuevaInscripcion.telefono,
      nuevaInscripcion.ciudad,
      nuevaInscripcion.categoria,
      nuevaInscripcion.talle,
      nuevaInscripcion.descuento || '',
      nuevaInscripcion.fechaRegistro
    ]);
    console.log("🔥 Emitiendo inscripción por socket:", nuevaInscripcion);

    io.emit("nueva-inscripcion", nuevaInscripcion); // ✅ esto envía al admin en vivo

    res.status(201).json({ mensaje: "Inscripción registrada", id: result.lastID });

  } catch (error) {
    console.error("Error al guardar inscripción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


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