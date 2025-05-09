const db = require('../database/connection');
const {discountUse} = require('../models/discount');
const {saveTempInscription, saveInscription} = require('../models/inscripcion');
const server = require('../server');
const io = server.io;

const saveTempInscriptionCtrl = (req, res) => {
  const inscripcion = req.body;

  if (!inscripcion.nombre || !inscripcion.apellido || !inscripcion.dni || !inscripcion.email || !inscripcion.distancia_id || !inscripcion.precio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  saveTempInscription(inscripcion, (err, lastID) => {
    if (err) {
      console.error("Error guardando inscripto temporal:", err.message);
      return res.status(500).json({ error: "Error al guardar inscripción temporal" });
    }

    res.status(201).json({ message: "Inscripción temporal guardada", temp_id: lastID });
  });
};

async function saveInscriptionCtrl(req, res, io) {
    try {
      const nuevaInscripcion = {
        ...req.body,
        fechaRegistro: new Date().toISOString()
      };
  
      saveInscription(nuevaInscripcion, (err, lastID) => {
        if (err) {
          console.error("Error al guardar inscripción:", err);
          return res.status(500).json({ error: "Error al guardar inscripción" });
        }
  
        console.log("🔥 Emitiendo inscripción por socket:", nuevaInscripcion);
        io.emit("nueva-inscripcion", nuevaInscripcion);
  
        res.status(201).json({ mensaje: "Inscripción registrada", id: lastID });
      });
    } catch (error) {
      console.error("Error interno:", error);
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


const checkCupoCtrl = async (req, res) => {
  try {
    const total = await getTotalInscription();
    const cuposDisponibles = 800 - total;

    res.status(200).json({ cuposDisponibles });
  } catch (error) {
    console.error("Error al consultar cupos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

module.exports = { saveTempInscriptionCtrl, saveInscriptionCtrl, listarInscriptos, checkCupoCtrl};