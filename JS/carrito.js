const carrito = [];
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
console.log("Precios disponibles: ", precios);

function agregarInstrumento() {
  let instrumento = prompt(
    `Ingresa un instrumento:
    guitarra, piano, bateria, violin, flauta, saxofon, ukulele, bajo`
  );
  if (precios[instrumento]) {
    let cantidad = prompt(
      `¿Cuántas unidades de ${instrumento} deseas agregar?`
    );
    if (cantidad > 0) {
      carrito.push({ instrumento, cantidad });
      alert(`Se agregaron ${cantidad} unidades de ${instrumento} al carrito.`);
    } else {
      alert("Cantidad no válida. Inténtalo nuevamente.");
    }
  } else {
    alert("Instrumento no válido. Inténtalo nuevamente.");
  }
}

function calcularTotal() {
  let total = 0;
  carrito.forEach((item) => {
    total += precios[item.instrumento] * item.cantidad;
  });
  console.log("Total calculado: $", total);
  alert(`El total de tu carrito es: $${total}.`);
  return total;
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
  } else {
    let mensaje = "Contenido del carrito:";
    carrito.forEach((item) => {
      mensaje += `- ${item.cantidad} x ${item.instrumento} (Precio unitario: $${
        precios[item.instrumento]
      })`;
    });
    alert(mensaje);
  }
}

function confirmarCompra() {
  let total = calcularTotal();
  let confirmar = confirm(
    `El total es $${total}. ¿Deseas confirmar tu compra?`
  );
  if (confirmar) {
    alert("¡Compra realizada con éxito!");
    carrito.length = 0;
  } else {
    console.log("Compra cancelada.");
    alert("Compra cancelada.");
  }
}

function iniciarSimulador() {
  let opcion;
  do {
    opcion = prompt(
      `Selecciona una opción:
      1. Agregar instrumento
      2. Ver total
      3. Ver carrito
      4. Confirmar compra
      5. Salir`
    );
    switch (opcion) {
      case "1":
        agregarInstrumento();
        break;
      case "2":
        calcularTotal();
        break;
      case "3":
        mostrarCarrito();
        break;
      case "4":
        confirmarCompra();
        break;
      case "5":
        alert("¡Gracias por usar el simulador de carrito de compras!");
        break;
      default:
        alert("Opción no válida. Inténtalo nuevamente.");
    }
  } while (opcion !== "5");
}

iniciarSimulador();
