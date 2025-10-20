import { mostrarHome, mostrarProductos, mostrarLogin, mostrarRegistro, mostrarInformativa } from "./ui.js";
import { mostrarCarrito } from "./carrito.js";


export function inicializarMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const enlaces = menu.querySelectorAll("a");

  if (!menuBtn || !menu) return;

  // 🔹 Al cargar, el menú se mantiene oculto
  menu.classList.remove("mostrar");

  // 🔹 Botón para abrir/cerrar menú
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("mostrar");
  });

  // 🔹 Clic en enlaces del menú
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.remove("mostrar");

      const cat = e.target.dataset.category;

      if (e.target.id === "menu-inicio") mostrarHome();
      else if (e.target.id === "menu-carrito") mostrarCarrito();
      else if (e.target.id === "menu-favoritos") mostrarFavoritos();
      else if (e.target.id === "menu-login") mostrarLogin();
      else if (e.target.id === "menu-register") mostrarRegistro();
      else if (cat) mostrarProductos(cat);
      else if (e.target.id === "menu-informativa") mostrarInformativa();

    });
  });

  // 🔹 Cerrar menú si se hace clic fuera de él
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      menu.classList.remove("mostrar");
    }
  });

    // 🔹 Clic en el logo para volver al inicio
  const logo = document.getElementById("logo-inicio");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarHome();
    });
  }

}
