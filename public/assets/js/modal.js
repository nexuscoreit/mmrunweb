document.addEventListener("DOMContentLoaded", async() => {
    const modal = document.getElementById("distanciaModal");
    if (!modal) {
      console.warn("No se encontró el modal con id #distanciaModal");
      return; // corta la ejecución para evitar errores
    }
    const grid = modal.querySelector(".grid");
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
  
    // 🔽 FUNCION PARA ASIGNAR EMOJIS SEGÚN LA DISTANCIA
    function obtenerEmoji(distancia) {
      const mapaEmojis = {
        "Caminata Solidaria": "🥾",
        "KIDS": "🧒",
        "8KM": "🏃‍♀️",
        "15KM": "🔥",
        "25KM": "⛰️"
      };
      return mapaEmojis[distancia] || "🏃‍♂️";
    }

    try {
      const res = await fetch("/api/distancias");
      const distancias = await res.json();
  
      // Vaciar la grilla por si había contenido hardcodeado
      grid.innerHTML = "";
  
      distancias.forEach((d) => {
        const card = document.createElement("div");
        card.className = "card-distancia";
        card.setAttribute("data-distancia", d.nombre);
        card.setAttribute("data-precio", d.precio);
        card.setAttribute("data-detalle", d.detalle);
  
        card.innerHTML = `
          <div class="emoji" style="font-size: 2rem;">${obtenerEmoji(d.nombre)}</div>
          <h2>${d.nombre}</h2>
          <p class="precio">${d.precio === 0 ? "Gratis" : `$${d.precio.toLocaleString()}`}</p>
          <p class="detalle">${d.detalle}</p>
        `;
  
        card.addEventListener("click", () => {
          sessionStorage.setItem("distanciaSeleccionada", d.nombre);
          modal.style.display = "none";
          document.body.classList.remove("menu-open");
          window.location.href = "/views/form/index.html";
        });
  
        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando distancias:", error);
      grid.innerHTML = "<p>Error al cargar distancias.</p>";
    }   
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
