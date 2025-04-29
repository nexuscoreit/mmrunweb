document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("distanciaModal");
  const closeBtn = document.getElementById("closeDistanciaModal");
  const btnsInscribirse = document.querySelectorAll(".btn-inscribirse, #comenzarBtn");

  // Abrir modal desde cualquier botón "Inscribirse" o "Comenzar"
  btnsInscribirse.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      document.body.classList.add("menu-open");
    });
  });

  // Cerrar modal (X o clic fuera)
  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("menu-open");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("menu-open");
    }
  });

  // Click en distancia => SweetAlert + Redirección
  document.querySelectorAll(".card-distancia").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const distancia = card.getAttribute("data-distancia");
      sessionStorage.setItem("distanciaSeleccionada", distancia);

      modal.style.display = "none";
      document.body.classList.remove("menu-open");

      Swal.fire({
        title: '¡Inscripción iniciada!',
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
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          let progress = 0;
          const bar = Swal.getHtmlContainer().querySelector("#bar-fill");

          const interval = setInterval(() => {
            progress += 1;
            if (bar) bar.style.width = `${progress}%`;

            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 30);
        }
      }).then(() => {
        window.location.href = "/views/form/form.html";
      });
    });
  });
});
