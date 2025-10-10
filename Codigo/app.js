// app.js

// -------------------------
// 🔹 VARIABLES GLOBALES
// -------------------------

const contenido = document.getElementById("contenido");
const menuProductos = document.getElementById("menu-productos");
const menuCarrito = document.getElementById("menu-carrito");

// Este objeto representará nuestro carrito actual
let carritoActual = {
  id: null, // cuando lo creemos en la API, aquí guardaremos su id
  productos: [] // almacenará los productos agregados
};


// -------------------------
// 🔹 MOSTRAR LISTA DE PRODUCTOS
// -------------------------
menuProductos.addEventListener("click", async () => {
  contenido.innerHTML = "<h2>Cargando productos...</h2>";

  try {
    // Hacemos la petición a la API para obtener todos los productos
    const res = await fetch("https://fakestoreapi.com/products");
    const productos = await res.json();

    // Insertamos dinámicamente las tarjetas de los productos
    contenido.innerHTML = `
      <h2>Productos disponibles</h2>
      <div class="grid">
        ${productos.map(p => `
          <div class="producto">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>$${p.price}</p>
            <!-- Botón que agrega el producto al carrito -->
            <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
          </div>
        `).join('')}
      </div>
    `;

  } catch (error) {
    contenido.innerHTML = "<p>Error al cargar productos 😢</p>";
    console.error("Error:", error);
  }
});


// -------------------------
// 🔹 FUNCIÓN: CREAR CARRITO NUEVO
// -------------------------
async function crearCarrito() {
  // Según la documentación de FakeStoreAPI, podemos crear un carrito así:
  // POST /carts con campos: userId, date y products (array)
  const nuevoCarrito = {
    userId: 1, // usuario genérico de prueba
    date: new Date().toISOString().split("T")[0], // fecha actual en formato yyyy-mm-dd
    products: [] // empezamos vacío
  };

  const res = await fetch("https://fakestoreapi.com/carts", {
    method: "POST",
    body: JSON.stringify(nuevoCarrito),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();

  // Guardamos el ID del carrito creado en la variable global
  carritoActual.id = data.id;
  carritoActual.productos = [];

  console.log("🛒 Carrito creado:", data);
}


// -------------------------
// 🔹 FUNCIÓN: AGREGAR PRODUCTO AL CARRITO
// -------------------------
async function agregarAlCarrito(idProducto) {
  // Si aún no existe carrito, lo creamos primero
  if (!carritoActual.id) {
    await crearCarrito();
  }

  // Verificamos si el producto ya estaba en el carrito
  const productoExistente = carritoActual.productos.find(p => p.productId === idProducto);

  if (productoExistente) {
    // Si ya existe, aumentamos su cantidad
    productoExistente.quantity += 1;
  } else {
    // Si no existe, lo agregamos como nuevo
    carritoActual.productos.push({ productId: idProducto, quantity: 1 });
  }

  // Ahora actualizamos el carrito en la API con un PUT
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

  alert(`Producto ${idProducto} agregado al carrito 🛒`);
}


// -------------------------
// 🔹 MOSTRAR CARRITO
// -------------------------
menuCarrito.addEventListener("click", async () => {
  // Si el carrito aún no existe, mostramos un mensaje
  if (!carritoActual.id) {
    contenido.innerHTML = `
      <h2>Carrito</h2>
      <p>No tienes productos en el carrito todavía.</p>
    `;
    return;
  }

  // Si existe, mostramos los productos agregados
  contenido.innerHTML = `
    <h2>Tu carrito</h2>
    <ul>
      ${carritoActual.productos.map(p => `
        <li>🛍️ Producto ID: ${p.productId} — Cantidad: ${p.quantity}</li>
      `).join('')}
    </ul>
  `;
});

