protegerSesion();

$(function () {
  $("#saldo-menu").text(formatearDinero(obtenerSaldo()));

  $(".menu-action").on("click", function () {
    const $boton = $(this);
    const nombre = $boton.data("nombre");
    const ruta = $boton.data("ruta");

    $(".menu-action").prop("disabled", true);
    mostrarAlerta($("#menu-alert"), "Redirigiendo a " + nombre + "...", "info");

    setTimeout(function () {
      window.location.href = ruta;
    }, 700);
  });

  $("#btn-logout").on("click", function () {
    cerrarSesion();
    window.location.href = "login.html";
  });
});
