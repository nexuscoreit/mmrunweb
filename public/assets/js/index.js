let screenSize = window.innerWidth;

var home = document.getElementById("home");
var circuits = [];

window.onload = async function () {
  let response = await fetch("https://api.mmrun.hvdevs.com/categories", {
    mode: "cors",
  });
  let result = await response.json();
  for (let i = 0; i < result.length; i++) {
    circuits.push(result[i]);
  }
  addCategories(circuits);
};

// redirect to register
function register() {
  let url = "https://mmrun.hvdevs.com/registro";
  window.open(url, "_blank").focus();
}

// Responsive nav setup
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menubutton = document.getElementById("mbtn");
const mcloseIcon = document.getElementById("mclose");
const mopenIcon = document.getElementById("mbars");
const mobileMenu = document.getElementById("mmenu");
const suscribeBtn = document.getElementById("suscribe-btn");
const catSection = document.getElementById("cat-sect");

if (screenSize < 450) {
  nav.classList.add("mobile");
} else {
  menubutton.classList.add("desktop");
  suscribeBtn.classList.add("desktop");
}

// display mobile menu
let menuOpen = false;

function openMenu() {
  if (!menuOpen) {
    menuOpen = true;
    menubutton.classList.add("active");
    mopenIcon.classList.add("inactive");
    mcloseIcon.classList.remove("inactive");
    mobileMenu.classList.add("active");
  } else {
    menuOpen = false;
    menubutton.classList.remove("active");
    mopenIcon.classList.remove("inactive");
    mcloseIcon.classList.add("inactive");
    mobileMenu.classList.remove("active");
  }
}

// parallax effect
const logo = document.getElementById("logo");
const subtitle = document.getElementById("logo-subtitle");

document.addEventListener("scroll", function () {
  let val = window.scrollY;

  // Cierra menú si está abierto al hacer scroll
  if (menuOpen === true) {
    menuOpen = false;
    menubutton.classList.remove("active");
    mopenIcon.classList.remove("inactive");
    mcloseIcon.classList.add("inactive");
    mobileMenu.classList.remove("active");
  }
});

if (screenSize > 600) {
  document.addEventListener("scroll", function () {
    let value = window.scrollY;
    if (value < 750) {
      logo.style.marginTop = value + "px";
      subtitle.style.marginTop = value + "px";
    }
  });
}

const categorySection = document.getElementById("cat-sect");

function addCategories(arrayOfCategories) {
  for (let i = 0; i < arrayOfCategories.length; i++) {
    const e = arrayOfCategories[i];
    var category = document.createElement("div");
    category.classList.add("category");

    var km = document.createElement("div");
    km.classList.add("km");

    var catInfoCont = document.createElement("div");
    catInfoCont.classList.add("cat-info-container");

    var title = document.createElement("h1");
    title.textContent = e.title;
    km.appendChild(title);
    category.appendChild(km);
    category.appendChild(catInfoCont);
    categorySection.appendChild(category);

    catInfoCont.setAttribute("id", "cat-info" + i);
    category.setAttribute("id", "category" + i);
    km.setAttribute("id", "km" + i);

    var suscBtn = document.createElement("div");
    suscBtn.classList.add("suscribe-btn");
    suscBtn.textContent = "Inscribirse";
    suscBtn.setAttribute("id", "suscBtn" + i);
    suscBtn.onclick = function () {
      register();
    };

    let ul = document.createElement("ul");
    let liCategories = document.createElement("li");
    let liCircuito = document.createElement("li");
    let liKitCorredor = document.createElement("li");
    let liLargada = document.createElement("li");
    let liPrecio = document.createElement("li");

    ul.setAttribute("id", "ul" + i);
    ul.appendChild(liLargada);
    ul.appendChild(liKitCorredor);
    ul.appendChild(liCategories);
    ul.appendChild(liCircuito);
    ul.appendChild(liPrecio);

    catInfoCont.appendChild(ul);
    catInfoCont.appendChild(suscBtn);
    liPrecio.classList.add("price");

    let largadaP = document.createElement("p");
    largadaP.textContent = e.largada;
    liLargada.textContent = "Largada";
    liLargada.appendChild(largadaP);

    let kitCorredorP = document.createElement("p");
    kitCorredorP.textContent = e.kit_corredor;
    liKitCorredor.textContent = "Kit Corredor";
    liKitCorredor.appendChild(kitCorredorP);

    let categoriesP = document.createElement("p");
    categoriesP.textContent = e.categories;
    liCategories.textContent = "Categorias";
    liCategories.appendChild(categoriesP);

    let circuitoP = document.createElement("p");
    circuitoP.textContent = e.circuito;
    liCircuito.textContent = "Circuito";
    liCircuito.appendChild(circuitoP);

    let precioP = document.createElement("p");
    precioP.textContent = "$ " + e.precio + ".00";
    liPrecio.textContent = "Precio";
    liPrecio.appendChild(precioP);

    ul.style.display = "none";
    suscBtn.style.display = "none";

    category.onclick = function () {
      expandCat(i);
    };
  }
}

var divExpanded;
var expanded = false;
var activeCard = false;

function collapseCat(numb) {
  expanded = false;
  activeCard = false;

  let cate = document.getElementById("category" + numb);
  let km = document.getElementById("km" + numb);
  let u = document.getElementById("ul" + numb);
  let btn = document.getElementById("suscBtn" + numb);

  cate.style.height = "100px";
  km.style.top = "50%";
  u.style.display = "none";
  btn.style.display = "none";

  if (screenSize > 600) {
    cate.style.height = "200px";
    cate.style.width = "50%";
    cate.style.margin = "auto 0";
  }
}

function expandCat(numb) {
  let cate = document.getElementById("category" + numb);
  let km = document.getElementById("km" + numb);
  let u = document.getElementById("ul" + numb);
  let btn = document.getElementById("suscBtn" + numb);

  divExpanded = numb;

  if (!expanded) {
    for (let i = 0; i < circuits.length; i++) {
      collapseCat(i);
    }

    cate.style.height = "100%";
    window.scrollTo(0, screenSize > 600 ? 1700 : 1645);

    u.style.display = "flex";
    btn.style.display = "flex";
    km.style.top = "10%";

    if (screenSize > 600) {
      expanded = true;
      cate.style.width = "60%";
    }
  } else {
    expanded = false;
    collapseCat(numb);
  }
}

function handleResponsiveMenu() {
  const screenWidth = window.innerWidth;
  const nav = document.getElementById("nav");
  const menubutton = document.getElementById("mbtn");
  const mobileMenu = document.getElementById("mmenu");

  if (screenWidth < 1024) {
    nav.style.display = "none";
    menubutton.style.display = "flex";
    mobileMenu.classList.remove("active");
  } else {
    nav.style.display = "flex";
    menubutton.style.display = "none";
    mobileMenu.classList.remove("active");
  }
}

window.addEventListener("DOMContentLoaded", handleResponsiveMenu);
window.addEventListener("resize", handleResponsiveMenu);

function toggleMobileMenu() {
  const menu = document.getElementById("mobileDropdown");
  const isOpen = menu.classList.toggle("active");

  document.body.classList.toggle("menu-open", isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("mobileDropdown").classList.remove("active");
      document.body.classList.remove("menu-open");

      mobileLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
