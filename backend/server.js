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

// Datos simulados locales
const categoriasMock = [
  { title: '5K', precio: 3000 },
  { title: '10K', precio: 4000 },
  { title: '20K', precio: 5000 },
  { title: '30K', precio: 6000 },
  { title: 'Caminata', precio: 0 },
];

const descuentosMock = [
  { discountName: 'RUNNER20', percentage: 20 },
  { discountName: 'ELITE10', percentage: 10 },
];

// Endpoints locales para categories y discounts
// Simulaciones para que el frontend funcione 100%
app.get('/api/categories', (req, res) => {
  res.json([
    { title: '5K', precio: 3000 },
    { title: '10K', precio: 4000 },
    { title: '20K', precio: 5000 },
    { title: '30K', precio: 6000 },
    { title: 'Caminata', precio: 0 }
  ]);
});

app.get('/api/discounts', (req, res) => {
  res.json([
    { discountName: 'RUNNER20', percentage: 20 },
    { discountName: 'ELITE10', percentage: 10 }
  ]);
});

app.post('/api/mercadopago/create-preference', (req, res) => {
  res.json({
    init_point: 'https://www.mercadopago.com.ar/fake-payment-url'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
