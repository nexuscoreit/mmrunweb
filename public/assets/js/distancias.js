// Esperar a que cargue todo el DOM
document.addEventListener("DOMContentLoaded", () => {
    const tarjetas = document.querySelectorAll(".card-distancia");
  
    tarjetas.forEach((tarjeta) => {
      tarjeta.addEventListener("click", () => {
        const distancia = tarjeta.dataset.distancia;
        const precio = tarjeta.dataset.precio;
        const detalle = tarjeta.dataset.detalle;
  
        if (!distancia) {
          mostrarErrorSeleccion();
          return;
        }
  
        // Guardar la distancia elegida para el formulario
        sessionStorage.setItem("distanciaSeleccionada", distancia);
  
        // Mostrar modal de confirmación con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: `¡Distancia ${distancia.toUpperCase()} seleccionada!`,
          html: `
            <p><strong>Precio:</strong> ${precio}</p>
            <p><strong>Período de pago:</strong> ${detalle}</p>
          `,
          confirmButtonText: 'Continuar con la inscripción',
          confirmButtonColor: '#3085d6',
          background: '#f0f8ff',
          customClass: {
            popup: 'swal-popup-custom'
          },
          willClose: () => {
            // Redirigir al formulario
            window.location.href = "/form/index.html";
          }
        });
      });
    });
  });
  
  // Función para mostrar un error si algo falla
  function mostrarErrorSeleccion() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo seleccionar la distancia. Intentalo nuevamente.',
      confirmButtonColor: '#d33',
    });
  }
  