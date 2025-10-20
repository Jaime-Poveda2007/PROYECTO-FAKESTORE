// Subcódigos en js/carrito.js
import { crearCarritoAPI, actualizarCarritoAPI } from "./api.js";
import { escapeHtml, truncate } from "./helpers.js";
import { mostrarPago } from "./ui.js";

let carritoActual = { id: null, productos: [] };
const contenido = document.getElementById("contenido");

// ----------------------------------------------------
// Inicialización global de funciones
// ----------------------------------------------------
export function inicializarCarrito() {
  window.agregarAlCarrito = agregarAlCarrito;
  window.mostrarCarrito = mostrarCarrito;
}

// ----------------------------------------------------
// Agregar producto al carrito
// ----------------------------------------------------
export async function agregarAlCarrito(idProducto) {
  try {
    // Si no existe un carrito, crear uno nuevo
    if (!carritoActual.id) {
      const nuevo = await crearCarritoAPI();
      carritoActual.id = nuevo.id;
      carritoActual.productos = [];
    }

    // Buscar si el producto ya está en el carrito
    const existente = carritoActual.productos.find(p => p.productId === idProducto);
    if (existente) existente.quantity += 1;
    else carritoActual.productos.push({ productId: idProducto, quantity: 1 });

    // Actualizar carrito en la API
    await actualizarCarritoAPI(carritoActual.id, carritoActual.productos);
    alert("✅ Producto agregado al carrito");
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    alert("❌ No se pudo agregar el producto al carrito.");
  }
}

// ----------------------------------------------------
// Mostrar carrito en pantalla
// ----------------------------------------------------
export async function mostrarCarrito() {
  if (!contenido) return;

  // Si el carrito está vacío
  if (!carritoActual.id || carritoActual.productos.length === 0) {
    contenido.innerHTML = "<h2>🛒 Carrito vacío</h2>";
    return;
  }

  try {
    // Obtener detalles de los productos desde la API
    const detalles = await Promise.all(
      carritoActual.productos.map(async (p) => {
        const res = await fetch(`https://fakestoreapi.com/products/${p.productId}`);
        const data = await res.json();
        return { ...data, quantity: p.quantity };
      })
    );

    // Calcular total
    const total = detalles.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Mostrar contenido del carrito
    contenido.innerHTML = `
      <h2>🛒 Tu carrito</h2>
      <div class="grid-productos">
        ${detalles
          .map(
            (p) => `
          <div class="card-producto">
            <img src="${p.image}" alt="${escapeHtml(p.title)}">
            <h4>${escapeHtml(truncate(p.title, 60))}</h4>
            <p>Precio: $${p.price}</p>
            <p>Cantidad: ${p.quantity}</p>
            <p><b>Subtotal:</b> $${(p.price * p.quantity).toFixed(2)}</p>
          </div>
        `
          )
          .join("")}
      </div>
      <h3>Total: $${total.toFixed(2)}</h3>
      <div class="acciones-carrito">
        <button id="btn-pago" class="btn-agregar">Proceder al pago 💳</button>
      </div>
    `;

    // Evento para el botón de pago
    document.getElementById("btn-pago").addEventListener("click", () => {
      mostrarPago(total);
    });
  } catch (error) {
    console.error("Error al mostrar carrito:", error);
    contenido.innerHTML = "<p>Error al cargar el carrito.</p>";
  }
}
