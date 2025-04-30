let descuentos = [];
let precioBase = 0;
let precioFinal = 0;
let distanciaId = null;
let distanciaNombre = null;
let active = 1;

const talles = [
  { id: "talle_s", value: "Camiseta Talle S" },
  { id: "talle_m", value: "Camiseta Talle M" },
  { id: "talle_l", value: "Camiseta Talle L" },
  { id: "talle_xl", value: "Camiseta Talle XL" },
  { id: "talle_xxl", value: "Camiseta Talle XXL" },
];

document.addEventListener("DOMContentLoaded", async() => {
  distanciaNombre = sessionStorage.getItem("distanciaSeleccionada");

  const inputDistancia = document.getElementById("distanciaElegida");
  if (inputDistancia) inputDistancia.value = distanciaNombre;

  if (!distanciaNombre) {
    alert("No se seleccionó una distancia. Volvé al inicio.");
    window.location.href = "/";
    return;
  }

  await getPriceDistance();
  await getDiscounts();

  initForm();            
});

function initForm() {
  setupNavigation();
  dateListener();
  setupModal();
  handleQueryParamChange();

  // Normalizar DNI en tiempo real
  const dniInput = document.getElementById("dni");
  if (dniInput) {
    dniInput.addEventListener("input", () => {
      dniInput.value = dniInput.value.replace(/[^\d]/g, "");
    });
  }

  const submitBtn = document.getElementById("btn-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", getFormData);
  }
}

//Obtener precio y id
async function getPriceDistance() {
  try {
    const res = await fetch(`/api/distancias/${encodeURIComponent(distanciaNombre)}/precio`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al consultar precio");

    distanciaId = data.distancia_id;
    precioBase = parseFloat(data.precio);
    precioFinal = precioBase;

    const precioSpan = document.getElementById("precioFinal");
    if (precioSpan) {
      precioSpan.textContent = precioBase === 0 ? "Gratis" : `$${precioBase.toLocaleString()}`;
    }

  } catch (error) {
    console.error("Error obteniendo distancia:", error);
    alert("No se pudo obtener el precio. Volvé a intentarlo más tarde.");
  }
}


async function getDiscounts() {
  try {
    const res = await fetch("http://localhost:3000/api/descuentos");
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
    const currentFormStep = formSteps[active - 1];
    const inputs = currentFormStep.querySelectorAll(".items");
    let valid = true;

    inputs.forEach((input) => {
      const name = input.getAttribute("name");
      const isDiscountInput = name === "partnerID";
      const hasDiscountChecked = partnerCheckbox.checked;

      if (!input.value && !(isDiscountInput && !hasDiscountChecked)) {
        input.classList.add("error");
        valid = false;
      } else {
        input.classList.remove("error");
      }
    });

    if (!valid) {
      Swal.fire({
        title: "¡Error!",
        text: "¡Falta completar algunos campos!",
        icon: "error",
        confirmButtonText: "Ok"
      });
      return;
    }

    const isFree = precioBase === 0;

    if (isFree && active === 4) {
      active += 2;
    } else {
      active++;
    }

    updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
  });

  prevBtn.addEventListener("click", () => {
    active--;
    updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
  });

  partnerCheckbox.addEventListener("change", () => {
    partnerNumberInput.disabled = !partnerCheckbox.checked;
    if (!partnerCheckbox.checked) partnerNumberInput.value = "";
  });

  updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn);
}

