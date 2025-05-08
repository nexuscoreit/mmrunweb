const db = require("../database/connection");
const {getDistancesPrice} = require("../models/distance");
const {getLocalDate} = require("../utils/dateUtils");

const getDistancesCtlr = async(req, res) => {
  try {
    const hoy = req.query.fecha || getLocalDate(); // 'YYYY-MM-DD'
    const distancias = await getDistancesPrice(hoy);
    res.status(200).json(distancias);
  } catch (error) {
    console.error('Error al obtener distancias:', error);
    res.status(500).json({ error: 'Error al obtener distancias con precio vigente' });
  }
};

const getPriceByNameCtlr = (req, res) => {
  const { nombre } = req.params;
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT d.id AS distancia_id, d.nombre, p.precio
    FROM distancias d
    LEFT JOIN periodos_precio p ON d.id = p.distancia_id
    WHERE d.nombre = ?
      AND date(?) BETWEEN p.fecha_inicio AND p.fecha_fin
    LIMIT 1
  `;

  db.get(sql, [nombre, today], (err, row) => {
    if (err) {
      console.error("Error obteniendo precio:", err.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (!row) {
      return res.status(404).json({ error: "Distancia no encontrada o fuera de período" });
    }

    res.json({
      distancia_id: row.distancia_id,
      nombre: row.nombre,
      precio: row.precio
    });
  });
};

module.exports = {
    getDistancesCtlr,
    getPriceByNameCtlr
};
