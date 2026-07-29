protegerSesion();

$(function () {
  const $formulario = $("#deposit-form");
  const $monto = $("#monto-deposito");
  const $alertas = $("#alert-container");

  function actualizarSaldo() {
    $("#saldo-deposito").text(formatearDinero(obtenerSaldo()));
  }

  $formulario.on("submit", function (evento) {
    evento.preventDefault();
    const monto = Number($monto.val());

    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlerta($alertas, "Ingresa un monto entero mayor a cero.", "danger");
      return;
    }

    const nuevoSaldo = depositarDinero(monto);
    actualizarSaldo();
    $monto.val("");
    $("#leyenda-deposito")
      .text("Monto depositado: " + formatearDinero(monto))
      .removeClass("d-none");
    mostrarAlerta(
      $alertas,
      "Depósito realizado. Nuevo saldo: " + formatearDinero(nuevoSaldo) + ".",
      "success",
    );

    setTimeout(function () {
      window.location.href = "menu.html";
    }, 2000);
  });

  actualizarSaldo();
});
