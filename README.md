# 🏃‍♂️ MMRunWeb · Sitio Oficial Mari Menuco Run 2024

> Sitio web oficial para la carrera **Mari Menuco Run 2024**. Desarrollado con tecnologías modernas y estructura profesional, permite a los usuarios inscribirse en línea, visualizar distancias y gestionar la administración del evento desde un panel seguro.

---

## 🚀 Tecnologías Utilizadas

### 🧩 Frontend

- HTML5, CSS3, JavaScript
- Bootstrap 5 para diseño responsive
- Ionicons para íconos vectoriales
- SweetAlert2 para modales interactivos

### 🧠 Backend

- **Node.js + Express** como servidor web
- **SQLite** como base de datos local liviana
- Arquitectura basada en:
  - Controladores (`controllers/`)
  - Modelos (`models/`)
  - Rutas REST (`routes/`)
  - Inicializador de base de datos (`initDB.js`)

---

## 📂 Estructura del Proyecto

```
mmrunweb/
├── public/
│   ├── assets/
│   │   ├── css/             → Archivos de estilos
│   │   ├── js/              → Scripts funcionales
│   │   ├── img/             → Logotipos, íconos, fondo, etc.
│   │   └── bootstrap/       → Archivos de Bootstrap minificados
│   └── views/
│       ├── index.html       → Landing principal
│       ├── form/            → Formulario de inscripción por pasos
│       ├── login/           → Login administrativo
│       ├── dashboard/       → Panel administrativo
│       └── documents/       → PDFs descargables (reglamento, autorización, etc.)
│
├── backend/
│   ├── controllers/         → Lógica de negocio (auth, inscripción)
│   ├── database/
│   │   └── mmrun.db         → Base de datos SQLite
│   ├── models/              → Modelos Sequelize / ORM local
│   ├── routes/              → Rutas RESTful para API
│   └── server.js            → Entrada principal del servidor Express
│
├── README.md
└── package.json             → Dependencias para entorno local
```

---

## 🎯 Funcionalidades Principales

### 👟 Landing Page
- Información del evento, sponsors, ubicación, contacto y botón de inscripción.

### 📝 Formulario Multistep
- Datos personales, contacto, distancia elegida, talla, método de pago.
- Paso a paso con barra de progreso animada.
- Validaciones en cada paso y resumen final.

### 🧠 Lógica de selección
- El usuario elige una distancia en `/views/form/distancias.html`
- Esa elección se guarda en `sessionStorage` y se traslada al formulario principal.

### 🔐 Login + Panel Administrativo
- Autenticación básica para organizadores.
- Gestión de inscriptos desde `/views/dashboard/admin-lite.html`.
- Posibilidad de expansión con roles y permisos.

---

## 📱 Responsive Design

✅ Totalmente adaptado a dispositivos móviles  
✅ Compatible con navegadores modernos  
✅ Menús colapsables y componentes responsivos optimizados

---

## 🛠️ Instalación local

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/mmrunweb.git
cd mmrunweb
```

2. Instalá las dependencias:

```bash
npm install
```

3. Ejecutá el servidor Express (modo API + estático):

```bash
npm start
```

4. Abrí el navegador en:

```
http://localhost:3000
```

---

## 🧪 Endpoints disponibles (ejemplo)

```
GET    /inscripciones
POST   /inscripciones
GET    /categories
POST   /auth/login
...
```

---

## 👤 Autores

- **Agustín Del Giudice** · Desarrollador Full Stack
- **Johana Piccat** · Desarrollador Full Stack

---

## 📄 Licencia

Este proyecto está licenciado bajo MIT License. Ver archivo `LICENSE` para más detalles.
