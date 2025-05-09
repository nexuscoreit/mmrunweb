// Lógica de categorías (exclusiva de Home)
const circuits = [];
let expanded = false;
let divExpanded = null;

window.addEventListener("load", async () => {
  try {
    const res = await fetch("https://api.mmrun.hvdevs.com/categories", { mode: "cors" });
    const data = await res.json();
    circuits.push(...data);
    renderCategories(circuits);
  } catch (err) {
    console.error("Error al cargar las categorías:", err);
  }
});

const openRegistration = () => {
  window.open("https://mmrun.hvdevs.com/registro", "_blank")?.focus();
};

function renderCategories(array) {
  const container = document.getElementById("cat-sect");
  if (!container) return;

  array.forEach((item, i) => {
    const category = document.createElement("div");
    category.classList.add("category");
    category.id = `category${i}`;

    const km = document.createElement("div");
    km.classList.add("km");
    km.id = `km${i}`;
    km.innerHTML = `<h1>${item.title}</h1>`;
    category.appendChild(km);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("cat-info-container");
    infoContainer.id = `cat-info${i}`;

    const ul = document.createElement("ul");
    ul.id = `ul${i}`;
    ul.style.display = "none";

    const details = [
      { label: "Largada", value: item.largada },
      { label: "Kit Corredor", value: item.kit_corredor },
      { label: "Categorias", value: item.categories },
      { label: "Circuito", value: item.circuito },
      { label: "Precio", value: `$ ${item.precio}.00`, isPrice: true },
    ];

    details.forEach(({ label, value, isPrice }) => {
      const li = document.createElement("li");
      li.textContent = label;
      if (isPrice) li.classList.add("price");
      const p = document.createElement("p");
      p.textContent = value;
      li.appendChild(p);
      ul.appendChild(li);
    });

    const button = document.createElement("div");
    button.classList.add("suscribe-btn");
    button.id = `suscBtn${i}`;
    button.textContent = "Inscribirse";
    button.style.display = "none";
    button.onclick = openRegistration;

    infoContainer.appendChild(ul);
    infoContainer.appendChild(button);

    category.appendChild(infoContainer);
    container.appendChild(category);

    category.onclick = () => toggleCategory(i);
  });
}

function toggleCategory(index) {
  const cate = document.getElementById(`category${index}`);
  const km = document.getElementById(`km${index}`);
  const ul = document.getElementById(`ul${index}`);
  const btn = document.getElementById(`suscBtn${index}`);

  divExpanded = index;

  if (!expanded) {
    circuits.forEach((_, i) => collapseCategory(i));
    cate.style.height = "100%";
    window.scrollTo(0, window.innerWidth > 600 ? 1700 : 1645);
    ul.style.display = "flex";
    btn.style.display = "flex";
    km.style.top = "10%";

    if (window.innerWidth > 600) {
      expanded = true;
      cate.style.width = "60%";
    }
  } else {
    expanded = false;
    collapseCategory(index);
  }
}

function collapseCategory(index) {
  const cate = document.getElementById(`category${index}`);
  const km = document.getElementById(`km${index}`);
  const ul = document.getElementById(`ul${index}`);
  const btn = document.getElementById(`suscBtn${index}`);

  expanded = false;
  cate.style.height = window.innerWidth > 600 ? "200px" : "100px";
  cate.style.width = window.innerWidth > 600 ? "50%" : "";
  cate.style.margin = window.innerWidth > 600 ? "auto 0" : "";

  km.style.top = "50%";
  ul.style.display = "none";
  btn.style.display = "none";
}

// Botón "Enterate más"
document.addEventListener("DOMContentLoaded", () => {
  const verInfoBtn = document.getElementById("verInfo");
  verInfoBtn?.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });
});

