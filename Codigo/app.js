// app.js

// -------------------------------------------------------
// 🔹 VARIABLES GLOBALES
// -------------------------------------------------------
const contenido = document.getElementById("contenido");
const menuProductos = document.getElementById("menu-productos");
const menuCarrito = document.getElementById("menu-carrito");

// Objeto que guarda el estado de nuestro carrito
let carritoActual = {
  id: null,
  productos: [] // Cada producto tendrá { productId, quantity }
};


// -------------------------------------------------------
// 🔹 FUNCIÓN: MOSTRAR PRODUCTOS DESDE LA API
// -------------------------------------------------------
menuProductos.addEventListener("click", async () => {
  contenido.innerHTML = "<h2>Cargando productos...</h2>";

  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const productos = await res.json();

    // Mostramos las tarjetas de producto dinámicamente
    contenido.innerHTML = `
      <h2>Productos disponibles</h2>
      <div class="grid">
        ${productos.map(p => `
          <div class="producto">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>$${p.price}</p>
            <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    contenido.innerHTML = "<p>Error al cargar productos 😢</p>";
    console.error(error);
  }
});


// -------------------------------------------------------
// 🔹 FUNCIÓN: CREAR UN NUEVO CARRITO EN LA API
// -------------------------------------------------------
async function crearCarrito() {
  const nuevoCarrito = {
    userId: 1,
    date: new Date().toISOString().split("T")[0],
    products: []
  };

  const res = await fetch("https://fakestoreapi.com/carts", {
    method: "POST",
    body: JSON.stringify(nuevoCarrito),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();

  carritoActual.id = data.id;
  carritoActual.productos = [];
  console.log("🛒 Carrito creado:", data);
}


// -------------------------------------------------------
// 🔹 FUNCIÓN: AGREGAR PRODUCTO AL CARRITO
// -------------------------------------------------------
async function agregarAlCarrito(idProducto) {
  // Si el carrito aún no existe, lo creamos
  if (!carritoActual.id) {
    await crearCarrito();
  }

  // Revisamos si el producto ya está en el carrito
  const productoExistente = carritoActual.productos.find(p => p.productId === idProducto);

  if (productoExistente) {
    // Si ya estaba, aumentamos su cantidad
    productoExistente.quantity += 1;
  } else {
    // Si no estaba, lo agregamos
    carritoActual.productos.push({ productId: idProducto, quantity: 1 });
  }

  // Enviamos el carrito actualizado a la API
  const actualizado = {
    userId: 1,
    date: new Date().toISOString().split("T")[0],
    products: carritoActual.productos
  };

  const res = await fetch(`https://fakestoreapi.com/carts/${carritoActual.id}`, {
    method: "PUT",
    body: JSON.stringify(actualizado),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  console.log("✅ Carrito actualizado:", data);

  alert("Producto agregado al carrito 🛒");
}


// -------------------------------------------------------
// 🔹 FUNCIÓN: MOSTRAR CARRITO CON DETALLES REALES
// -------------------------------------------------------
menuCarrito.addEventListener("click", async () => {
  // Si no hay carrito aún, mostramos un mensaje
  if (!carritoActual.id || carritoActual.productos.length === 0) {
    contenido.innerHTML = `
      <h2>Carrito</h2>
      <p>No tienes productos en el carrito todavía.</p>
    `;
    return;
  }

  // Obtenemos los detalles de cada producto desde la API
  const detalles = [];
  for (const item of carritoActual.productos) {
    const res = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
    const producto = await res.json();
    detalles.push({ ...producto, quantity: item.quantity });
  }

  // Calculamos el total del carrito
  const total = detalles.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Mostramos el carrito con imágenes, precios y botón de eliminar
  contenido.innerHTML = `
    <h2>Tu carrito 🛍️</h2>
    <div class="grid">
      ${detalles.map(p => `
        <div class="producto">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>Precio: $${p.price}</p>
          <p>Cantidad: ${p.quantity}</p>
          <p><b>Subtotal:</b> $${(p.price * p.quantity).toFixed(2)}</p>
          <button onclick="eliminarDelCarrito(${p.id})">Eliminar</button>
        </div>
      `).join('')}
    </div>
    <h3>Total del carrito: $${total.toFixed(2)}</h3>
  `;
});


// -------------------------------------------------------
// 🔹 FUNCIÓN: ELIMINAR PRODUCTO DEL CARRITO
// -------------------------------------------------------
async function eliminarDelCarrito(idProducto) {
  // Quitamos el producto del arreglo local
  carritoActual.productos = carritoActual.productos.filter(p => p.productId !== idProducto);

  // Si ya no quedan productos, mostramos mensaje vacío
  if (carritoActual.productos.length === 0) {
    contenido.innerHTML = `
      <h2>Carrito</h2>
      <p>El carrito está vacío 🛒</p>
    `;
  }

  // Actualizamos la API (PUT sin el producto eliminado)
  const actualizado = {
    userId: 1,
    date: new Date().toISOString().split("T")[0],
    products: carritoActual.productos
  };

  await fetch(`https://fakestoreapi.com/carts/${carritoActual.id}`, {
    method: "PUT",
    body: JSON.stringify(actualizado),
    headers: { "Content-Type": "application/json" }
  });

  // Volvemos a mostrar el carrito actualizado
  menuCarrito.click();
}
