const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos SQLite
const db = require('./models/db');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const inscripcionesRoutes = require('./routes/inscripciones');
const categoriesRoutes = require('./routes/categories');
const discountsRoutes = require('./routes/discounts');
const mercadopagoRoutes = require('./routes/mercadopago');

// Usar rutas
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/discounts', discountsRoutes);
app.use('/api/mercadopago', mercadopagoRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor MMRun funcionando 🎉');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
