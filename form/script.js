document.addEventListener("DOMContentLoaded", initForm);

let categories = [];
let discounts = [];
let active = 1;

const labels = [
  "Nombre", "Apellido", "DNI", "Género", "Fecha de nacimiento",
  "Email", "Teléfono", "Ciudad", "Circuito", "Talle camiseta", "Código de descuento"
];

const talles = [
  { id: "talle_s", value: "Camiseta Talle S" },
  { id: "talle_m", value: "Camiseta Talle M" },
  { id: "talle_l", value: "Camiseta Talle L" },
  { id: "talle_xl", value: "Camiseta Talle XL" },
  { id: "talle_xxl", value: "Camiseta Talle XXL" },
];

function initForm() {
  getCategories();
  getDiscounts();
  setupNavigation();
  dateListener();
  handleQueryParamChange();
  setupModal();
  document.getElementById("btn-submit").addEventListener("click", () => {
    getFormData();
  });  
}

async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    categories = await res.json();
    const select = document.getElementById("category");
    if (!select) return;
    select.innerHTML = "";
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.title;
      option.textContent = `Circuito: ${cat.title} - $${(+cat.precio).toFixed(2)}`;
      select.appendChild(option);
    });
  } catch (e) {
    console.error("Error al obtener categorías:", e);
  }
}

async function getDiscounts() {
  try {
    const res = await fetch("http://localhost:3000/api/discounts");
    discounts = await res.json();
  } catch (e) {
    console.error("Error al obtener descuentos:", e);
  }
}

function setupNavigation() {
  const steps = document.querySelectorAll(".step");
  const formSteps = document.querySelectorAll(".form-step");
  const nextBtn = document.querySelector(".btn-next");
  const prevBtn = document.querySelector(".btn-prev");
  const submitBtn = document.querySelector(".btn-submit");

  const partnerCheckbox = document.querySelector('input[name="check-partner"]');
  const partnerNumberInput = document.querySelector('input[name="partnerID"]');

  nextBtn.addEventListener("click", () => {
    const inputs = document.getElementsByClassName("items");
    let valid = true;

    const validationRanges = [[0, 7], [7, 10]];
    if (active <= validationRanges.length) {
      for (let i = validationRanges[active - 1][0]; i < validationRanges[active - 1][1]; i++) {
        if (!inputs[i].value) {
          inputs[i].classList.add("error");
          valid = false;
        } else {
          inputs[i].classList.remove("error");
        }
      }
    }

    if (!valid) {
      Swal.fire({
        title: "¡Error!",
        text: "¡Falta completar algunos campos!",
        icon: "error",
        confirmButtonText: "Ok"
      });
      return;
    }

    active = Math.min(active + 1, steps.length);
    updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
  });

  prevBtn.addEventListener("click", () => {
    active = Math.max(active - 1, 1);
    updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
  });

  partnerCheckbox.addEventListener("change", () => {
    partnerNumberInput.disabled = !partnerCheckbox.checked;
    if (!partnerCheckbox.checked) partnerNumberInput.value = "";
  });

  updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
}

function updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === active - 1);
    formSteps[i].classList.toggle("active", i === active - 1);
  });

  prevBtn.disabled = active === 1;
  nextBtn.disabled = active === steps.length;

  // ✅ Mostrar resumen SOLO en paso 4
  if (active === 4) showData();

  // ✅ Mostrar botón Confirmar solo en paso 5
  const confirmBtn = document.querySelector(".btn-submit");
  if (confirmBtn) {
    confirmBtn.style.display = active === 5 ? "inline-block" : "none";
  }
}

function dateListener() {
  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");
  const moveFocus = (from, to, len) => from.addEventListener("input", () => from.value.length === len && to.focus());

  moveFocus(day, month, 2);
  moveFocus(month, year, 2);
  moveFocus(year, document.querySelector(".btn-next"), 4);
}

