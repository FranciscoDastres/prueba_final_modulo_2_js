# Billetera digital con jQuery

---

## 📱 Pantallas y Funcionalidades

### 1. Login (login.html)
**Requisitos implementados:**
- Selectores jQuery (`$('#email').val()`, `$('#password').val()`)
- Evento submit con jQuery (`$('#loginForm').on('submit', ...)`)
- Redirección a `menu.html` desde el manejador jQuery con `window.location.href`
- Alertas de Bootstrap personalizadas

**Datos de prueba:**
- Email: `usuario@email.com`
- Contraseña: `123456`

---

### 2. Menú Principal (menu.html)

**Requisitos implementados:**

- Eventos click en botones:
  - "Depositar" → redirige a `deposit.html`
  - "Enviar Dinero" → redirige a `sendmoney.html`
  - "Últimos Movimientos" → redirige a `transactions.html`
- Mensaje de redirección con jQuery

---

### 3. Depósito (deposit.html)

**Requisitos implementados:**

- Lectura de saldo desde Local Storage con jQuery
- Leyenda de monto depositado
- Alerta Bootstrap de éxito
- Redirección a menú después de 2 segundos

---

### 4. Enviar Dinero (sendmoney.html)

**Requisitos implementados:**

- Mostrar/ocultar formulario de contactos
- Validación de formulario (campos obligatorios, CBU)
- Búsqueda en agenda por nombre o alias
- Mostrar/ocultar botón "Enviar dinero"
- Mensaje de confirmación

**Contactos de prueba:**

```javascript
[
  { nombre: "Ana García", alias: "ana.garcia", cbu: "1234567890123456789012" },
  { nombre: "Carlos Pérez", alias: "carlos.p", cbu: "9876543210987654321098" },
  { nombre: "María López", alias: "maria.l", cbu: "4567890123456789012345" },
];
```

---

### 5. Últimos movimientos (transactions.html)

**Requisitos implementados:**

- Lista ficticia `listaTransacciones` mientras no existen operaciones reales
- Reemplazo automático por depósitos y transferencias guardados en Local Storage
- Filtro por compra, depósito y transferencias enviadas o recibidas
- Renderizado dinámico con `mostrarUltimosMovimientos(filtro)`
- Nombre legible mediante `getTipoTransaccion(tipo)`

---

## Versiones utilizadas

- jQuery 3.7.1 para selectores, eventos, validaciones y actualización del DOM.
- Bootstrap 5.3.8 para estilos, alertas, formularios y modales responsive.

No es necesario bajar a Bootstrap 4. Bootstrap 5 ya no depende de jQuery, pero
ambos pueden convivir en la misma página. Se mantiene jQuery 3.7.1 porque es una
rama estable y adecuada para la API solicitada en el ejercicio. El formulario
usa `.on("submit", ...)` porque el atajo `.submit(...)` está obsoleto desde
jQuery 3.3.

Referencias oficiales:

- [Bootstrap 5.3: uso opcional con jQuery](https://getbootstrap.com/docs/5.3/getting-started/javascript/#optionally-using-jquery)
- [Bootstrap 5.3.8: inicio rápido y CDN](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [jQuery: `.submit()` obsoleto](https://api.jquery.com/submit-shorthand/)

## Cómo probar

1. Inicia un servidor local desde la raíz: `python3 -m http.server 8000`.
2. Abre `http://localhost:8000`.
3. Ingresa con `usuario@email.com` y `123456`.
4. Prueba un depósito, una transferencia y el filtro de movimientos.
