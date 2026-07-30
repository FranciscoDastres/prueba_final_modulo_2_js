// ENVIAR DINERO
$(function () {
  // Verificar sesión
  const usuario = billetera.getCurrentUser();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Elementos DOM
  const $lista = $("#lista-contactos");
  const $btnEnviar = $("#btn-enviar-dinero");
  const $busqueda = $("#search-input");
  const $saldo = $("#saldo-envio");
  const $alerta = $("#send-alert");
  const $formContacto = $("#contact-form");
  const $formTransferencia = $("#transfer-form");
  const $monto = $("#monto-envio");

  // Modales
  const modalContacto = new bootstrap.Modal(
    document.getElementById("contact-modal"),
  );
  const modalTransferencia = new bootstrap.Modal(
    document.getElementById("transfer-modal"),
  );

  // Estado
  let contactos = [];
  let contactoSeleccionado = null;

  // Mostrar mensajes
  const mostrarAlerta = (selector, mensaje, tipo = "info") => {
    $(selector).html(`<div class="alert alert-${tipo}">${mensaje}</div>`);
  };

  // Actualizar saldo
  const actualizarSaldo = () => {
    const saldo = billetera.getSaldo(usuario.email);
    $saldo.text(billetera.formatMoney(saldo));
    $monto.attr("max", saldo);
  };

  // Limpiar selección de contacto
  const limpiarSeleccion = () => {
    contactoSeleccionado = null;
    $(".contact-item").removeClass("active");
    $btnEnviar.addClass("d-none").prop("disabled", true);
  };

  // Colores para avatares
  const coloresAvatar = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
  ];

  // Obtener color según nombre
  const obtenerColor = (nombre) => {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return coloresAvatar[Math.abs(hash) % coloresAvatar.length];
  };

  // Obtener iniciales
  const obtenerIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Renderizar contactos
  const renderizarContactos = (termino = "") => {
    const texto = termino.trim().toLowerCase();
    contactos = billetera.getContacts(usuario.email);
    $lista.empty();

    if (contactos.length === 0) {
      $lista.html(`
        <div class="text-center p-5">
          <p class="text-muted">No tienes contactos guardados</p>
          <button class="btn btn-success btn-sm" onclick="$('#btn-agregar-contacto').click()">
            + Agregar contacto
          </button>
        </div>
      `);
      return;
    }

    const resultados = texto
      ? contactos.filter(
          (c) =>
            c.nombre.toLowerCase().includes(texto) ||
            c.alias.toLowerCase().includes(texto),
        )
      : contactos;

    if (resultados.length === 0) {
      $lista.html(
        `<p class="text-center text-muted p-3">No hay coincidencias con "${texto}"</p>`,
      );
      return;
    }

    resultados.forEach((c) => {
      const color = obtenerColor(c.nombre);
      const iniciales = obtenerIniciales(c.nombre);

      const $item = $(`
        <div class="list-group-item contact-item p-3" data-id="${c.id}">
          <div class="d-flex align-items-center">
            <div class="contact-avatar me-3" style="background: ${color};">${iniciales}</div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 fw-bold">${c.nombre}</h6>
                <span class="badge bg-primary">****${c.cbu.slice(-4)}</span>
              </div>
              <small class="text-secondary">🏦 ${c.banco} · @${c.alias}</small>
            </div>
          </div>
        </div>
      `);

      $item.on("click", function () {
        $(".contact-item").removeClass("active");
        $(this).addClass("active");
        contactoSeleccionado = c;
        $btnEnviar.removeClass("d-none").prop("disabled", false);
      });

      $lista.append($item);
    });
  };

  // Buscar contactos
  $("#search-form").on("submit", (e) => {
    e.preventDefault();
    renderizarContactos($busqueda.val());
  });

  $busqueda.on("input", () => renderizarContactos($busqueda.val()));

  // Agregar contacto
  const limpiarFormularioContacto = () => {
    $formContacto[0].reset();
    $formContacto.removeClass("was-validated");
    $("#contact-alert").empty();
  };

  $("#btn-agregar-contacto").on("click", () => {
    limpiarFormularioContacto();
    modalContacto.show();
  });

  $formContacto.on("submit", function (e) {
    e.preventDefault();

    const cbu = $("#cbu-contacto").val().trim();
    if (!/^\d{12}$/.test(cbu)) {
      mostrarAlerta(
        "#contact-alert",
        "El número de cuenta debe tener 12 dígitos.",
        "danger",
      );
      return;
    }

    if (!this.checkValidity()) {
      $(this).addClass("was-validated");
      return;
    }

    try {
      const nuevo = billetera.addContact(usuario.email, {
        nombre: $("#nombre-contacto").val().trim(),
        cbu,
        alias: $("#alias-contacto").val().trim(),
        banco: $("#banco-contacto").val(),
      });

      modalContacto.hide();
      $busqueda.val("");
      renderizarContactos();
      mostrarAlerta(
        "#send-alert",
        `✅ Contacto ${nuevo.nombre} agregado`,
        "success",
      );
    } catch (error) {
      mostrarAlerta("#contact-alert", error.message, "danger");
    }
  });

  // Transferir
  const prepararTransferencia = () => {
    if (!contactoSeleccionado) return;

    $("#transfer-details").html(`
      <div class="p-3 bg-light rounded">
        <strong>${contactoSeleccionado.nombre}</strong>
        <div class="text-secondary">${contactoSeleccionado.banco} · @${contactoSeleccionado.alias}</div>
        <small>CBU: ${contactoSeleccionado.cbu}</small>
      </div>
    `);

    $formTransferencia[0].reset();
    $formTransferencia.removeClass("was-validated");
    $("#transfer-alert").empty();
    actualizarSaldo();
    modalTransferencia.show();
  };

  $btnEnviar.on("click", prepararTransferencia);

  $formTransferencia.on("submit", function (e) {
    e.preventDefault();

    const monto = Number($monto.val());
    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlerta(
        "#transfer-alert",
        "Ingresa un monto mayor a cero.",
        "danger",
      );
      return;
    }

    try {
      billetera.transferir(usuario.email, monto, contactoSeleccionado);
      modalTransferencia.hide();
      actualizarSaldo();
      renderizarContactos($busqueda.val());
      mostrarAlerta(
        "#send-alert",
        `✅ Envío de ${billetera.formatMoney(monto)} a ${contactoSeleccionado.nombre} exitoso`,
        "success",
      );
    } catch (error) {
      mostrarAlerta("#transfer-alert", error.message, "danger");
    }
  });

  // Inicializar
  actualizarSaldo();
  renderizarContactos();
});
