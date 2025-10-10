// Subcodigos en js/api.js

export async function obtenerProductos() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Error obteniendo productos");
  return await res.json();
}

export async function obtenerProductosPorCategoria(categoria) {
  const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(categoria)}`);
  if (!res.ok) throw new Error("Error obteniendo productos por categoría");
  return await res.json();
}

export async function crearCarritoAPI() {
  const res = await fetch("https://fakestoreapi.com/carts", {
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
}

export async function actualizarCarritoAPI(id, productos) {
  const res = await fetch(`https://fakestoreapi.com/carts/${id}`, {
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
}
