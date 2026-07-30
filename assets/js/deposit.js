// ============================================
// DEPÓSITOS
// ============================================

$(function () {
  // Verificar sesión
  const usuario = billetera.getCurrentUser();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Referencias a elementos
  const $formulario = $("#deposit-form");
  const $monto = $("#monto-deposito");
  const $alertas = $("#alert-container");
  const $saldo = $("#saldo-deposito");
  const $leyenda = $("#leyenda-deposito");

  // Mostrar mensajes
  const mostrarAlerta = (mensaje, tipo = "info") => {
    $alertas.html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  // Actualizar saldo
  const actualizarSaldo = () => {
    $saldo.text(billetera.formatMoney(billetera.getSaldo(usuario.email)));
  };

  // Limpiar montos rápidos
  const limpiarMontosRapidos = () => {
    $(".monto-rapido")
      .removeClass("btn-primary")
      .addClass("btn-outline-primary");
  };

  // Inicializar
  actualizarSaldo();

  // Montos rápidos
  $(".monto-rapido").on("click", function () {
    $monto.val($(this).data("monto")).focus();
    limpiarMontosRapidos();
    $(this).removeClass("btn-outline-primary").addClass("btn-primary");
  });

  // Realizar depósito
  $formulario.on("submit", function (evento) {
    evento.preventDefault();

    const monto = Number($monto.val());

    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlerta("Ingresa un monto entero mayor a cero.", "danger");
      $monto.focus();
      return;
    }

    try {
      const nuevoSaldo = billetera.depositar(usuario.email, monto);
      actualizarSaldo();
      $monto.val("");
      $leyenda
        .text(
          `✅ Depósito de ${billetera.formatMoney(monto)} realizado con éxito`,
        )
        .removeClass("d-none");
      limpiarMontosRapidos();
      mostrarAlerta(
        `Depósito exitoso. Nuevo saldo: ${billetera.formatMoney(nuevoSaldo)}`,
        "success",
      );

      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    } catch (error) {
      mostrarAlerta(error.message || "Error al realizar el depósito", "danger");
    }
  });
});
