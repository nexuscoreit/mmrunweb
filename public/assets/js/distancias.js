document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".card-distancia");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const distancia = tarjeta.dataset.distancia;
      const precio = tarjeta.dataset.precio || "Sin precio definido";
      const detalle = tarjeta.dataset.detalle || "Sin detalle disponible";

      if (!distancia) {
        mostrarErrorSeleccion();
        return;
      }

      sessionStorage.setItem("distanciaSeleccionada", distancia);

      // Mostrar confirmación
      Swal.fire({
        title: `¡Distancia ${distancia.toUpperCase()} seleccionada!`,
        html: `
          <p><strong>Precio:</strong> ${precio}</p>
          <p><strong>Período de pago:</strong> ${detalle}</p>
          <div style="margin-top: 15px;">
            <div id="progress-bar" style="height: 14px; width: 100%; background: #ccc; border-radius: 20px; overflow: hidden;">
              <div id="bar-fill" style="height: 100%; width: 0%; background: linear-gradient(to right, #00faba, #5247b9); transition: width 0.3s;"></div>
            </div>
            <p style="margin-top: 5px; font-size: 0.9em;">Redirigiendo al formulario de inscripción...</p>
          </div>
        `,
        icon: 'success',
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-popup-custom'
        },
        didOpen: () => {
          let progress = 0;
          const bar = Swal.getHtmlContainer().querySelector("#bar-fill");
      
          const interval = setInterval(() => {
            progress += 2;
            if (bar) bar.style.width = `${progress}%`;
            if (progress >= 100) {
              clearInterval(interval);
              window.location.href = "/views/form/index.html";
            }
          }, 40);
        }
      });     
    });
  });
});

function mostrarErrorSeleccion() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'No se pudo seleccionar la distancia. Intentalo nuevamente.',
    confirmButtonColor: '#d33',
  });
}

const navbarBtn = document.getElementById("btnNavbarInscribirse");

if (navbarBtn) {
  navbarBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita la navegación

    Swal.fire({
      title: `¡Iniciando inscripción!`,
      html: `
        <div style="margin-top: 15px;">
          <div id="progress-bar" style="height: 14px; width: 100%; background: #ccc; border-radius: 20px; overflow: hidden;">
            <div id="bar-fill" style="height: 100%; width: 0%; background: linear-gradient(to right, #00faba, #5247b9); transition: width 0.3s;"></div>
          </div>
          <p style="margin-top: 5px; font-size: 0.9em;">Redirigiendo al formulario de inscripción...</p>
        </div>
      `,
      icon: 'success',
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-popup-custom'
      },
      didOpen: () => {
        let progress = 0;
        const bar = Swal.getHtmlContainer().querySelector("#bar-fill");

        const interval = setInterval(() => {
          progress += 2;
          if (bar) bar.style.width = `${progress}%`;
          if (progress >= 100) {
            clearInterval(interval);
            window.location.href = "/views/form/index.html";
          }
        }, 40);
      }
    });
  });
}
