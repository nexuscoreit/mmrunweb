// Tiempo total antes de mostrar advertencia (en ms)
const INACTIVITY_LIMIT = 19.5 * 60 * 1000; // 19 minutos y 30 segundos
const GRACE_PERIOD = 30 * 1000; // 30 segundos de cuenta regresiva

//Para el testing:
// const INACTIVITY_LIMIT = 10 * 1000; // 10 segundos
// const GRACE_PERIOD = 15 * 1000; // 15 segundos

let inactivityTimer;
let graceTimer;
let swalInstance;

// Lógica para mostrar advertencia antes de cerrar sesión
function showSessionWarning() {
  let secondsLeft = 30;

  swalInstance = Swal.fire({
    icon: 'warning',
    title: '¿Seguís ahí?',
    html: `<p>Tu sesión expirará en <b><span id="countdown">30</span></b> segundos por inactividad.</p>
           <p>¿Querés seguir conectado?</p>`,
    showCancelButton: true,
    confirmButtonText: 'Sí, seguir conectado',
    cancelButtonText: 'Cerrar sesión',
    allowOutsideClick: false,
    didOpen: () => {
      const countdownElement = document.getElementById('countdown');
      graceTimer = setInterval(() => {
        secondsLeft--;
        if (countdownElement) countdownElement.textContent = secondsLeft;
        if (secondsLeft <= 0) {
          Swal.close();
          closeSession();
        }
      }, 1000);
    },
    preConfirm: () => {
      clearInterval(graceTimer);
      resetInactivityTimer();
    },
    willClose: () => {
      clearInterval(graceTimer);
    }
  });
}

// Cierre automático de sesión
function closeSession() {
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminEmail");
  window.location.href = "/views/login/login.html";
}

// Reinicia el temporizador principal de inactividad
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (swalInstance) {
    swalInstance.close();
  }
  inactivityTimer = setTimeout(showSessionWarning, INACTIVITY_LIMIT);
}

// Eventos que reinician la sesión al detectar actividad
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer, true);
});

// Inicializar al cargar la página
resetInactivityTimer();
