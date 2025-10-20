// Subcódigos en js/ui.js
import { obtenerProductos, obtenerProductosPorCategoria } from "./api.js";
import { escapeHtml, truncate } from "./helpers.js";
import { agregarAlCarrito } from "./carrito.js";

// ----------------------------------------------------
// Función auxiliar para obtener contenedor
// ----------------------------------------------------
function getContenido() {
  return document.getElementById("contenido");
}

// ----------------------------------------------------
// Mostrar Productos
// ----------------------------------------------------
export async function mostrarProductos(categoria = "todos") {
  const contenido = getContenido();
  if (!contenido) return;

  // Limpiar contenido previo
  contenido.textContent = "";

  // Mensaje de carga
  const cargando = document.createElement("h2");
  cargando.textContent = "Cargando productos...";
  contenido.appendChild(cargando);

  try {
    const productos =
      categoria === "todos"
        ? await obtenerProductos()
        : await obtenerProductosPorCategoria(categoria);

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    contenido.textContent = ""; // limpiar el mensaje de carga

    const seccion = document.createElement("section");
    seccion.classList.add("productos");

    // Título
    const titulo = document.createElement("h2");
    titulo.textContent =
      categoria === "todos"
        ? "Todos los productos"
        : categoria === "men's clothing"
        ? "Ropa para Hombre"
        : categoria === "women's clothing"
        ? "Ropa para Mujer"
        : categoria === "electronics"
        ? "Tecnología"
        : categoria === "jewelery"
        ? "Joyería"
        : categoria;
    seccion.appendChild(titulo);

    // Buscador
    const buscador = document.createElement("input");
    buscador.type = "text";
    buscador.placeholder = "Buscar producto...";
    buscador.classList.add("buscador");
    seccion.appendChild(buscador);

    // Contenedor de productos
    const grid = document.createElement("div");
    grid.classList.add("grid-productos");

    productos.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("card-producto");

      const img = document.createElement("img");
      img.src = p.image;
      img.alt = escapeHtml(p.title);

      const tituloProd = document.createElement("h4");
      tituloProd.textContent = truncate(p.title, 70);
      tituloProd.addEventListener("click", () => mostrarDetalleProducto(p.id));

      const precio = document.createElement("p");
      precio.textContent = `$${p.price}`;

      const acciones = document.createElement("div");
      acciones.classList.add("acciones-producto");

      const btnCarrito = document.createElement("button");
      btnCarrito.classList.add("btn-agregar");
      btnCarrito.textContent = "Agregar al carrito";
      btnCarrito.addEventListener("click", () =>
        agregarAlCarrito(parseInt(p.id))
      );

      const btnFavorito = document.createElement("button");
      btnFavorito.classList.add("btn-favorito");
      btnFavorito.textContent = favoritos.includes(p.id) ? "❤️" : "🤍";

      btnFavorito.addEventListener("click", () => {
        const id = parseInt(p.id);
        if (favoritos.includes(id)) {
          favoritos = favoritos.filter((f) => f !== id);
        } else {
          favoritos.push(id);
        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        btnFavorito.textContent = favoritos.includes(id) ? "❤️" : "🤍";
      });

      acciones.appendChild(btnCarrito);
      acciones.appendChild(btnFavorito);

      card.appendChild(img);
      card.appendChild(tituloProd);
      card.appendChild(precio);
      card.appendChild(acciones);
      grid.appendChild(card);
    });

    seccion.appendChild(grid);
    contenido.appendChild(seccion);

    // Filtro por texto
    buscador.addEventListener("input", (e) => {
      const valor = e.target.value.toLowerCase();
      document.querySelectorAll(".card-producto").forEach((card) => {
        const titulo = card.querySelector("h4").textContent.toLowerCase();
        card.style.display = titulo.includes(valor) ? "block" : "none";
      });
    });
  } catch (error) {
    console.error("Error cargando productos:", error);
    contenido.textContent = "Error al cargar productos.";
  }
}