function showData() {
  const inputs = document.getElementsByClassName("items");
  const partnerCheckbox = document.querySelector('input[name="check-partner"]');
  const partnerInput = document.querySelector('input[name="partnerID"]');
  const nextEl = document.querySelector(".form-four");

  let multiplier = 1;
  const discountCode = partnerInput.value.toUpperCase();
  const matchedDiscount = discounts.find(d => d.discountName === discountCode);
  if (partnerCheckbox.checked && matchedDiscount) {
    multiplier -= matchedDiscount.percentage / 100;
  }

  const category = categories.find(c => c.title === inputs[10].value);
  const precioFinal = category ? (category.precio * multiplier).toFixed(2) : "No asignado";

  const resumenHTML = `
    <div id="payment-status" class="resumen-box">
      <h3 class="resumen-title">🧾 Resumen de inscripción</h3>
      <div class="resumen-section">
        <h4>🧍 Datos personales</h4>
        <div class="resumen-grid">
          <div><strong>Nombre:</strong> ${inputs[0].value}</div>
          <div><strong>Apellido:</strong> ${inputs[1].value}</div>
          <div><strong>DNI:</strong> ${inputs[2].value}</div>
          <div><strong>Género:</strong> ${inputs[3].value}</div>
          <div><strong>Fecha de nacimiento:</strong> ${inputs[4].value}/${inputs[5].value}/${inputs[6].value}</div>
        </div>
      </div>
      <div class="resumen-section">
        <h4>📱 Contacto</h4>
        <div class="resumen-grid">
          <div><strong>Email:</strong> ${inputs[7].value}</div>
          <div><strong>Teléfono:</strong> ${inputs[8].value}</div>
          <div><strong>Ciudad:</strong> ${inputs[9].value}</div>
        </div>
      </div>
      <div class="resumen-section">
        <h4>🎽 Datos de inscripción</h4>
        <div class="resumen-grid">
          <div><strong>Circuito:</strong> ${inputs[10].value}</div>
          <div><strong>Talle camiseta:</strong> ${(() => {
            const talle = talles.find(t => t.id === inputs[11].value);
            return talle ? talle.value : "No asignado";
          })()}</div>
          <div><strong>Código de descuento:</strong> ${inputs[12].checked ? inputs[13].value : "No aplica"}</div>
        </div>
      </div>
      <hr />
      <div class="resumen-total">
        <span><strong>Total a pagar:</strong></span>
        <span><strong>$ ${precioFinal}</strong></span>
      </div>
    </div>
  `;

  const existing = document.getElementById("payment-status");
  if (existing) existing.remove();

  nextEl.insertAdjacentHTML("beforeend", resumenHTML);
}

async function getFormData() {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("no-display");
  const form = document.getElementById("form");
  const inputs = document.getElementsByClassName("items");
  const formData = new FormData(form);

  const name = `${form.firstname.value} ${form.lastname.value}`;
  const nacimiento = `${form.day.value}/${form.month.value}/${form.year.value}`;
  const category = categories.find(c => c.title === form.category.value);

  const fecha = new Date(+form.year.value, +form.month.value - 1, +form.day.value);
  const hoy = new Date();
  const edad = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24 * 365.25));

  formData.append("name", name);
  formData.append("runnerBirthDate", nacimiento);
  formData.append("runnerAge", edad);
  formData.append("title", "MMRUN'2024");
  formData.append("description", category?.title || "No especificado");
  formData.append("quantity", 1);
  formData.append("currency_id", "ARS");
  formData.append("unit_price", category?.precio || 0);

  try {
    const response = await fetch("http://localhost:3000/api/mercadopago/create-preference", {
      method: "POST",
      body: formData,
    });

    spinner.classList.add("no-display");

    if (response.ok) {
      const data = await response.json();
      await fetch("http://localhost:3000/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.firstname.value,
          apellido: form.lastname.value,
          dni: form.dni.value,
          genero: form.runnerGenre.value,
          fechaNacimiento: `${form.year.value}-${form.month.value.padStart(2, "0")}-${form.day.value.padStart(2, "0")}`,
          email: form.email.value,
          telefono: form.phone.value,
          ciudad: form.city.value,
          categoria: form.category.value,
          talle: form.tshirtSize.value,
          descuento: form["partnerID"]?.value || ""
        }),
      });

      window.location.href = data.init_point;
    }
  } catch (err) {
    console.error(err);
    spinner.classList.add("no-display");
    Swal.fire({
      title: "Error",
      text: "Algo salió mal con la petición",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

function handleQueryParamChange() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const runnerId = params.get("runner_id");

  let msg = "El pago fue acreditado con éxito.";
  if (runnerId !== null) msg = "Participante inscripto con éxito.";

  if (status === "approved") {
    Swal.fire({
      title: "Éxito",
      text: msg,
      icon: "success",
      showDenyButton: true,
      confirmButtonText: "Inscribir otro corredor",
      denyButtonText: "Volver a la web principal",
    }).then((r) => {
      if (r.isConfirmed) window.location.href = "https://mmrun.com.ar/form/index.html";
      else window.location.href = "https://mmrun.com.ar/";
    });
  } else if (status === "rejected") {
    Swal.fire({
      title: "Error",
      text: "El pago fue rechazado.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

function setupModal() {
  const modal = document.getElementById("myModal");
  const img = document.getElementById("myImg");
  const modalImg = document.getElementById("img01");
  const closeBtn = document.getElementsByClassName("close")[0];

  img.onclick = () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  };

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
}
