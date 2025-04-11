const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos SQLite
const db = require('./models/db');

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const inscripcionesRoutes = require('./routes/inscripciones');

// Usar rutas
app.use('/api/inscripciones', inscripcionesRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor MMRun funcionando 🎉');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