// ----------------------------------------------------
// HOME
// ----------------------------------------------------
export function mostrarHome() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const seccion = document.createElement("section");
  seccion.classList.add("home");

  const h1 = document.createElement("h1");
  h1.textContent = "Bienvenido a Mi Tienda Online";
  const p = document.createElement("p");
  p.textContent =
    "Explora nuestras categorías o mira todos los productos disponibles.";
  const btnVerTodo = document.createElement("button");
  btnVerTodo.id = "ver-todo";
  btnVerTodo.classList.add("btn-ver-todo");
  btnVerTodo.textContent = "Ver todos los productos";

  const grid = document.createElement("div");
  grid.classList.add("grid", "categorias-home");

  const categorias = [
    {
      cat: "men's clothing",
      img: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      titulo: "Ropa masculina",
    },
    {
      cat: "women's clothing",
      img: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      titulo: "Ropa femenina",
    },
    {
      cat: "electronics",
      img: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
      titulo: "Tecnología",
    },
    {
      cat: "jewelery",
      img: "https://fakestoreapi.com/img/71yaIMZ+XFL._AC_UL640_QL65_ML3_.jpg",
      titulo: "Joyería",
    },
  ];

  categorias.forEach((c) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.cat = c.cat;

    const img = document.createElement("img");
    img.src = c.img;
    img.alt = c.titulo;

    const h3 = document.createElement("h3");
    h3.textContent = c.titulo;

    card.appendChild(img);
    card.appendChild(h3);
    card.addEventListener("click", () => mostrarProductos(c.cat));

    grid.appendChild(card);
  });

  seccion.appendChild(h1);
  seccion.appendChild(p);
  seccion.appendChild(btnVerTodo);
  seccion.appendChild(grid);
  contenido.appendChild(seccion);

  btnVerTodo.addEventListener("click", () => mostrarProductos("todos"));
  mostrarProductos("todos");
}

// ----------------------------------------------------
// Formularios de usuario (creados por DOM)
// ----------------------------------------------------
export function mostrarLogin() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const seccion = document.createElement("section");
  seccion.classList.add("login");

  const h2 = document.createElement("h2");
  h2.textContent = "Iniciar Sesión";

  const form = document.createElement("form");
  form.classList.add("formulario");

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.placeholder = "Correo electrónico";
  inputEmail.required = true;

  const inputPass = document.createElement("input");
  inputPass.type = "password";
  inputPass.placeholder = "Contraseña";
  inputPass.required = true;

  const btn = document.createElement("button");
  btn.type = "submit";
  btn.classList.add("btn-agregar");
  btn.textContent = "Ingresar";

  form.append(inputEmail, inputPass, btn);
  seccion.append(h2, form);
  contenido.appendChild(seccion);
}

export function mostrarRegistro() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const seccion = document.createElement("section");
  seccion.classList.add("registro");

  const h2 = document.createElement("h2");
  h2.textContent = "Registrarse";

  const form = document.createElement("form");
  form.classList.add("formulario");

  const inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.placeholder = "Nombre completo";
  inputNombre.required = true;

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.placeholder = "Correo electrónico";
  inputEmail.required = true;

  const inputPass = document.createElement("input");
  inputPass.type = "password";
  inputPass.placeholder = "Contraseña";
  inputPass.required = true;

  const btn = document.createElement("button");
  btn.type = "submit";
  btn.classList.add("btn-agregar");
  btn.textContent = "Crear cuenta";

  form.append(inputNombre, inputEmail, inputPass, btn);
  seccion.append(h2, form);
  contenido.appendChild(seccion);
}

