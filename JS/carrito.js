document.addEventListener("DOMContentLoaded", () => {
  // Recuperar el carrito desde localStorage o crearlo vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const precios = {
    guitarra: 1500,
    piano: 5000,
    bateria: 3000,
    violin: 2000,
    flauta: 800,
    saxofon: 2500,
    ukelele: 1200,
    bajo: 1800,
  };

  // Función para actualizar el localStorage
  function updateLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Función para renderizar el carrito en el DOM
  function renderCarrito() {
    const cartContent = document.getElementById("cartContent");
    if (carrito.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      let html = "<ul>";
      carrito.forEach((item) => {
        html += `<li>${item.cantidad} x ${item.instrumento} (Precio $${
          precios[item.instrumento]
        })</li>`;
      });
      html += "</ul>";
      cartContent.innerHTML = html;
    }
  }

  // Función para calcular y mostrar el total en el DOM
  function calcularTotal() {
    let total = 0;
    carrito.forEach((item) => {
      total += precios[item.instrumento] * item.cantidad;
    });
    document.getElementById(
      "totalDisplay"
    ).innerHTML = `<h3>Total: $${total}</h3>`;
    return total;
  }

  // Manejador para agregar un producto al carrito desde las cards
  const btnsAgregar = document.querySelectorAll(".btnAgregar");
  btnsAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Se identifica la card padre y se obtiene el instrumento a agregar
      const card = btn.closest(".card");
      const instrumento = card.getAttribute("data-instrumento");

      // Se obtiene la cantidad elegida en la tarjeta
      const cantidadInput = card.querySelector(".cantidad-input");
      const cantidad = parseInt(cantidadInput.value);

      const messageDiv = document.getElementById("message");

      // Validación de cantidad
      if (!cantidad || cantidad <= 0) {
        messageDiv.textContent =
          "Por favor, ingresa una cantidad válida para " + instrumento + ".";
        return;
      }

      // Agregar la compra al carrito
      carrito.push({ instrumento, cantidad });
      updateLocalStorage();
      renderCarrito();
      messageDiv.textContent = `Se agregaron ${cantidad} unidades de ${instrumento} al carrito.`;

      // Limpiar el input de cantidad
      cantidadInput.value = "";
    });
  });

  // Boton para calcular el total
  const btnCalcular = document.getElementById("btnCalcular");
  btnCalcular.addEventListener("click", () => {
    calcularTotal();
  });

  //Boton para vaciar el carrito
  const btnVaciar = document.getElementById("btnVaciar");
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    updateLocalStorage();
    renderCarrito();
    document.getElementById("totalDisplay").innerHTML = "";
    document.getElementById("message").textContent =
      "El carrito ha sido vaciado.";
  });

  // Boton para confirmar la compra
  const btnConfirmar = document.getElementById("btnConfirmar");
  btnConfirmar.addEventListener("click", () => {
    const total = calcularTotal();
    const messageDiv = document.getElementById("message");

    if (total === 0) {
      messageDiv.textContent =
        "No hay productos en el carrito para confirmar la compra.";
      return;
    }

    //Confirmación de la compra usando el DOM
    const confirmacion = document.createElement("div");
    confirmacion.innerHTML = `
      <p>El total es $${total}. ¿Deseas confirmar tu compra?</p>
      <button id="btnSi">Sí</button>
      <button id="btnNo">No</button>
    `;
    messageDiv.innerHTML = "";
    messageDiv.appendChild(confirmacion);

    document.getElementById("btnSi").addEventListener("click", () => {
      messageDiv.textContent = "¡Compra realizada con éxito!";
      carrito = [];
      updateLocalStorage();
      renderCarrito();
      document.getElementById("totalDisplay").innerHTML = "";
    });

    document.getElementById("btnNo").addEventListener("click", () => {
      messageDiv.textContent = "Compra cancelada.";
      confirmacion.remove();
    });
  });

  // Renderiza el carrito al cargar la página
  renderCarrito();
});
