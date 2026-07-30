// ============================================
// REGISTRO DE USUARIOS
// ============================================

$(function () {
  const $formulario = $("#registerForm");
  const $alertas = $("#alert-container");

  const mostrarAlerta = (mensaje, tipo = "success") => {
    $alertas.html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  const redirigir = (ruta, delay = 900) => {
    setTimeout(() => (window.location.href = ruta), delay);
  };

  $formulario.on("submit", function (evento) {
    evento.preventDefault();

    const nombre = $("#name").val().trim();
    const email = $("#email").val().trim().toLowerCase();
    const password = $("#password").val();
    const confirmarPassword = $("#confirmPassword").val();

    // Validar campos obligatorios
    if (!nombre || !email || !password || !confirmarPassword) {
      mostrarAlerta("Completa todos los campos.", "danger");
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      mostrarAlerta(
        "La contraseña debe tener al menos 6 caracteres.",
        "danger",
      );
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
      mostrarAlerta("Las contraseñas no coinciden.", "danger");
      return;
    }

    try {
      billetera.register({ name: nombre, email, password });
      mostrarAlerta("¡Cuenta creada exitosamente! Redirigiendo...", "success");
      redirigir("menu.html");
    } catch (error) {
      mostrarAlerta(error.message || "Error al crear la cuenta", "danger");
    }
  });
});
