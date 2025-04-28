document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("distanciaModal");
    const closeBtn = document.getElementById("closeDistanciaModal");
  
    // Abrir modal desde cualquier botón "Inscribirse"
    document.querySelectorAll(".btn-inscribirse").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
        document.body.classList.add("menu-open");
      });
    });
  
    // Cerrar modal
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("menu-open");
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("menu-open");
      }
    });
  
    // Guardar la distancia seleccionada
    document.querySelectorAll(".card-distancia").forEach((card) => {
      card.addEventListener("click", () => {
        const distancia = card.getAttribute("data-distancia");
        sessionStorage.setItem("distanciaSeleccionada", distancia);
        modal.style.display = "none";
        document.body.classList.remove("menu-open");
    
        // Redirige al formulario
        window.location.href = "/views/form/form.html";
      });
    });    
  });
  
  const comenzarBtn = document.getElementById("comenzarBtn");

  if (comenzarBtn) {
    comenzarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("distanciaModal");
      modal.style.display = "flex";
      document.body.classList.add("menu-open");
    });
  }
