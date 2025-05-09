export async function loadComponent(id, path, callback) {
  const container = document.getElementById(id);
  if (!container) return;

  try {
    const res = await fetch(path);
    const html = await res.text();
    container.innerHTML = html;

    if (typeof callback === 'function') {
      callback(); // ejecutar lógica dependiente del componente cargado
    }
  } catch (err) {
    console.error(`Error al cargar ${path}:`, err);
  }
}

export async function loadBtnInscripcion(id, text) {
  const container = document.getElementById(id);
  if (!container) return;

  await loadComponent(id, '/views/components/btn-inscripcion.html');

  const span = container.querySelector('.btn-inscripcion-texto');
  if (span) span.textContent = text;

  const button = container.querySelector('.btn-inscribirse');

  const checkModal = setInterval(() => {
    const modal = document.getElementById('distanciaModal');
    if (button && modal) {
      clearInterval(checkModal);
      button.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.classList.add("menu-open");
      });
    }
  }, 100);
}

export function configurarCierreModal() {
  const checkClose = setInterval(() => {
    const modal = document.getElementById('distanciaModal');
    const closeBtn = document.getElementById('closeDistanciaModal');

    if (modal && closeBtn) {
      clearInterval(checkClose);
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove("menu-open");
      });

      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.classList.remove("menu-open");
        }
      });
    }
  }, 100);
}
