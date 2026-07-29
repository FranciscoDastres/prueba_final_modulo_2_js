protegerSesion();

const listaTransacciones = [
  {
    tipo: "compra",
    monto: 12990,
    descripcion: "Compra en supermercado (ejemplo)",
    fecha: "2026-07-10T15:30:00.000Z",
  },
  {
    tipo: "deposito",
    monto: 25000,
    descripcion: "Depósito de prueba (ejemplo)",
    fecha: "2026-07-08T11:00:00.000Z",
  },
  {
    tipo: "transferencia-recibida",
    monto: 18000,
    descripcion: "Transferencia recibida de Ana García (ejemplo)",
    fecha: "2026-07-05T19:45:00.000Z",
  },
];

const TIPOS_TRANSACCION = {
  compra: "Compra",
  deposito: "Depósito",
  transferencia: "Transferencia enviada",
  "transferencia-recibida": "Transferencia recibida",
};

function getTipoTransaccion(tipo) {
  return TIPOS_TRANSACCION[tipo] || "Movimiento";
}

function esIngreso(tipo) {
  return tipo === "deposito" || tipo === "transferencia-recibida";
}

function crearMovimiento(movimiento) {
  const ingreso = esIngreso(movimiento.tipo);
  const $datos = $("<span>").append(
    $("<span>", {
      class: "badge mb-1 " + (ingreso ? "text-bg-success" : "text-bg-secondary"),
      text: getTipoTransaccion(movimiento.tipo),
    }),
    $("<strong>").text(movimiento.descripcion),
    $("<small>").text(new Date(movimiento.fecha).toLocaleString("es-CL")),
  );
  const $monto = $("<strong>", {
    class: ingreso ? "text-success" : "text-danger",
    text: (ingreso ? "+" : "−") + formatearDinero(movimiento.monto),
  });

  return $("<li>", { class: "list-group-item transaction-item" }).append(
    $datos,
    $monto,
  );
}

function mostrarUltimosMovimientos(filtro) {
  const reales = obtenerMovimientos();
  const movimientos = reales.length > 0 ? reales : listaTransacciones;
  const filtrados = movimientos.filter(function (movimiento) {
    return filtro === "todos" || movimiento.tipo === filtro;
  });
  const $lista = $("#lista-movimientos").empty();

  $("#sin-movimientos").toggleClass("d-none", filtrados.length > 0);
  filtrados.forEach(function (movimiento) {
    $lista.append(crearMovimiento(movimiento));
  });
}

$(function () {
  const $filtro = $("#filtro-tipo");
  $("#saldo-transacciones").text(formatearDinero(obtenerSaldo()));
  $filtro.on("change", function () {
    mostrarUltimosMovimientos(String($(this).val()));
  });
  mostrarUltimosMovimientos(String($filtro.val()));
});
