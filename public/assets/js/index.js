// index.js

// Variables globales y selectores DOM
const screenSize = window.innerWidth;
const circuits = [];
const home = document.getElementById("home");
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menubutton = document.getElementById("mbtn");
const mcloseIcon = document.getElementById("mclose");
const mopenIcon = document.getElementById("mbars");
const mobileMenu = document.getElementById("mmenu");
const suscribeBtn = document.querySelector(".suscribe-btn");
const logo = document.getElementById("logo");
const subtitle = document.getElementById("logo-subtitle");
const categorySection = document.getElementById("cat-sect");

let menuOpen = false;
let divExpanded;
let expanded = false;
let activeCard = false;

function register() {
  window.open("https://mmrun.hvdevs.com/registro", "_blank")?.focus();
}

if (screenSize < 450) {
  nav?.classList.add("mobile");
} else {
  menubutton?.classList.add("desktop");
  suscribeBtn?.classList.add("desktop");
}

function openMenu() {
  menuOpen = !menuOpen;
  menubutton?.classList.toggle("active", menuOpen);
  mopenIcon?.classList.toggle("inactive", menuOpen);
  mcloseIcon?.classList.toggle("inactive", !menuOpen);
  mobileMenu?.classList.toggle("active", menuOpen);
}

document.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
  
    if (menuOpen) openMenu();

  });
  document.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const btn = document.getElementById("comenzarBtn");
    const subtitle = document.getElementById("logo-subtitle");
  
    if (!btn || !subtitle) return;
  
    if (scrollY > 100) {
      btn.classList.add("hidden");
      subtitle.classList.add("move-up");
    } else {
      btn.classList.remove("hidden");
      subtitle.classList.remove("move-up");
    }
  });

function addCategories(array) {
  array.forEach((e, i) => {
    const category = document.createElement("div");
    category.classList.add("category");
    category.id = "category" + i;

    const km = document.createElement("div");
    km.classList.add("km");
    km.id = "km" + i;

    const title = document.createElement("h1");
    title.textContent = e.title;
    km.appendChild(title);
    category.appendChild(km);

    const catInfoCont = document.createElement("div");
    catInfoCont.classList.add("cat-info-container");
    catInfoCont.id = "cat-info" + i;

    const ul = document.createElement("ul");
    ul.id = "ul" + i;
    ul.style.display = "none";

    const liData = [
      { text: "Largada", value: e.largada },
      { text: "Kit Corredor", value: e.kit_corredor },
      { text: "Categorias", value: e.categories },
      { text: "Circuito", value: e.circuito },
      { text: "Precio", value: "$ " + e.precio + ".00", isPrice: true },
    ];

    liData.forEach(({ text, value, isPrice }) => {
      const li = document.createElement("li");
      li.textContent = text;
      if (isPrice) li.classList.add("price");
      const p = document.createElement("p");
      p.textContent = value;
      li.appendChild(p);
      ul.appendChild(li);
    });

    const suscBtn = document.createElement("div");
    suscBtn.classList.add("suscribe-btn");
    suscBtn.id = "suscBtn" + i;
    suscBtn.textContent = "Inscribirse";
    suscBtn.style.display = "none";
    suscBtn.onclick = register;

    catInfoCont.appendChild(ul);
    catInfoCont.appendChild(suscBtn);

    category.appendChild(catInfoCont);
    categorySection?.appendChild(category);

    category.onclick = () => expandCat(i);
  });
}

function expandCat(numb) {
  const cate = document.getElementById("category" + numb);
  const km = document.getElementById("km" + numb);
  const u = document.getElementById("ul" + numb);
  const btn = document.getElementById("suscBtn" + numb);

  divExpanded = numb;

  if (!expanded) {
    circuits.forEach((_, i) => collapseCat(i));
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

function collapseCat(numb) {
  const cate = document.getElementById("category" + numb);
  const km = document.getElementById("km" + numb);
  const u = document.getElementById("ul" + numb);
  const btn = document.getElementById("suscBtn" + numb);

  expanded = false;
  activeCard = false;

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

function handleResponsiveMenu() {
  const screenWidth = window.innerWidth;
  if (!nav || !menubutton || !mobileMenu) return;

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

document.addEventListener("DOMContentLoaded", () => {
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const closeBtn = document.getElementById("closeMobileMenu");
  const mobileMenu = document.getElementById("mobileDropdown");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu?.classList.remove("active");
      document.body.classList.remove("menu-open");
      mobileLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  }
});

function toggleMobileMenu() {
  const menu = document.getElementById("mobileDropdown");
  const isOpen = menu?.classList.toggle("active");
  document.body.classList.toggle("menu-open", isOpen);
}

// Fijar navbar arriba al hacer scroll
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("mainNavbar");
    const topbar = document.querySelector(".topbar");
  
    if (window.scrollY > 0) {
      navbar?.classList.add("scrolled");
      topbar?.classList.add("hidden");
    } else {
      navbar?.classList.remove("scrolled");
      topbar?.classList.remove("hidden");
    }
  });
  
  document.addEventListener("scroll", function () {
    const home = document.querySelector("#home");
    const button = document.querySelector(".btn-comenzar");
    const subtitle = document.querySelector("#logo-subtitle");
    const rect = home.getBoundingClientRect();
  
    if (rect.bottom < 100 || rect.top < -200) {
      button.classList.add("hidden");
      subtitle.classList.add("move-up");
    } else {
      button.classList.remove("hidden");
      subtitle.classList.remove("move-up");
    }
  });
  