(() => {
  const modal = document.getElementById("distanciaModal");
  const closeBtn = document.getElementById("closeDistanciaModal");

  if (!modal) return;

  // Cerrar el modal al hacer clic en la X o fuera del modal
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

  // Al hacer clic en una tarjeta de distancia
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
          <div style="margin-top: 20px;">
            <div style="
              height: 14px;
              width: 100%;
              background: #e0e0e0;
              border-radius: 30px;
              overflow: hidden;
              box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            ">
              <div id="bar-fill" style="
                height: 100%;
                width: 0%;
                background: linear-gradient(to right, #00faba, #5247b9);
                transition: width 0.3s ease-in-out;
              "></div>
            </div>
            <p style="
              margin-top: 12px;
              font-size: 1rem;
              color: #f0f0f0;
              font-weight: 500;
            ">Redirigiendo al formulario de inscripción...</p>
          </div>
        `,
        icon: 'success',
        iconColor: '#00faba',
        background: 'linear-gradient(to right, #1f1f2e, #2b2353)',
        customClass: {
          popup: 'swal2-rounded-custom',
          title: 'swal2-title-custom'
        },
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
            if (progress >= 100) clearInterval(interval);
          }, 30);
        }
      }).then(() => {
        window.location.href = "/views/form/form.html";
      });
    });
  });
})();
