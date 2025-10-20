// Subcódigos en js/carrito.js
import { crearCarritoAPI, actualizarCarritoAPI } from "./api.js";
import { escapeHtml, truncate } from "./helpers.js";
import { mostrarPago } from "./ui.js";

let carritoActual = { id: null, productos: [] };
let favoritos = [];

function getContenido() {
  return document.getElementById("contenido");
}

// ----------------------------------------------------
// Inicialización global de funciones
// ----------------------------------------------------
export function inicializarCarrito() {
  window.agregarAlCarrito = agregarAlCarrito;
  window.mostrarCarrito = mostrarCarrito;
  window.mostrarFavoritos = mostrarFavoritos;
  window.toggleFavorito = toggleFavorito;
}

// ----------------------------------------------------
// Agregar producto al carrito
// ----------------------------------------------------
export async function agregarAlCarrito(idProducto) {
  try {
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
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    alert("❌ No se pudo agregar el producto al carrito.");
  }
}

// ----------------------------------------------------
// Mostrar carrito (sin innerHTML)
// ----------------------------------------------------
export async function mostrarCarrito() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  if (!carritoActual.id || carritoActual.productos.length === 0) {
    const vacio = document.createElement("h2");
    vacio.textContent = "Carrito vacío";
    contenido.appendChild(vacio);
    return;
  }

  try {
    const detalles = await Promise.all(
      carritoActual.productos.map(async (p) => {
        const res = await fetch(`https://fakestoreapi.com/products/${p.productId}`);
        const data = await res.json();
        return { ...data, quantity: p.quantity };
      })
    );

    const total = detalles.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const titulo = document.createElement("h2");
    titulo.textContent = "🛒 Tu carrito";
    contenido.appendChild(titulo);

    const grid = document.createElement("div");
    grid.classList.add("grid-productos");

    detalles.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("card-producto");

      const img = document.createElement("img");
      img.src = p.image;
      img.alt = escapeHtml(p.title);

      const nombre = document.createElement("h4");
      nombre.textContent = truncate(p.title, 60);

      const precio = document.createElement("p");
      precio.textContent = `Precio: $${p.price}`;

      const cantidad = document.createElement("p");
      cantidad.textContent = `Cantidad: ${p.quantity}`;

      const subtotal = document.createElement("p");
      subtotal.textContent = `Subtotal: $${(p.price * p.quantity).toFixed(2)}`;

      card.append(img, nombre, precio, cantidad, subtotal);
      grid.appendChild(card);
    });

    contenido.append(grid);

    const totalTexto = document.createElement("h3");
    totalTexto.textContent = `Total: $${total.toFixed(2)}`;
    contenido.appendChild(totalTexto);

    const contBoton = document.createElement("div");
    contBoton.classList.add("acciones-carrito");

    const btnPago = document.createElement("button");
    btnPago.id = "btn-pago";
    btnPago.classList.add("btn-agregar");
    btnPago.textContent = "Proceder al pago 💳";
    btnPago.addEventListener("click", () => mostrarPago(total));

    contBoton.appendChild(btnPago);
    contenido.appendChild(contBoton);

  } catch (error) {
    console.error("Error al mostrar carrito:", error);
    const msg = document.createElement("p");
    msg.textContent = "Error al cargar el carrito.";
    contenido.appendChild(msg);
  }
}

// ----------------------------------------------------
// Favoritos
// ----------------------------------------------------
function toggleFavorito(id) {
  favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  alert("Favorito actualizado");
}

// ----------------------------------------------------
// Mostrar favoritos (sin innerHTML)
// ----------------------------------------------------
async function mostrarFavoritos() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const titulo = document.createElement("h2");
  titulo.textContent = "Favoritos";
  contenido.appendChild(titulo);

  const grid = document.createElement("div");
  grid.classList.add("grid-productos");

  const productos = await Promise.all(
    favoritos.map(async (id) => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      return await res.json();
    })
  );

  productos.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("card-producto");

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = escapeHtml(p.title);

    const nombre = document.createElement("h4");
    nombre.textContent = escapeHtml(p.title);

    const precio = document.createElement("p");
    precio.textContent = `$${p.price}`;

    const btnCarrito = document.createElement("button");
    btnCarrito.classList.add("btn-agregar");
    btnCarrito.textContent = "Agregar al carrito";
    btnCarrito.addEventListener("click", () => agregarAlCarrito(p.id));

    card.append(img, nombre, precio, btnCarrito);
    grid.appendChild(card);
  });

  contenido.appendChild(grid);
}
