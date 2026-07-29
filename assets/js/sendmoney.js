protegerSesion();

$(function () {
  const $lista = $("#lista-contactos");
  const $botonEnviar = $("#btn-enviar-dinero");
  const $busqueda = $("#search-input");
  const $formularioContacto = $("#contact-form");
  const $formularioTransferencia = $("#transfer-form");
  const $monto = $("#monto-envio");
  const modalContacto = bootstrap.Modal.getOrCreateInstance("#contact-modal");
  const modalTransferencia = bootstrap.Modal.getOrCreateInstance("#transfer-modal");

  let contactos = [];
  let contactoSeleccionado = null;

  function actualizarSaldo() {
    const saldo = obtenerSaldo();
    $("#saldo-envio").text(formatearDinero(saldo));
    $monto.attr("max", saldo);
  }

  function limpiarSeleccion() {
    contactoSeleccionado = null;
    $lista.find(".contact-item").removeClass("active");
    $botonEnviar.addClass("d-none").prop("disabled", true);
  }

  function crearContacto(contacto) {
    const $datos = $("<span>").append(
      $("<strong>").text(contacto.nombre),
      $("<small>").text(contacto.banco + " · " + contacto.alias),
    );
    const $cuenta = $("<span>", {
      class: "badge text-bg-primary",
      text: "•••• " + contacto.cbu.slice(-4),
    });

    return $("<button>", {
      type: "button",
      class: "list-group-item list-group-item-action contact-item",
    })
      .attr("data-id", contacto.id)
      .append($datos, $cuenta);
  }

  function renderizarContactos(termino = "") {
    const texto = termino.trim().toLowerCase();
    contactos = obtenerContactos();
    limpiarSeleccion();
    $lista.empty();

    const resultados = contactos.filter(function (contacto) {
      return (
        contacto.nombre.toLowerCase().includes(texto) ||
        contacto.alias.toLowerCase().includes(texto)
      );
    });

    if (resultados.length === 0) {
      $("<p>", {
        class: "empty-state",
        text: "No hay contactos que coincidan con la búsqueda.",
      }).appendTo($lista);
      return;
    }

    resultados.forEach(function (contacto) {
      $lista.append(crearContacto(contacto));
    });
  }

  $lista.on("click", ".contact-item", function () {
    const id = $(this).attr("data-id");
    contactoSeleccionado = contactos.find(function (contacto) {
      return contacto.id === id;
    });

    $lista.find(".contact-item").removeClass("active");
    $(this).addClass("active");
    $botonEnviar.removeClass("d-none").prop("disabled", false);
  });

  $("#search-form").on("submit", function (evento) {
    evento.preventDefault();
    renderizarContactos(String($busqueda.val()));
  });

  $busqueda.on("input", function () {
    renderizarContactos(String($(this).val()));
  });

  $("#btn-agregar-contacto").on("click", function () {
    $formularioContacto.trigger("reset").removeClass("was-validated");
    $("#contact-alert").empty();
    modalContacto.show();
  });

  $formularioContacto.on("submit", function (evento) {
    evento.preventDefault();

    if (!this.checkValidity()) {
      $formularioContacto.addClass("was-validated");
      return;
    }

    const nombre = String($("#nombre-contacto").val()).trim();
    const cbu = String($("#cbu-contacto").val()).trim();
    const alias = String($("#alias-contacto").val()).trim();
    const banco = String($("#banco-contacto").val());
    const repetido = obtenerContactos().some(function (contacto) {
      return contacto.cbu === cbu || contacto.alias.toLowerCase() === alias.toLowerCase();
    });

    if (repetido) {
      mostrarAlerta(
        $("#contact-alert"),
        "El CBU o alias ya está registrado.",
        "danger",
      );
      return;
    }

    const nuevo = agregarContacto(nombre, cbu, alias, banco);
    modalContacto.hide();
    $busqueda.val("");
    renderizarContactos();
    mostrarAlerta(
      $("#send-alert"),
      "Contacto " + nuevo.nombre + " agregado correctamente.",
      "success",
    );
  });

  $botonEnviar.on("click", function () {
    if (contactoSeleccionado === null) {
      return;
    }

    $("#transfer-details")
      .empty()
      .append(
        $("<strong>").text(contactoSeleccionado.nombre),
        $("<span>").text(contactoSeleccionado.banco + " · " + contactoSeleccionado.alias),
        $("<span>").text("CBU: " + contactoSeleccionado.cbu),
      );
    $formularioTransferencia.trigger("reset").removeClass("was-validated");
    $("#transfer-alert").empty();
    actualizarSaldo();
    modalTransferencia.show();
  });

  $formularioTransferencia.on("submit", function (evento) {
    evento.preventDefault();
    const monto = Number($monto.val());

    if (!Number.isInteger(monto) || monto <= 0) {
      mostrarAlerta($("#transfer-alert"), "Ingresa un monto entero mayor a cero.", "danger");
      return;
    }

    if (monto > obtenerSaldo()) {
      mostrarAlerta($("#transfer-alert"), "Saldo insuficiente.", "danger");
      return;
    }

    const nombre = contactoSeleccionado.nombre;
    transferirDinero(monto, contactoSeleccionado);
    modalTransferencia.hide();
    actualizarSaldo();
    renderizarContactos(String($busqueda.val()));
    mostrarAlerta(
      $("#send-alert"),
      "Envío realizado con éxito: " + formatearDinero(monto) + " a " + nombre + ".",
      "success",
    );
  });

  actualizarSaldo();
  renderizarContactos();
});
