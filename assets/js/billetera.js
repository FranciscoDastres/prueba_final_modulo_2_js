const CLAVES = {
  saldo: "saldoBilletera",
  contactos: "contactosBilletera",
  movimientos: "movimientosBilletera",
  sesion: "sesionBilletera",
};

const USUARIO_DEMO = {
  email: "usuario@email.com",
  password: "123456",
};

const SALDO_INICIAL = 50000;
const CONTACTOS_INICIALES = [
  {
    id: "contacto-1",
    nombre: "Ana García",
    alias: "ana.garcia",
    cbu: "1234567890123456789012",
    banco: "BancoEstado",
  },
  {
    id: "contacto-2",
    nombre: "Carlos Pérez",
    alias: "carlos.p",
    cbu: "9876543210987654321098",
    banco: "Banco de Chile",
  },
  {
    id: "contacto-3",
    nombre: "María López",
    alias: "maria.l",
    cbu: "4567890123456789012345",
    banco: "Banco Santander Chile",
  },
];

function iniciarSesion(email, password) {
  const credencialesValidas =
    email === USUARIO_DEMO.email && password === USUARIO_DEMO.password;

  if (credencialesValidas) {
    sessionStorage.setItem(CLAVES.sesion, "activa");
  }

  return credencialesValidas;
}

function protegerSesion() {
  if (sessionStorage.getItem(CLAVES.sesion) !== "activa") {
    window.location.replace("login.html");
  }
}

function cerrarSesion() {
  sessionStorage.removeItem(CLAVES.sesion);
}

function mostrarAlerta($contenedor, mensaje, tipo = "info") {
  $("<div>", {
    class: "alert alert-" + tipo,
    role: "alert",
    text: mensaje,
  }).appendTo($contenedor.empty());
}

function formatearDinero(monto) {
  return "$" + monto.toLocaleString("es-CL");
}

function obtenerSaldo() {
  const valorGuardado = localStorage.getItem(CLAVES.saldo);
  const saldoGuardado = Number(valorGuardado);

  if (valorGuardado === null || !Number.isFinite(saldoGuardado) || saldoGuardado < 0) {
    guardarSaldo(SALDO_INICIAL);
    return SALDO_INICIAL;
  }

  return saldoGuardado;
}

function guardarSaldo(saldo) {
  localStorage.setItem(CLAVES.saldo, String(saldo));
}

function obtenerContactos() {
  if (localStorage.getItem(CLAVES.contactos) === null) {
    guardarContactos(CONTACTOS_INICIALES);
  }

  return JSON.parse(localStorage.getItem(CLAVES.contactos)).sort(function (a, b) {
    return a.nombre.localeCompare(b.nombre, "es-CL");
  });
}

function guardarContactos(contactos) {
  localStorage.setItem(CLAVES.contactos, JSON.stringify(contactos));
}

function agregarContacto(nombre, cbu, alias, banco) {
  const contactos = obtenerContactos();
  const nuevoContacto = {
    id: "contacto-" + Date.now(),
    nombre,
    cbu,
    alias,
    banco,
  };

  contactos.push(nuevoContacto);
  guardarContactos(contactos);
  return nuevoContacto;
}

function obtenerMovimientos() {
  return JSON.parse(localStorage.getItem(CLAVES.movimientos) || "[]");
}

function registrarMovimiento(tipo, monto, descripcion) {
  const movimientos = obtenerMovimientos();
  movimientos.unshift({ tipo, monto, descripcion, fecha: new Date().toISOString() });
  localStorage.setItem(CLAVES.movimientos, JSON.stringify(movimientos));
}

function depositarDinero(monto) {
  const nuevoSaldo = obtenerSaldo() + monto;
  guardarSaldo(nuevoSaldo);
  registrarMovimiento("deposito", monto, "Depósito en la billetera");
  return nuevoSaldo;
}

function transferirDinero(monto, contacto) {
  const saldo = obtenerSaldo();

  if (!Number.isInteger(monto) || monto <= 0 || monto > saldo) {
    return false;
  }

  guardarSaldo(saldo - monto);
  registrarMovimiento(
    "transferencia",
    monto,
    "Transferencia a " + contacto.nombre + " · " + contacto.banco,
  );
  return true;
}
