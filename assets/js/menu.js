// ============================================
// MENÚ PRINCIPAL
// ============================================

$(function () {
  // Verificar sesión
  const usuario = billetera.getCurrentUser();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Elementos DOM
  const $saldo = $("#saldo-menu");
  const $alertas = $("#menu-alert");
  const $botonesAccion = $(".menu-action");
  const $btnCerrarSesion = $("#btn-logout");

  // Mostrar mensajes
  const mostrarAlerta = (mensaje, tipo = "info") => {
    $alertas.html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  const mostrarAlertaEnModal = (selector, mensaje, tipo = "info") => {
    $(selector).html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  // Actualizar saldo
  const actualizarSaldo = () => {
    $saldo.text(billetera.formatMoney(billetera.getSaldo(usuario.email)));
  };

  // Redirigir después de acción
  const redirigir = (ruta, delay = 700) => {
    setTimeout(() => (window.location.href = ruta), delay);
  };

  // Inicializar
  actualizarSaldo();

  // ==========================================
  // BOTONES DEL MENÚ (Depositar, Enviar, Movimientos)
  // ==========================================

  $botonesAccion.on("click", function () {
    const $boton = $(this);
    const nombre = $boton.data("nombre");
    const ruta = $boton.data("ruta");

    if (!ruta) return;

    $botonesAccion.prop("disabled", true);
    mostrarAlerta(`Redirigiendo a ${nombre}...`, "info");
    redirigir(ruta);
  });

  // ==========================================
  // RECIBIR DINERO
  // ==========================================

  const modalRecibir = new bootstrap.Modal(
    document.getElementById("receive-modal"),
  );

  $("#btn-recibir").on("click", () => modalRecibir.show());

  $("#receive-form").on("submit", function (e) {
    e.preventDefault();

    const monto = Number($("#monto-recibir").val());
    const remitente = $("#desde-recibir").val().trim() || "Usuario externo";

    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlertaEnModal(
        "#receive-alert",
        "Ingresa un monto mayor a cero.",
        "danger",
      );
      return;
    }

    try {
      billetera.recibirFondos(usuario.email, monto, remitente);
      actualizarSaldo();
      modalRecibir.hide();
      mostrarAlerta(
        `✅ Recibiste ${billetera.formatMoney(monto)} de ${remitente}`,
        "success",
      );
      $("#receive-form")[0].reset();
      $("#receive-alert").empty();
      redirigir("transactions.html", 2000);
    } catch (error) {
      mostrarAlertaEnModal("#receive-alert", error.message, "danger");
    }
  });

  // ==========================================
  // RETIRAR DINERO
  // ==========================================

  const modalRetirar = new bootstrap.Modal(
    document.getElementById("withdraw-modal"),
  );

  // Limpiar selección de montos rápidos
  const limpiarMontosRetiro = () => {
    $(".monto-retiro-rapido")
      .removeClass("btn-warning")
      .addClass("btn-outline-warning");
  };

  $("#btn-retirar").on("click", function () {
    $("#saldo-retiro-disponible").text(
      billetera.formatMoney(billetera.getSaldo(usuario.email)),
    );
    limpiarMontosRetiro();
    modalRetirar.show();
  });

  // Montos rápidos para retirar
  $(".monto-retiro-rapido").on("click", function () {
    const monto = $(this).data("monto");
    $("#monto-retirar").val(monto).focus();
    limpiarMontosRetiro();
    $(this).removeClass("btn-outline-warning").addClass("btn-warning");
  });

  $("#withdraw-form").on("submit", function (e) {
    e.preventDefault();

    const monto = Number($("#monto-retirar").val());
    const saldoActual = billetera.getSaldo(usuario.email);

    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlertaEnModal(
        "#withdraw-alert",
        "Ingresa un monto mayor a cero.",
        "danger",
      );
      return;
    }

    if (monto > saldoActual) {
      mostrarAlertaEnModal("#withdraw-alert", "Saldo insuficiente.", "danger");
      return;
    }

    try {
      billetera.setSaldo(usuario.email, saldoActual - monto);
      billetera.addTransaction(usuario.email, {
        tipo: "retiro",
        monto: monto,
        descripcion: `Retiro de ${billetera.formatMoney(monto)}`,
      });

      actualizarSaldo();
      modalRetirar.hide();
      mostrarAlerta(
        `✅ Retiro de ${billetera.formatMoney(monto)} realizado`,
        "success",
      );

      $("#withdraw-form")[0].reset();
      $("#withdraw-alert").empty();
      limpiarMontosRetiro();
      redirigir("transactions.html", 2000);
    } catch (error) {
      mostrarAlertaEnModal("#withdraw-alert", error.message, "danger");
    }
  });

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  $btnCerrarSesion.on("click", () => {
    billetera.logout();
    window.location.href = "login.html";
  });
});
