// ============================================
// INICIO DE SESIÓN
// ============================================

$(function () {
  const $formulario = $("#loginForm");
  const $alertas = $("#alert-container");

  const mostrarAlerta = (mensaje, tipo = "info") => {
    $alertas.html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  // Función para limpiar y enfocar el campo de contraseña
  const resetearPassword = () => {
    $("#password").val("").focus();
  };

  // Función para redirigir al menú
  const irAlMenu = () => {
    window.location.href = "menu.html";
  };

  $formulario.on("submit", function (evento) {
    evento.preventDefault();

    const email = $("#email").val().trim().toLowerCase();
    const password = $("#password").val();

    // Validar campos
    if (!email || !password) {
      mostrarAlerta("Completa todos los campos.", "danger");
      return;
    }

    // Intentar iniciar sesión
    const exito = billetera.login({ email, password });

    if (exito) {
      mostrarAlerta("¡Bienvenido! Redirigiendo...", "success");
      setTimeout(irAlMenu, 900);
    } else {
      mostrarAlerta("Correo o contraseña incorrectos.", "danger");
      resetearPassword();
    }
  });
});
