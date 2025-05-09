const db = require('../connection');

console.log("🔁 Iniciando reinserción de periodos_precio...");

// Precios por distancia (nombre) y por periodo
const preciosPorDistancia = {
  'Caminata Solidaria': [0, 0, 0],
  'KIDS': [5000, 6000, 7000],
  '8KM': [8000, 9000, 10000],
  '15KM': [10000, 11000, 12000],
  '25KM': [12000, 13500, 15000]
};

// Periodos (ordenados)
const periodos = [
  { inicio: '2025-05-08', fin: '2025-06-14' },
  { inicio: '2025-06-15', fin: '2025-07-14' },
  { inicio: '2025-07-15', fin: '2025-09-27' }
];

// Orden de distancias deseado
const ordenDistancias = [
  'Caminata Solidaria',
  'KIDS',
  '8KM',
  '15KM',
  '25KM'
];

//Limpiar tabla periodos_precio
db.run('DELETE FROM periodos_precio', (err) => {
  if (err) {
    console.error('Error al limpiar la tabla periodos_precio:', err.message);
    return;
  }

  console.log('Tabla periodos_precio vaciada correctamente');

  //Obtener distancias
  db.all('SELECT id, nombre FROM distancias', [], (err, distancias) => {
    if (err) {
      console.error('Error obteniendo distancias:', err.message);
      return;
    }

    if (!distancias || distancias.length === 0) {
      console.warn('No hay distancias en la base de datos.');
      return;
    }

    // Crear mapa { nombre: id }
    const distMap = {};
    distancias.forEach(d => {
      distMap[d.nombre] = d.id;
    });

    //Insertar ordenadamente por periodo
    periodos.forEach((periodo, i) => {
      const { inicio, fin } = periodo;

      ordenDistancias.forEach(nombre => {
        const distanciaId = distMap[nombre];
        const precio = preciosPorDistancia[nombre]?.[i];

        if (distanciaId === undefined || precio === undefined) {
          console.warn(`Faltan datos para "${nombre}" en periodo ${i + 1}`);
          return;
        }

        db.run(
          `INSERT INTO periodos_precio (distancia_id, fecha_inicio, fecha_fin, precio)
           VALUES (?, ?, ?, ?)`,
          [distanciaId, inicio, fin, precio],
          function (err) {
            if (err) {
              console.error(`Error insertando ${nombre} (${inicio} - ${fin}):`, err.message);
            } else {
              console.log(`Insertado: ${nombre} | ${inicio} → ${fin} | $${precio}`);
            }
          }
        );
      });
    });
  });
});
