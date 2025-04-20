let todosLosInscriptos = [];
let paginaActual = 1;
let porPagina = 15;
let notificacionesNuevas = 0;

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  porPagina = parseInt(document.getElementById("registrosPorPagina").value);
  cargarInscriptos();

  document.getElementById("notificationIcon").addEventListener("click", toggleNotifications);

  document.getElementById("notificationCount").style.display = "none";

  document.getElementById('filtroCategoria').addEventListener('change', () => {
    paginaActual = 1;
    filtrarPorCategoria();
  });

  document.getElementById("btnPrev").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      filtrarPorCategoria();
    }
  });

  document.getElementById("btnNext").addEventListener("click", () => {
    paginaActual++;
    filtrarPorCategoria();
  });

  document.getElementById("registrosPorPagina").addEventListener("change", () => {
    porPagina = parseInt(document.getElementById("registrosPorPagina").value);
    paginaActual = 1;
    filtrarPorCategoria();
  });

  document.getElementById("buscador").addEventListener("input", () => {
    paginaActual = 1;
    filtrarPorCategoria();
  });
});

function cargarInscriptos() {
  const tbody = document.getElementById('tabla-inscriptos');
  tbody.innerHTML = '<tr><td colspan="10" class="loading">Cargando inscriptos...</td></tr>';

  fetch('http://localhost:3000/api/inscripciones')
    .then(res => res.json())
    .then(data => {
      todosLosInscriptos = data;
      filtrarPorCategoria();
      mostrarNotificaciones();
    })
    .catch(err => {
      console.error('Error al obtener inscriptos:', err);
      tbody.innerHTML = '<tr><td colspan="10">Error al cargar los datos.</td></tr>';
    });
}

