# 💰 Alke Wallet

**Billetera digital** desarrollada con tecnologías front-end para la gestión de activos financieros de manera simple y segura.

---

## 📋 Descripción

Alke Wallet es una aplicación web que permite a los usuarios administrar su dinero digitalmente. Ofrece funcionalidades completas de billetera electrónica, incluyendo depósitos, retiros, transferencias y seguimiento de transacciones.

---

## 🚀 Tecnologías utilizadas

| Tecnología      | Descripción                                    |
| --------------- | ---------------------------------------------- |
| **HTML5**       | Estructura semántica de las páginas            |
| **CSS3**        | Estilos personalizados y diseño responsive     |
| **JavaScript**  | Lógica de la aplicación y manipulación del DOM |
| **Bootstrap 5** | Framework CSS para diseño responsive           |
| **jQuery 3**    | Biblioteca para manejo de eventos y DOM        |

---

## 📁 Estructura del proyecto

alke-wallet/
├── assets/
│ ├── css/
│ │ └── styles.css # Estilos personalizados
│ ├── js/
│ │ ├── billetera.js # Lógica principal (usuarios, saldo, transacciones)
│ │ ├── login.js # Inicio de sesión
│ │ ├── register.js # Registro de usuarios
│ │ ├── menu.js # Menú principal
│ │ ├── deposit.js # Depósitos
│ │ ├── sendmoney.js # Envío de dinero
│ │ └── transactions.js # Historial de transacciones
│ └── img/
│ └── logoTD/
│ └── js_logo.png # Logo de la aplicación
├── index.html # Página de entrada
├── login.html # Iniciar sesión
├── register.html # Registrarse
├── menu.html # Menú principal
├── deposit.html # Depositar dinero
├── sendmoney.html # Enviar dinero
└── transactions.html # Últimos movimientos

---

## 🎯 Guía de uso

### 1. Iniciar la aplicación

Abre el archivo `index.html` en tu navegador. Serás redirigido automáticamente a la pantalla de inicio de sesión.

### 2. Registrarse

Si no tienes una cuenta, haz clic en **"Regístrate aquí"**. Completa el formulario con:

- Nombre
- Correo electrónico
- Contraseña (mínimo 6 caracteres)
- Confirmar Contraseña

### 3. Iniciar sesión

Ingresa tus credenciales para acceder a tu billetera.

### 4. Menú principal

Desde el menú podrás acceder a todas las funcionalidades de la aplicación.

---

## 💳 Operaciones disponibles

### 💰 Depositar dinero

1. Haz clic en **"Depositar"** en el menú principal.
2. Ingresa el monto que deseas depositar.
3. También puedes usar los **montos rápidos** ($5.000, $10.000, $20.000, $50.000, $100.000).
4. Confirma el depósito para actualizar tu saldo.

### 📤 Enviar dinero

1. Haz clic en **"Enviar dinero"** en el menú principal.
2. **Primero**, agrega un contacto:
   - Haz clic en **"+ Agregar nuevo contacto"**.
   - Completa los datos del contacto (nombre, número de cuenta, alias, banco).
   - Guarda el contacto.
3. **Luego**, selecciona un contacto de la lista.
4. Ingresa el monto a enviar.
5. Confirma la transferencia.

### 📥 Recibir dinero

1. Haz clic en **"Recibir dinero"** en el menú principal.
2. Ingresa el monto recibido.
3. Indica el nombre de la persona que te envió el dinero.
4. Confirma para actualizar tu saldo y registrar la transacción.

### 💳 Retirar dinero

1. Haz clic en **"Retirar dinero"** en el menú principal.
2. Ingresa el monto que deseas retirar.
3. Puedes usar los **montos rápidos** ($5.000, $10.000, $20.000, $50.000, $100.000).
4. Confirma el retiro para actualizar tu saldo.

### 📊 Últimos movimientos

1. Haz clic en **"Últimos movimientos"** en el menú principal.
2. Visualiza todas tus transacciones ordenadas por fecha (más reciente primero).
3. Usa el **filtro** para ver solo depósitos, transferencias, ingresos o retiros.
4. Cada transacción muestra:
   - Icono según el tipo de movimiento
   - Descripción
   - Monto con signo (+ para ingresos, - para egresos)
   - Fecha y hora

---

## 🔐 Seguridad

- Las contraseñas se codifican usando `btoa()` antes de almacenarse en `localStorage`.
- La sesión se mantiene activa mediante `sessionStorage`.
- Las rutas protegidas redirigen automáticamente al login si no hay sesión activa.

---

## 📱 Responsive

La aplicación está diseñada con **Bootstrap 5** y es completamente responsive, adaptándose a:

- 💻 Desktop
- 📱 Tablets
- 📱 Móviles

---

## 📋 Requerimientos cumplidos

| Requerimiento                                  | Estado |
| ---------------------------------------------- | ------ |
| Registro e inicio de sesión                    | ✅     |
| Administración de fondos (depósitos y retiros) | ✅     |
| Envío y recepción de fondos                    | ✅     |
| Historial de transacciones                     | ✅     |
| Uso de HTML, CSS, JavaScript                   | ✅     |
| Uso de Bootstrap y jQuery                      | ✅     |

---

## 🔧 Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/FranciscoDastres/prueba_final_modulo_2_js
   ```