function updateProgress(steps, formSteps, prevBtn, nextBtn, submitBtn) {
  const isFree = precioBase === 0;

  const paso5Title = document.getElementById("paso5-title");
  const paso5Desc = document.getElementById("paso5-desc");
  const metodoPagoGroup = document.getElementById("metodoPagoGroup");
  const mercadoPagoButton = document.getElementById("mercadoPagoButton");

  if (paso5Title && paso5Desc && metodoPagoGroup && mercadoPagoButton) {
    if (isFree) {
      paso5Title.textContent = "Términos y Condiciones";
      paso5Desc.textContent = "Aceptá los términos para completar la inscripción.";
      metodoPagoGroup.style.display = "none";
      mercadoPagoButton.style.display = "none";
    } else {
      paso5Title.textContent = "Pago";
      paso5Desc.textContent = "Seleccioná tu método de pago para completar la inscripción.";
      metodoPagoGroup.style.display = "block";
      mercadoPagoButton.style.display = "block";
    }
  }

  steps.forEach((step, i) => {
    const stepNumber = step.getAttribute("data-step") || (i + 1).toString();
    const isPaymentStep = stepNumber === "5";
    const showStep = (!isFree || !isPaymentStep) && i === active - 1;

    step.classList.toggle("active", showStep);
    formSteps[i].classList.toggle("active", showStep);
  });

  prevBtn.disabled = active === 1;

  if (isFree) {
    nextBtn.disabled = active >= steps.length - 1;
    submitBtn.style.display = active === steps.length - 1 ? "inline-block" : "none";
  } else {
    nextBtn.disabled = active >= steps.length;
    submitBtn.style.display = active === steps.length ? "inline-block" : "none";
  }

  if (active === 4) showData();
}

function dateListener() {
  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  const moveFocus = (from, to, len) =>
    from.addEventListener("input", () => from.value.length === len && to.focus());

  moveFocus(day, month, 2);
  moveFocus(month, year, 2);
  moveFocus(year, document.querySelector(".btn-next"), 4);
}

