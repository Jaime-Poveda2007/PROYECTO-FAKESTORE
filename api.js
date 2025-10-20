// Subcódigos en js/api.js

// 🔹 Proxy CORS para evitar bloqueos en Android WebView
const PROXY = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://fakestoreapi.com/";

// ----------------------------------------------------
// Obtener todos los productos
// ----------------------------------------------------
export async function obtenerProductos() {
  try {
    const res = await fetch(PROXY + encodeURIComponent(BASE_URL + "products"));
    if (!res.ok) throw new Error("Error obteniendo productos");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en obtenerProductos:", error);
    throw error;
  }
}

// ----------------------------------------------------
// Obtener productos por categoría
// ----------------------------------------------------
export async function obtenerProductosPorCategoria(categoria) {
  try {
    const res = await fetch(
      PROXY + encodeURIComponent(BASE_URL + "products/category/" + categoria)
    );
    if (!res.ok) throw new Error("Error obteniendo productos por categoría");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en obtenerProductosPorCategoria:", error);
    throw error;
  }
}

// ----------------------------------------------------
// Crear carrito en la API
// ----------------------------------------------------
export async function crearCarritoAPI() {
  try {
    const res = await fetch(PROXY + encodeURIComponent(BASE_URL + "carts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString().split("T")[0],
        products: []
      })
    });
    if (!res.ok) throw new Error("Error creando carrito");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en crearCarritoAPI:", error);
    throw error;
  }
}

// ----------------------------------------------------
// Actualizar carrito en la API
// ----------------------------------------------------
export async function actualizarCarritoAPI(id, productos) {
  try {
    const res = await fetch(PROXY + encodeURIComponent(BASE_URL + "carts/" + id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString().split("T")[0],
        products: productos
      })
    });
    if (!res.ok) throw new Error("Error actualizando carrito");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en actualizarCarritoAPI:", error);
    throw error;
  }
}
