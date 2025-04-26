document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const email = form.email.value;
  const password = form.password.value;

  const spinner = document.getElementById("spinner");
  spinner.classList.remove("no-display");

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();
    spinner.classList.add("no-display");

    if (res.ok) {
      // Guardamos datos de sesión
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email);

      Swal.fire({
        title: "¡Bienvenido!",
        html: `
          <p style="font-size: 1.1rem; margin-bottom: 10px;">
            Accediste correctamente al panel de administración.
          </p>
          <p style="font-size: 0.95rem; color: #3b3291;">
            ¡Comencemos a gestionar tu evento!
          </p>
          <div style="margin-top: 20px;">
            <div id="progress-bar" style="height: 12px; width: 100%; background: #e0e0e0; border-radius: 30px; overflow: hidden;">
              <div id="bar-fill" style="height: 100%; width: 0%; background: linear-gradient(to right, #00faba, #5247b9); transition: width 0.3s;"></div>
            </div>
            <p style="margin-top: 8px; font-size: 0.9rem;">Redirigiendo...</p>
          </div>
        `,
        icon: "success",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "swal2-popup-login-success"
        },
        width: 400,
        padding: '2rem',
        didOpen: () => {
          const bar = Swal.getHtmlContainer().querySelector("#bar-fill");
          let progress = 0;
          const interval = setInterval(() => {
            progress += 4;
            if (bar) bar.style.width = `${progress}%`;
            if (progress >= 100) {
              clearInterval(interval);
              window.location.href = "/views/dashboard/dashboard.html";
            }
          }, 50);
        }
      });

    } else {
      Swal.fire({
        title: "Error de inicio de sesión",
        html: `
          <p style="font-size: 1rem; color: #e74c3c;">
            ${result.error || "Credenciales inválidas. Por favor revisá tu correo y contraseña."}
          </p>
        `,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#5247b9",
        background: "#fff",
        customClass: {
          popup: "swal2-popup-login-error"
        }
      });
    }
  } catch (err) {
    spinner.classList.add("no-display");
    Swal.fire({
      title: "Error de conexión",
      html: `
        <p style="font-size: 1rem; color: #e74c3c;">
          No se pudo conectar con el servidor. Intentalo de nuevo en unos segundos.
        </p>
      `,
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#5247b9",
      background: "#fff",
      customClass: {
        popup: "swal2-popup-login-error"
      }
    });
  }
});

// 👁️ Toggle contraseña
document.getElementById("togglePassword").addEventListener("click", () => {
  const passwordInput = document.getElementById("passwordInput");
  const eyeOpen = document.getElementById("eyeOpen");
  const eyeClosed = document.getElementById("eyeClosed");

  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";

  eyeOpen.style.display = isHidden ? "none" : "inline";
  eyeClosed.style.display = isHidden ? "inline" : "none";
});