//OK
function showData() {
  const inputs = document.getElementsByClassName("items");
  const partnerCheckbox = document.querySelector('input[name="check-partner"]');
  const partnerInput = document.querySelector('input[name="partnerID"]');
  const nextEl = document.querySelector(".form-four");

  // Usamos variables globales
  const distancia = distanciaNombre || "No asignada";
  let total = precioBase;

  // Aplicar descuento si corresponde
  let descuentoAplicado = "No aplica";
  if (partnerCheckbox.checked) {
    const codigo = partnerInput.value.toUpperCase();
    const descuento = discounts.find(d => d.discountName === codigo);
    if (descuento) {
      const porcentaje = descuento.percentage;
      total = (precioBase * (1 - porcentaje / 100)).toFixed(2);
      descuentoAplicado = `${codigo} (-${porcentaje}%)`;
    }
  }

  const talle = talles.find(t => t.id === inputs[11].value)?.value || "No asignado";

  const resumenHTML = `
    <div id="payment-status" class="resumen-box">
      <h3 class="resumen-title">🧾 Resumen de inscripción</h3>
      <div class="resumen-section">
        <div><strong>Nombre:</strong> ${inputs[0].value}</div>
        <div><strong>Apellido:</strong> ${inputs[1].value}</div>
        <div><strong>DNI:</strong> ${inputs[2].value}</div>
        <div><strong>Email:</strong> ${inputs[7].value}</div>
        <div><strong>Teléfono:</strong> ${inputs[8].value}</div>
        <div><strong>Ciudad:</strong> ${inputs[9].value}</div>
        <div><strong>Distancia:</strong> ${distancia}</div>
        <div><strong>Talle camiseta:</strong> ${talle}</div>
        <div><strong>Código de descuento:</strong> ${descuentoAplicado}</div>
        <div><strong>Total:</strong> $${total}</div>
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

  // Validaciones
  if (!form.firstname.value || !form.lastname.value || !form.dni.value || !form.email.value) {
    spinner.classList.add("no-display");
    Swal.fire({
      title: "Error",
      text: "Por favor completá todos los campos obligatorios.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (form.dni.value.length < 7 || form.dni.value.length > 8 || isNaN(form.dni.value)) {
    spinner.classList.add("no-display");
    Swal.fire({
      title: "DNI inválido",
      text: "El DNI debe tener entre 7 y 8 números, sin puntos ni letras.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  // Calcular precio con descuento
  const descuentoInput = form["partnerID"]?.value?.toUpperCase();
  const descuento = discounts.find(d => d.discountName === descuentoInput);
  const descuentoAplicado = descuento ? descuento.percentage : 0;

  precioFinal = (precioBase * (1 - descuentoAplicado / 100)).toFixed(2);

  // Armar objeto con los datos del inscripto
  const inscripcionBody = {
    nombre: form.firstname.value,
    apellido: form.lastname.value,
    dni: form.dni.value,
    genero: form.runnerGenre.value,
    fechaNacimiento: `${form.year.value}-${form.month.value.padStart(2, "0")}-${form.day.value.padStart(2, "0")}`,
    email: form.email.value,
    telefono: form.phone.value,
    ciudad: form.city.value,
    distancia_id: distanciaId,
    distancia: distanciaNombre,
    talle: form.tshirtSize.value,
    descuento: descuentoInput || "",
    precio: precioFinal
  };

  try {
    // Guardar temporalmente antes del pago
    const tempRes = await fetch("http://localhost:3000/api/inscripciones/inscripciones-temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcionBody)
    });

    if (!tempRes.ok) throw new Error("Error al guardar inscripción temporal");

    // Crear preferencia de Mercado Pago
    const mpRes = await fetch("http://localhost:3000/api/mercadopago/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcionBody)
    });

    if (!mpRes.ok) throw new Error("Error al generar la preferencia de pago");

    const data = await mpRes.json();
    spinner.classList.add("no-display");

    // Redirigir a pago
    window.location.href = data.init_point;

  } catch (err) {
    console.error(err);
    spinner.classList.add("no-display");
    Swal.fire({
      title: "Error",
      text: "Algo salió mal al procesar la inscripción.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}


function handleQueryParamChange() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  if (status === "approved") {
    let progress = 0;

    Swal.fire({
      html: `
        <div style="text-align: center; padding: 1.5rem;">
        <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJscnhwdmgxN2o5Mjh0cXNuN3JwemcwazdnbmFkdmg0NHJsaThhYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DBjacCxZrCIK217NiO/giphy.gif" 
          alt="Celebración"
          style="width: 100%; max-width: 300px; height: auto; margin-bottom: 25px; border-radius: 16px;" />
          <h2 style="font-size: 2rem; margin-bottom: 15px;">🎉 ¡Inscripción exitosa!</h2>
          <p style="font-size: 1.15rem; margin-bottom: 10px;">Te has registrado en <strong>MMRUN 2024</strong> con éxito.</p>
          <p style="color: #00C18D; font-weight: bold; font-size: 1.1rem; margin-bottom: 20px;">
            💪 ¡Viví la experiencia Mari Menuco!
          </p>
          <p style="margin-top: 10px; font-size: 0.95rem; color: #555; margin-bottom: 30px;">
            📩 A la brevedad recibirás un correo con los detalles de tu inscripción.
          </p>
          <div style="margin-top: 10px;">
            <div id="progress-bar" style="height: 16px; width: 100%; background: #e0e0e0; border-radius: 30px; overflow: hidden;">
              <div id="bar-fill" style="height: 100%; width: 0%; background: linear-gradient(to right, #00faba, #5247b9); transition: width 0.3s;"></div>
            </div>
            <p style="margin-top: 12px; font-size: 1rem; color: #444;">
              Redirigiendo a la página principal...
            </p>
          </div>
        </div>
      `,
      icon: "success",
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: "swal2-popup mmrun-confirm-modal"
      },
      width: 650,
      padding: '3rem',
      didOpen: () => {
        const bar = Swal.getHtmlContainer().querySelector("#bar-fill");
        const interval = setInterval(() => {
          progress += 1;
          if (bar) bar.style.width = progress + "%";
          if (progress >= 300) {
            clearInterval(interval);
            window.location.href = "https://mmrun.com.ar/";
          }
        }, 30);
      }
    });
  }
}

function setupModal() {
  const modal = document.getElementById("myModal");
  const img = document.getElementById("myImg");
  const modalImg = document.getElementById("img01");
  const closeBtn = document.getElementsByClassName("close")[0];

  if (!modal || !img || !modalImg || !closeBtn) return;

  img.onclick = () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  };

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
}
