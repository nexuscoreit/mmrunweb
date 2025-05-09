const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

const PORT = process.env.PORT || 3000;

// 1. Conexión y creación de tablas
const db = require('./database/connection');
require('./database/scripts/initDB');

// 2. Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// 3. Rutas de API (pasamos IO dinámicamente solo acá)
const distancesRouter = require('./routes/distances');
const inscripcionesRoutes = require('./routes/inscripciones')(io);
const discountsRoutes = require('./routes/discounts');
const mercadopagoRoutes = require('./routes/mercadopago');
const authRoutes = require('./routes/auth');

app.use('/api/distancias', distancesRouter);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/descuentos', discountsRoutes);
app.use('/api/mercadopago', mercadopagoRoutes);
app.use('/api/auth', authRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor MMRun funcionando 🎉');
});

// 4. WebSocket: conexión
io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado al panel admin');

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado');
  });
});

// 5. Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor en tiempo real escuchando en http://localhost:${PORT}`);
});
