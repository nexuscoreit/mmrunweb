// backend/models/initDB.js

const db = require('../connection');

// Crear tabla de admins
db.run(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// Crear tabla de inscripciones_temp
db.run(`
  CREATE TABLE IF NOT EXISTS inscripciones_temp (
    id TEXT PRIMARY KEY,
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
    precio FLOAT,
    fechaRegistro TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Crear tabla de inscripciones
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

// Crear tabla de categorías
db.run(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE,
    precio INTEGER
)
`);

// Crear tabla descuentos
db.run(`
  CREATE TABLE IF NOT EXISTS descuentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE,
    porcentaje INTEGER NOT NULL,      -- Ej: 10 significa 10%
    usos_restantes INTEGER NOT NULL,  -- Límite de uso
    fecha_vencimiento TEXT            -- formato: 'YYYY-MM-DD'
  );
`);
