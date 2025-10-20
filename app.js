// ----------------------------------------------------
// Archivo principal: coordina el flujo general
// ----------------------------------------------------
import { mostrarHome } from "./ui.js";
import { inicializarMenu } from "./menu.js";
import { inicializarCarrito } from "./carrito.js";

// Esperamos que el DOM esté cargado antes de iniciar
document.addEventListener("DOMContentLoaded", () => {
  mostrarHome();
  inicializarMenu();
  inicializarCarrito();
});
