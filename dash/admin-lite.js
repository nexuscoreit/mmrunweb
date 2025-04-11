let todosLosInscriptos = [];
let paginaActual = 1;
let porPagina = 15;

document.addEventListener('DOMContentLoaded', () => {
  porPagina = parseInt(document.getElementById("registrosPorPagina").value);
  cargarInscriptos();

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
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

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

  // Paginación
  document.getElementById("pageInfo").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("btnPrev").disabled = paginaActual === 1;
  document.getElementById("btnNext").disabled = paginaActual === totalPaginas;

  // Resumen
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