// ----------------------------------------------------
// Sección de Pago
// ----------------------------------------------------
export function mostrarPago(total = 0) {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const seccion = document.createElement("section");
  seccion.classList.add("pago");

  const h2 = document.createElement("h2");
  h2.textContent = "💳 Procesar Pago";

  const pTotal = document.createElement("p");
  pTotal.innerHTML = `Total a pagar: <b>$${total.toFixed(2)}</b>`;

  const form = document.createElement("form");
  form.classList.add("formulario");

  const campos = [
    { placeholder: "Nombre en la tarjeta" },
    { placeholder: "Número de tarjeta", maxlength: 16 },
    { placeholder: "Fecha de expiración (MM/AA)" },
    { placeholder: "CVV", maxlength: 3 },
  ];

  campos.forEach((campo) => {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = campo.placeholder;
    if (campo.maxlength) input.maxLength = campo.maxlength;
    input.required = true;
    form.appendChild(input);
  });

  const btn = document.createElement("button");
  btn.type = "submit";
  btn.classList.add("btn-agregar");
  btn.textContent = "Confirmar pago";

  form.appendChild(btn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Pago realizado con éxito. ¡Gracias por tu compra!");
    mostrarHome();
  });

  seccion.append(h2, pTotal, form);
  contenido.appendChild(seccion);
}

// ----------------------------------------------------
// Detalle de producto
// ----------------------------------------------------
export async function mostrarDetalleProducto(id) {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const p = await res.json();

  const seccion = document.createElement("section");
  seccion.classList.add("detalle");

  const img = document.createElement("img");
  img.src = p.image;
  img.alt = escapeHtml(p.title);

  const h2 = document.createElement("h2");
  h2.textContent = escapeHtml(p.title);

  const desc = document.createElement("p");
  desc.textContent = escapeHtml(p.description);

  const precio = document.createElement("p");
  precio.innerHTML = `<b>Precio:</b> $${p.price}`;

  const btn = document.createElement("button");
  btn.classList.add("btn-agregar");
  btn.textContent = "Agregar al carrito";
  btn.addEventListener("click", () => agregarAlCarrito(p.id));

  seccion.append(img, h2, desc, precio, btn);
  contenido.appendChild(seccion);
}

// ----------------------------------------------------
// Sección Informativa
// ----------------------------------------------------
export function mostrarInformativa() {
  const contenido = getContenido();
  if (!contenido) return;
  contenido.textContent = "";

  const seccion = document.createElement("section");
  seccion.classList.add("informativa");

  const header = document.createElement("div");
  header.classList.add("info-header");

  const img = document.createElement("img");
  img.src = "assets/Black and White Retro Y2K Streetwear Clothing Logo.png";
  img.alt = "Logo de Mi Tienda";
  img.classList.add("logo-img");

  const h2 = document.createElement("h2");
  h2.textContent = "Acerca de Mi Tienda Online";

  header.append(img, h2);
  seccion.appendChild(header);

  const grid = document.createElement("div");
  grid.classList.add("info-grid");

  const card1 = document.createElement("div");
  card1.classList.add("info-card");
  const h3_1 = document.createElement("h3");
  h3_1.textContent = "¿Qué es esta app?";
  const p1 = document.createElement("p");
  p1.innerHTML =
    "Una tienda en línea que utiliza la <b>FakeStore API</b> para mostrar productos reales, permitiéndote explorar, agregar al carrito y marcar tus favoritos.";
  card1.append(h3_1, p1);

  const card2 = document.createElement("div");
  card2.classList.add("info-card");
  const h3_2 = document.createElement("h3");
  h3_2.textContent = "Funcionalidades";
  const ul = document.createElement("ul");
  [
    "Secciones separadas por categorías",
    "Carrito funcional conectado a la API",
    "Sistema de favoritos persistente",
    "Inicio de sesión y registro",
  ].forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
  card2.append(h3_2, ul);

  const card3 = document.createElement("div");
  card3.classList.add("info-card");
  const h3_3 = document.createElement("h3");
  h3_3.textContent = "Propósito";
  const p3 = document.createElement("p");
  p3.textContent =
    "Proyecto realizado para la clase de desarrollo de aplicaciones móviles, demostrando el uso de APIs en desarrollo web y Android Studio.";
  card3.append(h3_3, p3);

  grid.append(card1, card2, card3);
  seccion.appendChild(grid);

  const footer = document.createElement("div");
  footer.classList.add("info-footer");
  const pFooter = document.createElement("p");
  pFooter.textContent = "Datos generados en tiempo real desde la API.";
  footer.appendChild(pFooter);
  seccion.appendChild(footer);

  contenido.appendChild(seccion);
}
