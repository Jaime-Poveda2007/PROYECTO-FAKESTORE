// Subcodigos en js/ui.js
import { obtenerProductos, obtenerProductosPorCategoria } from "./api.js";
import { escapeHtml, truncate } from "./helpers.js";
import { agregarAlCarrito, mostrarCarrito } from "./carrito.js";

const contenido = document.getElementById("contenido");

export async function mostrarProductos(categoria = "todos") {
  if (!contenido) return;
  contenido.innerHTML = "<h2>Cargando productos...</h2>";

  try {
    const productos =
      categoria === "todos"
        ? await obtenerProductos()
        : await obtenerProductosPorCategoria(categoria);

    contenido.innerHTML = `
      <section class="productos">
        <h2>${categoria === "todos" ? "Todos los productos" : categoria}</h2>
        <div class="grid-productos">
          ${productos
            .map(
              (p) => `
            <div class="card-producto">
              <img src="${p.image}" alt="${escapeHtml(p.title)}">
              <h4>${escapeHtml(truncate(p.title, 70))}</h4>
              <p>$${p.price}</p>
              <button class="btn-agregar" data-id="${
                p.id
              }">Agregar al carrito</button>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;

    // Escuchamos clicks en botones del carrito
    document.querySelectorAll(".btn-agregar").forEach((btn) => {
      btn.addEventListener("click", () =>
        agregarAlCarrito(parseInt(btn.dataset.id))
      );
    });
  } catch (error) {
    console.error(error);
    contenido.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

export function mostrarHome() {
  if (!contenido) return;
  contenido.innerHTML = `
    <section class="home">
      <h1>🛍️ Bienvenido a Mi Tienda Online</h1>
      <p>Explora nuestras categorías o mira todos los productos disponibles.</p>
      <button id="ver-todo" class="btn-ver-todo">Ver todos los productos</button>

      <div class="grid categorias-home">
        <div class="card" data-cat="men's clothing">
          <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="Ropa masculina">
          <h3>Ropa masculina</h3>
        </div>
        <div class="card" data-cat="women's clothing">
          <img src="https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" alt="Ropa femenina">
          <h3>Ropa femenina</h3>
        </div>
        <div class="card" data-cat="electronics">
          <img src="https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg" alt="Tecnología">
          <h3>Tecnología</h3>
        </div>
        <div class="card" data-cat="jewelery">
          <img src="https://fakestoreapi.com/img/71yaIMZ+XFL._AC_UL640_QL65_ML3_.jpg" alt="Joyería">
          <h3>Joyería</h3>
        </div>
      </div>
    </section>
  `;

  document
    .getElementById("ver-todo")
    .addEventListener("click", () => mostrarProductos("todos"));
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => mostrarProductos(card.dataset.cat));
  });

  mostrarProductos("todos");
}
// ----------------------------------------------------
// Formularios de usuario
// ----------------------------------------------------
export function mostrarLogin() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = `
    <section class="login">
      <h2>Iniciar Sesión</h2>
      <form class="formulario">
        <input type="email" placeholder="Correo electrónico" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit" class="btn-agregar">Ingresar</button>
      </form>
    </section>
  `;
}

export function mostrarRegistro() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = `
    <section class="registro">
      <h2>Registrarse</h2>
      <form class="formulario">
        <input type="text" placeholder="Nombre completo" required>
        <input type="email" placeholder="Correo electrónico" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit" class="btn-agregar">Crear cuenta</button>
      </form>
    </section>
  `;
}
// ----------------------------------------------------
// Sección de Pago
// ----------------------------------------------------
export function mostrarPago(total = 0) {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = `
    <section class="pago">
      <h2>💳 Procesar Pago</h2>
      <p>Total a pagar: <b>$${total.toFixed(2)}</b></p>
      <form class="formulario">
        <input type="text" placeholder="Nombre en la tarjeta" required>
        <input type="text" placeholder="Número de tarjeta" maxlength="16" required>
        <input type="text" placeholder="Fecha de expiración (MM/AA)" required>
        <input type="text" placeholder="CVV" maxlength="3" required>
        <button type="submit" class="btn-agregar">Confirmar pago</button>
      </form>
    </section>
  `;

  const form = contenedor.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Pago realizado con éxito. ¡Gracias por tu compra!");
    mostrarHome(); // vuelve al inicio
  });
}
