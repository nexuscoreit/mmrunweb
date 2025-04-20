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
      // ✅ Guardamos datos de sesión
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email); // 👈 esto es lo que luego se muestra

      Swal.fire({
        title: "¡Bienvenido!",
        text: "Login exitoso",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: "top"
      }).then(() => {
        window.location.href = "/views/dashboard/dashboard.html";
      });      
    } else {
      Swal.fire({
        title: "Error",
        text: result.error || "Credenciales inválidas",
        icon: "error",
        position: "top"
      });
    }
  } catch (err) {
    spinner.classList.add("no-display");
    Swal.fire({
      title: "Error",
      text: "No se pudo conectar con el servidor",
      icon: "error",
      position: "top"
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
