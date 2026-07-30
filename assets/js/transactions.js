// ============================================
// ÚLTIMOS MOVIMIENTOS
// ============================================

$(function () {
  // Verificar sesión
  const usuario = billetera.getCurrentUser();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Elementos DOM
  const $lista = $("#lista-movimientos");
  const $saldo = $("#saldo-transacciones");
  const $filtro = $("#filtro-tipo");
  const $sinMovimientos = $("#sin-movimientos");

  // Actualizar saldo
  const actualizarSaldo = () => {
    $saldo.text(billetera.formatMoney(billetera.getSaldo(usuario.email)));
  };

  // ==========================================
  // CONFIGURACIÓN DE TIPOS
  // ==========================================

  const tipos = {
    deposito: "Depósito",
    transferencia: "Transferencia enviada",
    ingreso: "Transferencia recibida",
    retiro: "Retiro",
    compra: "Compra",
    inicio: "Bienvenida",
  };

  const iconos = {
    deposito: "💰",
    transferencia: "💸",
    ingreso: "📥",
    retiro: "💳",
    compra: "🛒",
    inicio: "👋",
  };

  const colores = {
    deposito: "success",
    transferencia: "danger",
    ingreso: "success",
    retiro: "warning",
    compra: "warning",
    inicio: "secondary",
  };

  // ==========================================
  // FUNCIONES DE APOYO
  // ==========================================

  const getTipo = (tipo) => tipos[tipo] || tipo;
  const getIcon = (tipo) => iconos[tipo] || "🔄";
  const getColor = (tipo) => colores[tipo] || "secondary";
  const esIngreso = (tipo) => tipo === "deposito" || tipo === "ingreso";
  const esEgreso = (tipo) => tipo === "transferencia" || tipo === "retiro";

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // CREAR ELEMENTO DE MOVIMIENTO
  // ==========================================

  const crearMovimiento = (movimiento) => {
    const ingreso = esIngreso(movimiento.tipo);
    const egreso = esEgreso(movimiento.tipo);
    const tipoTexto = getTipo(movimiento.tipo);
    const icono = getIcon(movimiento.tipo);
    const color = getColor(movimiento.tipo);

    const montoFormateado = ingreso
      ? `+${billetera.formatMoney(movimiento.monto)}`
      : egreso
        ? `-${billetera.formatMoney(movimiento.monto)}`
        : billetera.formatMoney(movimiento.monto);

    const claseColor = ingreso
      ? "text-success"
      : egreso
        ? "text-danger"
        : "text-secondary";

    const $li = $(`
      <li class="list-group-item transaction-item p-3" style="border-radius: 8px; margin-bottom: 8px; border: 1px solid #e9ecef; transition: all 0.2s;">
        <div class="d-flex align-items-center">
          <div class="me-3" style="font-size: 24px;">${icono}</div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="badge bg-${color} me-2">${tipoTexto}</span>
                <strong>${movimiento.descripcion}</strong>
              </div>
              <strong class="${claseColor}">${montoFormateado}</strong>
            </div>
            <small class="text-secondary">${formatearFecha(movimiento.fecha)}</small>
          </div>
        </div>
      </li>
    `);

    // Efectos hover
    $li.on("mouseenter", function () {
      $(this).css({
        "background-color": "#f8f9fa",
        transform: "translateX(5px)",
      });
    });

    $li.on("mouseleave", function () {
      $(this).css({ "background-color": "", transform: "" });
    });

    return $li;
  };

  // ==========================================
  // MOSTRAR MOVIMIENTOS
  // ==========================================

  const mostrarMovimientos = (filtro = "todos") => {
    const transacciones = billetera.getTransactions(usuario.email);
    $lista.empty();

    if (transacciones.length === 0) {
      $sinMovimientos.removeClass("d-none");
      return;
    }

    $sinMovimientos.addClass("d-none");

    const filtrados =
      filtro === "todos"
        ? transacciones
        : transacciones.filter((t) => t.tipo === filtro);

    if (filtrados.length === 0) {
      $lista.html(
        `<p class="text-center text-muted p-3">No hay movimientos de este tipo</p>`,
      );
      return;
    }

    filtrados.forEach((movimiento) =>
      $lista.append(crearMovimiento(movimiento)),
    );
  };

  // ==========================================
  // EVENTOS E INICIALIZAR
  // ==========================================

  $filtro.on("change", function () {
    mostrarMovimientos($(this).val());
  });

  actualizarSaldo();
  mostrarMovimientos("todos");
});
