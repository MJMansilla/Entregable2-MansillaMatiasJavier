document.addEventListener("DOMContentLoaded", () => {
  // Carga de datos remotos desde el archivo JSON
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productos = [];

  // Actualiza el localStorage
  function updateLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderCarrito() {
    const cartContent = document.querySelector("#cartContent");
    if (carrito.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      let html = "<ul>";
      carrito.forEach((item) => {
        html += `<li>${item.cantidad} x ${item.nombre} (Precio unitario: $${item.precio})</li>`;
      });
      html += "</ul>";
      cartContent.innerHTML = html;
    }
  }

  // Calcula total
  function calcularTotal() {
    let total = carrito.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    document.querySelector(
      "#totalDisplay"
    ).innerHTML = `<h3>Total: $${total}</h3>`;
    return total;
  }

  // Carga de productos
  async function loadProducts() {
    try {
      const response = await fetch("products.json");
      productos = await response.json();

      const cardsContainer = document.querySelector("#cardsContainer");
      cardsContainer.innerHTML = "";

      productos.forEach((producto) => {
        // Crear Card
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-instrumento", producto.instrumento);

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        card.appendChild(img);

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;
        cardContent.appendChild(titulo);

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;
        cardContent.appendChild(descripcion);

        const precio = document.createElement("p");
        precio.classList.add("price");
        precio.textContent = `$${producto.precio} USD`;
        cardContent.appendChild(precio);

        // Input cantidad
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "1";
        inputCantidad.placeholder = "Cantidad";
        inputCantidad.classList.add("cantidad-input");
        cardContent.appendChild(inputCantidad);

        // Botón para agregar el producto al carrito
        const btnAgregar = document.createElement("button");
        btnAgregar.classList.add("btnAgregar");
        btnAgregar.textContent = "Agregar al Carrito";
        cardContent.appendChild(btnAgregar);

        card.appendChild(cardContent);
        cardsContainer.appendChild(card);

        btnAgregar.addEventListener("click", () => {
          const cantidad = parseInt(inputCantidad.value);
          if (!cantidad || cantidad <= 0) {
            Swal.fire({
              icon: "error",
              title: "Cantidad inválida",
              text: `Por favor, ingresa una cantidad válida para ${producto.nombre}.`,
            });
            return;
          }

          // Si el producto ya existe en el carrito, actualiza la cantidad
          const itemExistente = carrito.find(
            (item) => item.instrumento === producto.instrumento
          );
          if (itemExistente) {
            itemExistente.cantidad += cantidad;
          } else {
            carrito.push({ ...producto, cantidad });
          }

          updateLocalStorage();
          renderCarrito();

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `${cantidad} unidad(es) de ${producto.nombre} agregadas al carrito.`,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });

          // Limpia el input
          inputCantidad.value = "";
        });
      });
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos. Verifica el archivo products.json.",
      });
    }
  }

  // Carga inicial de productos
  loadProducts();

  //Calcular el total
  const btnCalcular = document.querySelector("#btnCalcular");
  btnCalcular.addEventListener("click", () => {
    const total = calcularTotal();
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "info",
      title: `Total: $${total}`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  });

  //Vaciar el carrito
  const btnVaciar = document.querySelector("#btnVaciar");
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    updateLocalStorage();
    renderCarrito();
    document.querySelector("#totalDisplay").innerHTML = "";
    Swal.fire({
      icon: "info",
      title: "Carrito vaciado",
      text: "El carrito ha sido vaciado.",
      timer: 1500,
      showConfirmButton: false,
    });
  });

  //Confirmar la compra
  const btnConfirmar = document.querySelector("#btnConfirmar");
  btnConfirmar.addEventListener("click", async () => {
    const total = calcularTotal();
    if (total === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "No hay productos en el carrito para confirmar la compra.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirmar compra",
      text: `El total es $${total}. ¿Deseas confirmar tu compra?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      carrito = [];
      updateLocalStorage();
      renderCarrito();
      document.querySelector("#totalDisplay").innerHTML = "";
      Swal.fire({
        icon: "success",
        title: "Compra realizada",
        text: "¡Compra realizada con éxito!",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Compra cancelada",
        text: "La compra ha sido cancelada.",
      });
    }
  });
  renderCarrito();
});
