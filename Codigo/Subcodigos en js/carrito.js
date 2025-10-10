// Subcodigos en js/carrito.js
import { crearCarritoAPI, actualizarCarritoAPI } from "./api.js";
import { escapeHtml, truncate } from "./helpers.js";

let carritoActual = { id: null, productos: [] };
const contenido = document.getElementById("contenido");

export function inicializarCarrito() {
  window.agregarAlCarrito = agregarAlCarrito;
  window.mostrarCarrito = mostrarCarrito;
}

export async function agregarAlCarrito(idProducto) {
  if (!carritoActual.id) {
    const nuevo = await crearCarritoAPI();
    carritoActual.id = nuevo.id;
    carritoActual.productos = [];
  }

  const existente = carritoActual.productos.find(p => p.productId === idProducto);
  if (existente) existente.quantity += 1;
  else carritoActual.productos.push({ productId: idProducto, quantity: 1 });

  await actualizarCarritoAPI(carritoActual.id, carritoActual.productos);
  alert("✅ Producto agregado al carrito");
}

export async function mostrarCarrito() {
  if (!contenido) return;
  if (!carritoActual.id || carritoActual.productos.length === 0) {
    contenido.innerHTML = "<h2>Carrito vacío</h2>";
    return;
  }

  const detalles = await Promise.all(carritoActual.productos.map(async (p) => {
    const res = await fetch(`https://fakestoreapi.com/products/${p.productId}`);
    const data = await res.json();
    return { ...data, quantity: p.quantity };
  }));

  const total = detalles.reduce((sum, p) => sum + p.price * p.quantity, 0);
  contenido.innerHTML = `
    <h2>🛒 Tu carrito</h2>
    <div class="grid-productos">
      ${detalles.map(p => `
        <div class="card-producto">
          <img src="${p.image}" alt="${escapeHtml(p.title)}">
          <h4>${escapeHtml(truncate(p.title, 60))}</h4>
          <p>Precio: $${p.price}</p>
          <p>Cantidad: ${p.quantity}</p>
          <p><b>Subtotal:</b> $${(p.price * p.quantity).toFixed(2)}</p>
        </div>
      `).join("")}
    </div>
    <h3>Total: $${total.toFixed(2)}</h3>
  `;
}
