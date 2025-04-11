// backend/models/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta absoluta al archivo de la base de datos
const dbPath = path.resolve(__dirname, '../database/mmrun.db');

// Crear conexión a la base (se crea el archivo si no existe)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite ✔️');
  }
});

// Crear tabla de inscripciones si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    dni TEXT UNIQUE,
    genero TEXT,
    fechaNacimiento TEXT,
    email TEXT,
    telefono TEXT,
    ciudad TEXT,
    categoria TEXT,
    talle TEXT,
    descuento TEXT,
    pagado INTEGER DEFAULT 0,
    fechaRegistro TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
