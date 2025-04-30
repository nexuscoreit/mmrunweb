const db = require("../database/connection");

const getDistances = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT d.id, d.nombre, d.descripcion, d.con_remera,
           p.precio, p.fecha_fin
    FROM distancias d
    LEFT JOIN periodos_precio p ON d.id = p.distancia_id
    WHERE date(?) BETWEEN p.fecha_inicio AND p.fecha_fin
    ORDER BY d.id
  `;
console.log(sql)
  db.all(sql, [today], (err, rows) => {
    if (err) {
      console.error("Error consultando distancias:", err.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    const distancias = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      con_remera: row.con_remera,
      precio: row.precio,
      detalle: `Hasta el ${new Date(row.fecha_fin).toLocaleDateString("es-AR")}`
    }));

    console.log(distancias)
    res.json(distancias);
  });
};

const getPriceByName = (req, res) => {
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
    getDistances,
    getPriceByName
};
