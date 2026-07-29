$(function () {
  const $formulario = $("#loginForm");
  const $alertas = $("#alert-container");

  $formulario.on("submit", function (evento) {
    evento.preventDefault();

    const email = String($("#email").val()).trim().toLowerCase();
    const password = String($("#password").val());

    if (!iniciarSesion(email, password)) {
      mostrarAlerta($alertas, "Correo o contraseña incorrectos.", "danger");
      $("#password").val("").trigger("focus");
      return;
    }

    mostrarAlerta($alertas, "Inicio de sesión exitoso. Redirigiendo...", "success");
    setTimeout(function () {
      window.location.href = "menu.html";
    }, 900);
  });
});
