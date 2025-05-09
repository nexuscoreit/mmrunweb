import { loadComponent, loadBtnInscripcion, configurarCierreModal } from './load-components.js';

// 🔹 VARIABLES GLOBALES
const screenSize = window.innerWidth;
const circuits = [];
const DOM = {
  home: document.getElementById("home"),
  header: document.getElementById("header"),
  nav: document.getElementById("nav"),
  menuButton: document.getElementById("mbtn"),
  closeIcon: document.getElementById("mclose"),
  openIcon: document.getElementById("mbars"),
  mobileMenu: document.getElementById("mmenu"),
  suscribeBtn: document.querySelector(".suscribe-btn"),
  logo: document.getElementById("logo"),
  subtitle: document.getElementById("logo-subtitle"),
  categorySection: document.getElementById("cat-sect"),
};

let menuOpen = false;
let expanded = false;
let divExpanded = null;

// FETCH CATEGORÍAS
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

// INSCRIPCIÓN
const openRegistration = () => window.open("https://mmrun.hvdevs.com/registro", "_blank")?.focus();

// MENÚ RESPONSIVE Y TOGGLE
function updateResponsiveMenu() {
  const w = window.innerWidth;
  if (!DOM.nav || !DOM.menuButton || !DOM.mobileMenu) return;

  if (w < 1024) {
    DOM.nav.style.display = "none";
    DOM.menuButton.style.display = "flex";
    DOM.mobileMenu.classList.remove("active");
  } else {
    DOM.nav.style.display = "flex";
    DOM.menuButton.style.display = "none";
    DOM.mobileMenu.classList.remove("active");
  }
}

window.addEventListener("resize", updateResponsiveMenu);

// BOTONES Y EVENTOS DE NAVEGACIÓN
function setupNavbarListeners() {
  const openBtn = document.getElementById("openMenuBtn");
  const closeBtn = document.getElementById("closeMobileMenu");
  const menu = document.getElementById("mobileDropdown");

  openBtn?.addEventListener("click", () => {
    menu?.classList.add("active");
    document.body.classList.add("menu-open");
  });

  closeBtn?.addEventListener("click", () => {
    menu?.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
}

// CATEGORÍAS
function renderCategories(array) {
  array.forEach((item, i) => {
    const category = document.createElement("div");
    category.classList.add("category");
    category.id = `category${i}`;

    const km = document.createElement("div");
    km.classList.add("km");
    km.id = `km${i}`;

    const title = document.createElement("h1");
    title.textContent = item.title;
    km.appendChild(title);
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
    DOM.categorySection?.appendChild(category);
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
    window.scrollTo(0, screenSize > 600 ? 1700 : 1645);
    ul.style.display = "flex";
    btn.style.display = "flex";
    km.style.top = "10%";

    if (screenSize > 600) {
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
  cate.style.height = screenSize > 600 ? "200px" : "100px";
  cate.style.width = screenSize > 600 ? "50%" : "";
  cate.style.margin = screenSize > 600 ? "auto 0" : "";

  km.style.top = "50%";
  ul.style.display = "none";
  btn.style.display = "none";
}

// 🔹 NAVBAR SCROLL STICKY
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

// ENLACE ACTIVO
function setupActiveLinks() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".main-navbar .menu a, .mobile-nav a");

  const setActiveLink = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink);
}

// SCROLL A INFO
function setupScrollToInfo() {
  const verInfoBtn = document.getElementById("verInfo");
  if (verInfoBtn) {
    verInfoBtn.addEventListener("click", () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

// ANIMAR CONTADORES
function animarContadores() {
  const counters = document.querySelectorAll('.number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const update = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const step = Math.ceil(target / 60);
            if (count < target) {
              counter.innerText = count + step;
              setTimeout(update, 20);
            } else {
              counter.innerText = target + "+";
            }
          };
          update();
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const stats = document.querySelector('.about-stats');
  if (stats) observer.observe(stats);
}

// INICIALIZACIÓN GENERAL
window.addEventListener("DOMContentLoaded", async () => {
  updateResponsiveMenu();
  setupNavbarListeners();
  setupActiveLinks();
  setupScrollToInfo();
  animarContadores();

  // Cargar componentes reutilizables
  await loadComponent('topbar-container', '/views/components/topbar.html', () => {
    const el = document.getElementById("typeWriter");
    if (!el) return;

    const text = window.innerWidth < 768
      ? "Tercera Edición,\nSeptiembre 2025"
      : "Tercera Edición. Septiembre 2025";

    const startTypewriter = () => {
      el.textContent = "";
      let i = 0;
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
          setTimeout(type, 40);
        } else {
          setTimeout(startTypewriter, 10000);
        }
      };
      type();
    };

    startTypewriter();
  });

  await loadComponent('navbar-container', '/views/components/navbar.html');
  await loadComponent('mobile-menu-container', '/views/components/mobile-menu.html');
  await loadComponent('footer-container', '/views/components/footer.html');
  await loadComponent('distancia-modal-container', '/views/components/distancia-modal.html', async () => {
    const module = await import('/assets/js/modal.js');
    if (module?.default) module.default();
  });
  
  configurarCierreModal();

  if (document.getElementById('btnParticiparContainer')) {
    loadBtnInscripcion('btnParticiparContainer', '¡QUIERO CORRER!');
  }

  const interval = setInterval(() => {
    const navbarBtn = document.getElementById('navbarBtnContainer');
    if (navbarBtn) {
      clearInterval(interval);
      loadBtnInscripcion('navbarBtnContainer', '¡QUIERO PARTICIPAR!');
    }
  }, 100);
});
