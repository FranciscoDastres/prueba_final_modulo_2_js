// BILLETERA - Gestión de datos
window.billetera = (() => {
  // Claves para localStorage
  const CLAVES = { USERS: "billetera.users", CURRENT: "billetera.currentUser" };

  // Leer datos de localStorage
  const leer = (clave, defecto) => {
    try {
      const datos = localStorage.getItem(clave);
      return datos ? JSON.parse(datos) : defecto;
    } catch {
      return defecto;
    }
  };
  // Guardar datos en localStorage
  const guardar = (clave, valor) =>
    localStorage.setItem(clave, JSON.stringify(valor));
  // Eliminar datos de localStorage
  const eliminar = (clave) => localStorage.removeItem(clave);

  // Obtener todos los usuarios
  const getUsers = () => leer(CLAVES.USERS, []);
  // Guardar lista de usuarios
  const saveUsers = (usuarios) => guardar(CLAVES.USERS, usuarios);
  // Buscar usuario por email
  const findUser = (email) =>
    getUsers().find((u) => u.email === email.toLowerCase());

  // Obtener usuario con sesión activa
  const getCurrentUser = () => leer(CLAVES.CURRENT, null);
  // Guardar usuario con sesión activa
  const setCurrentUser = (usuario) => {
    if (usuario) {
      guardar(CLAVES.CURRENT, {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
      });
      sessionStorage.setItem("sesionBilletera", "activa");
    } else {
      eliminar(CLAVES.CURRENT);
      sessionStorage.removeItem("sesionBilletera");
    }
  };
  // Cerrar sesión
  const logout = () => setCurrentUser(null);

  // Codificar contraseña (demo)
  const hashPassword = (password) => btoa(password);

  // Registrar nuevo usuario
  const register = ({ name, email, password }) => {
    email = email.toLowerCase().trim();
    if (findUser(email)) throw new Error("El correo ya está registrado");
    if (password.length < 6)
      throw new Error("La contraseña debe tener al menos 6 caracteres");

    const nuevoUsuario = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email,
      passwordHash: hashPassword(password),
      saldo: 0,
      contacts: [],
      transactions: [],
    };

    const usuarios = getUsers();
    usuarios.push(nuevoUsuario);
    saveUsers(usuarios);
    setCurrentUser(nuevoUsuario);
    return nuevoUsuario;
  };

  // Iniciar sesión
  const login = ({ email, password }) => {
    email = email.toLowerCase().trim();
    const usuario = findUser(email);
    if (!usuario) return false;
    if (hashPassword(password) !== usuario.passwordHash) return false;
    setCurrentUser(usuario);
    return true;
  };

  // Verificar autenticación (redirige a login si no hay sesión)
  const requireAuth = () => {
    const tieneSesion = getCurrentUser() !== null;
    const sessionActiva =
      sessionStorage.getItem("sesionBilletera") === "activa";
    if (!tieneSesion && !sessionActiva) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  };

  // Obtener saldo de un usuario
  const getSaldo = (email) => findUser(email)?.saldo || 0;
  // Actualizar saldo de un usuario
  const setSaldo = (email, monto) => {
    const usuarios = getUsers();
    const indice = usuarios.findIndex((u) => u.email === email);
    if (indice === -1) throw new Error("Usuario no encontrado");
    usuarios[indice].saldo = monto;
    saveUsers(usuarios);
  };

  // Obtener contactos de un usuario
  const getContacts = (email) => findUser(email)?.contacts || [];
  // Agregar un contacto
  const addContact = (email, contacto) => {
    const usuarios = getUsers();
    const indice = usuarios.findIndex((u) => u.email === email);
    if (indice === -1) throw new Error("Usuario no encontrado");

    const nuevoContacto = {
      id: "c-" + Date.now(),
      nombre: contacto.nombre.trim(),
      alias: contacto.alias.trim(),
      cbu: contacto.cbu.trim(),
      banco: contacto.banco.trim(),
    };

    usuarios[indice].contacts.push(nuevoContacto);
    saveUsers(usuarios);
    return nuevoContacto;
  };

  // Obtener transacciones de un usuario
  const getTransactions = (email) => findUser(email)?.transactions || [];
  // Agregar una transacción
  const addTransaction = (email, transaccion) => {
    const usuarios = getUsers();
    const indice = usuarios.findIndex((u) => u.email === email);
    if (indice === -1) throw new Error("Usuario no encontrado");

    usuarios[indice].transactions.unshift({
      id: "tx-" + Date.now(),
      ...transaccion,
      fecha: new Date().toISOString(),
    });
    saveUsers(usuarios);
  };

  // Depositar dinero
  const depositar = (email, monto) => {
    if (monto <= 0) throw new Error("Monto inválido");
    const nuevoSaldo = getSaldo(email) + monto;
    setSaldo(email, nuevoSaldo);
    addTransaction(email, {
      tipo: "deposito",
      monto,
      descripcion: `Depósito de $${monto.toLocaleString("es-CL")}`,
    });
    return nuevoSaldo;
  };

  // Transferir dinero a un contacto
  const transferir = (email, monto, contacto) => {
    const saldoActual = getSaldo(email);
    if (monto <= 0) throw new Error("Monto inválido");
    if (monto > saldoActual) throw new Error("Saldo insuficiente");

    const nuevoSaldo = saldoActual - monto;
    setSaldo(email, nuevoSaldo);
    addTransaction(email, {
      tipo: "transferencia",
      monto,
      descripcion: `Transferencia a ${contacto.nombre} · ${contacto.banco}`,
    });
    return true;
  };

  // Recibir fondos (simulación)
  const recibirFondos = (email, monto, desde = "Usuario externo") => {
    if (monto <= 0) throw new Error("El monto debe ser positivo");
    const nuevoSaldo = getSaldo(email) + monto;
    setSaldo(email, nuevoSaldo);
    addTransaction(email, {
      tipo: "ingreso",
      monto,
      descripcion: `Transferencia recibida de ${desde}`,
    });
    return nuevoSaldo;
  };

  // Formatear dinero a pesos chilenos
  const formatMoney = (monto) => "$" + Number(monto).toLocaleString("es-CL");

  // Funciones disponibles para otros archivos
  return {
    getUsers,
    saveUsers,
    findUser,
    register,
    login,
    logout,
    getCurrentUser,
    setCurrentUser,
    requireAuth,
    getSaldo,
    setSaldo,
    getContacts,
    addContact,
    getTransactions,
    addTransaction,
    depositar,
    transferir,
    recibirFondos,
    hashPassword,
    formatMoney,
  };
})();
