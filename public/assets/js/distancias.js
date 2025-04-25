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
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige al formulario
          window.location.href = "/views/form/index.html";
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