function filtrarPorCategoria() {
  const categoria = document.getElementById('filtroCategoria').value;
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
  const tbody = document.getElementById('tabla-inscriptos');
  tbody.innerHTML = "";

  const normalizar = str =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const busquedaNormalizada = normalizar(textoBusqueda);

  let filtrados = categoria === "todos"
    ? todosLosInscriptos
    : todosLosInscriptos.filter(i => i.categoria === categoria);

  if (textoBusqueda) {
    filtrados = filtrados.filter(i =>
      normalizar(i.nombre).includes(busquedaNormalizada) ||
      normalizar(i.apellido).includes(busquedaNormalizada) ||
      i.dni.includes(busquedaNormalizada) ||
      normalizar(i.email).includes(busquedaNormalizada) ||
      i.telefono.includes(busquedaNormalizada) ||
      normalizar(i.ciudad).includes(busquedaNormalizada) ||
      normalizar(i.talle).includes(busquedaNormalizada)
    );
  }

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const visibles = filtrados.slice(inicio, fin);

  if (visibles.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10">No hay inscriptos en esta categoría.</td></tr>';
    return;
  }

  visibles.forEach((inscripto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${inicio + index + 1}</td>
      <td>${inscripto.nombre}</td>
      <td>${inscripto.apellido}</td>
      <td>${inscripto.dni}</td>
      <td>${inscripto.email}</td>
      <td>${inscripto.telefono}</td>
      <td>${inscripto.ciudad}</td>
      <td>${inscripto.categoria}</td>
      <td>${inscripto.talle}</td>
      <td>${new Date(inscripto.fechaRegistro).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("pageInfo").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("btnPrev").disabled = paginaActual === 1;
  document.getElementById("btnNext").disabled = paginaActual === totalPaginas;

  const desde = inicio + 1;
  const hasta = Math.min(fin, filtrados.length);
  const totalFiltrado = filtrados.length;
  const totalGeneral = todosLosInscriptos.length;

  let resumen = `Mostrando resultados del ${desde} al ${hasta} de un total de ${totalFiltrado} inscriptos`;
  if (categoria !== "todos" || textoBusqueda) {
    resumen += ` (filtrados de ${totalGeneral})`;
  }

  document.getElementById("paginationSummary").textContent = resumen;
}

function exportarExcel() {
  const hoja = XLSX.utils.json_to_sheet(todosLosInscriptos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Inscriptos");
  XLSX.writeFile(libro, "inscriptos_mmrun.xlsx");
}

function mostrarNotificaciones() {
  const lista = document.getElementById("notificationList");
  const badge = document.getElementById("notificationCount");

  if (!lista || !badge) return;

  lista.innerHTML = "";
  badge.textContent = "0";
  badge.style.display = "none";

  const ahora = new Date();
  const recientes = todosLosInscriptos
    .filter(i => {
      const fecha = new Date(i.fechaRegistro);
      const minutos = (ahora - fecha) / 60000;
      return minutos <= 10;
    })
    .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    .slice(0, 5);

  if (recientes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin nuevas inscripciones";
    lista.appendChild(li);
    return;
  }

  recientes.forEach(i => {
    const fecha = new Date(i.fechaRegistro);
    const minutos = Math.floor((ahora - fecha) / 60000);
    const li = document.createElement("li");
    li.textContent = `${i.nombre} ${i.apellido} se inscribió hace ${minutos || 1} min`;
    lista.appendChild(li);
  });
}

// ✅ NUEVO toggle con control de active y limpieza de badge
function toggleNotifications() {
  const panel = document.getElementById("notificationPanel");
  const bell = document.getElementById("bellWrapper");
  const userMenu = document.getElementById("userMenu");

  const estabaAbierto = panel.classList.contains("active");

  // Cerrar ambos siempre
  panel.classList.remove("active");
  userMenu.classList.remove("active");
  bell.classList.remove("active"); // 👈 esta línea asegura quitar color

  // Si NO estaba abierto antes, lo abrimos
  if (!estabaAbierto) {
    panel.classList.add("active");
    bell.classList.add("active"); // 👈 activamos visualmente
  }

  // Si estaba cerrado y hay notificaciones nuevas, las reseteamos
  if (!estabaAbierto && notificacionesNuevas > 0) {
    notificacionesNuevas = 0;
    const badge = document.getElementById("notificationCount");
    if (badge) {
      badge.textContent = "0";
      badge.style.display = "none";
    }
  }
}


function toggleUserMenu() {
  const menu = document.getElementById("userMenu");
  const notiPanel = document.getElementById("notificationPanel");
  const bellWrapper = document.getElementById("bellWrapper");

  const estabaAbierto = menu.classList.contains("active");

  // Cierra todo
  menu.classList.remove("active");
  notiPanel.classList.remove("active");
  bellWrapper.classList.remove("active"); // ✅ Esto borra el color activo de la campanita

  // Si estaba cerrado antes, lo abrimos
  if (!estabaAbierto) {
    menu.classList.add("active");
  }
}




document.getElementById("notificationIcon").addEventListener("click", toggleNotifications);


document.addEventListener("click", (e) => {
  const userControls = document.querySelector(".user-controls");

  if (!userControls?.contains(e.target)) {
    document.getElementById("notificationPanel")?.classList.remove("active");
    document.getElementById("userMenu")?.classList.remove("active");
    document.getElementById("bellWrapper")?.classList.remove("active"); // 👈 acá también por si acaso
  }
});



// ============================
// 📡 TIEMPO REAL CON SOCKET.IO
// ============================
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('✅ Conectado a Socket.IO con ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Error al conectar con Socket.IO:', err);
});

socket.on('nueva-inscripcion', (nuevo) => {
  console.log("🆕 Nueva inscripción en tiempo real:", nuevo);

  todosLosInscriptos.unshift(nuevo);

  const badge = document.getElementById("notificationCount");
  const lista = document.getElementById("notificationList");

  if (badge && lista) {
    const notiItem = document.createElement("li");
    const inicial = (nuevo.nombre || 'X')[0].toUpperCase();

    notiItem.innerHTML = `
      <div class="noti-icon">${inicial}</div>
      <div class="noti-content">
        <span class="noti-title">${nuevo.nombre} ${nuevo.apellido}</span>
        <span class="noti-desc">Se inscribió en la categoría <strong>${nuevo.categoria}</strong></span>
        <span class="noti-time">Hace 1 min</span>
      </div>
    `;

    lista.prepend(notiItem);

    notificacionesNuevas += 1;
    badge.textContent = notificacionesNuevas;
    badge.style.display = "inline-block";
  }

  const categoriaActiva = document.getElementById("filtroCategoria").value;
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();

  const coincideFiltroCategoria = categoriaActiva === "todos" || nuevo.categoria === categoriaActiva;
  const coincideBusqueda =
    nuevo.nombre.toLowerCase().includes(textoBusqueda) ||
    nuevo.apellido.toLowerCase().includes(textoBusqueda) ||
    nuevo.dni.includes(textoBusqueda) ||
    nuevo.email.toLowerCase().includes(textoBusqueda) ||
    nuevo.telefono.includes(textoBusqueda) ||
    nuevo.ciudad.toLowerCase().includes(textoBusqueda) ||
    nuevo.talle.toLowerCase().includes(textoBusqueda);

  if (coincideFiltroCategoria && (!textoBusqueda || coincideBusqueda)) {
    filtrarPorCategoria();
  }
});
