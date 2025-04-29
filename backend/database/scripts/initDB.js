const db = require('../connection');

// Crear tabla de admins
db.run(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// Crear tabla distancias
db.run(`
  CREATE TABLE IF NOT EXISTS distancias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    con_remera INTEGER DEFAULT 1
  );
`);

// Crear tabla periodos_precio
db.run(`
  CREATE TABLE IF NOT EXISTS periodos_precio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distancia_id INTEGER NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    precio REAL NOT NULL,
    FOREIGN KEY (distancia_id) REFERENCES distancias(id)
  );
`);

// Crear tabla codigos_descuento
db.run(`
  CREATE TABLE IF NOT EXISTS codigos_descuento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    porcentaje REAL NOT NULL,
    usos_restantes INTEGER NOT NULL,
    fecha_vencimiento TEXT
  );
`);

// Crear tabla inscripciones_temp
db.run(`
  CREATE TABLE IF NOT EXISTS inscripciones_temp (
    id TEXT PRIMARY KEY,                    -- UUID generado desde el backend
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    genero TEXT NOT NULL,
    fechaNacimiento TEXT NOT NULL,         -- formato: YYYY-MM-DD
    email TEXT NOT NULL,
    telefono TEXT,
    ciudad TEXT,
    distancia_id INTEGER NOT NULL,
    talle TEXT,
    descuento TEXT,                        -- código usado (ej: "HOLA10")
    precio REAL NOT NULL,                  -- precio final calculado
    fechaRegistro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (distancia_id) REFERENCES distancias(id)
  );
`);

// Crear tabla inscripciones
db.run(`
  CREATE TABLE IF NOT EXISTS inscripciones (
    id TEXT PRIMARY KEY,                    -- Mismo ID que en temp
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    genero TEXT NOT NULL,
    fechaNacimiento TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    ciudad TEXT,
    distancia_id INTEGER NOT NULL,
    talle TEXT,
    descuento TEXT,
    precio REAL NOT NULL,
    fechaRegistro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (distancia_id) REFERENCES distancias(id)
  );
`);