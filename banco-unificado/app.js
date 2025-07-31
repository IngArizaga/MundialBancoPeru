// Datos iniciales simulados
const cuentas = [
    { id: 1, banco: "Santander", numero: "****1234", saldo: 1500.50 },
    { id: 2, banco: "BBVA", numero: "****5678", saldo: 3000.75 },
    { id: 3, banco: "CaixaBank", numero: "****9012", saldo: 750.00 }
];

let historial = [
    { id: 1, tipo: "inicio", mensaje: "Sesión iniciada", fecha: new Date() }
];

// Elementos del DOM
const listaCuentas = document.getElementById("lista-cuentas");
const saldoTotalElement = document.getElementById("saldo-total");
const agregarCuentaBtn = document.getElementById("agregar-cuenta");
const ejecutarBtn = document.getElementById("ejecutar");
const tipoOperacion = document.getElementById("tipo-operacion");
const montoInput = document.getElementById("monto");
const mensajeDiv = document.getElementById("mensaje");
const listaHistorial = document.getElementById("lista-historial");
const toggleThemeBtn = document.getElementById("toggle-theme");

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarCuentas();
    cargarHistorial();
    actualizarSaldoTotal();
    
    // Verificar si hay preferencia de tema guardada
    if (localStorage.getItem("theme") === "dark") {
        document.body.setAttribute("data-theme", "dark");
        toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Cargar cuentas en la lista
function cargarCuentas() {
    listaCuentas.innerHTML = "";
    cuentas.forEach(cuenta => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${cuenta.banco}</strong> (${cuenta.numero})</span>
            <span>$${cuenta.saldo.toFixed(2)}</span>
        `;
        listaCuentas.appendChild(li);
    });
}

// Cargar historial de transacciones
function cargarHistorial() {
    listaHistorial.innerHTML = "";
    historial.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.mensaje}</span>
            <small>${formatFecha(item.fecha)}</small>
        `;
        listaHistorial.appendChild(li);
    });
}

// Formatear fecha
function formatFecha(fecha) {
    return new Date(fecha).toLocaleString();
}

// Calcular saldo total
function actualizarSaldoTotal() {
    const saldoTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
    saldoTotalElement.textContent = `$${saldoTotal.toFixed(2)}`;
}

// Agregar nueva cuenta (simulación)
agregarCuentaBtn.addEventListener("click", async () => {
    const nuevoBanco = prompt("Ingresa el nombre del banco:");
    if (!nuevoBanco) return;
    
    const nuevaCuenta = prompt("Ingresa los últimos 4 dígitos de la cuenta:");
    if (!nuevaCuenta || nuevaCuenta.length !== 4 || isNaN(nuevaCuenta)) {
        mostrarMensaje("❌ Debes ingresar 4 dígitos numéricos", "error");
        return;
    }
    
    // Simular carga de API
    agregarCuentaBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    agregarCuentaBtn.disabled = true;
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nuevaId = cuentas.length > 0 ? Math.max(...cuentas.map(c => c.id)) + 1 : 1;
    const saldoInicial = Math.floor(Math.random() * 5000) + 500;
    
    cuentas.push({
        id: nuevaId,
        banco: nuevoBanco,
        numero: `****${nuevaCuenta}`,
        saldo: saldoInicial
    });
    
    historial.push({
        id: historial.length + 1,
        tipo: "cuenta",
        mensaje: `✅ Cuenta ${nuevoBanco} (****${nuevaCuenta}) vinculada`,
        fecha: new Date()
    });
    
    cargarCuentas();
    cargarHistorial();
    actualizarSaldoTotal();
    mostrarMensaje(`✅ Cuenta ${nuevoBanco} vinculada correctamente`, "success");
    
    agregarCuentaBtn.innerHTML = '<i class="fas fa-plus"></i> Vincular Cuenta';
    agregarCuentaBtn.disabled = false;
});

// Ejecutar operación bancaria
ejecutarBtn.addEventListener("click", async () => {
    const tipo = tipoOperacion.value;
    const monto = parseFloat(montoInput.value);
    
    // Validaciones
    if (isNaN(monto)) {
        mostrarMensaje("❌ Ingresa un monto válido", "error");
        return;
    }
    
    if (monto <= 0) {
        mostrarMensaje("❌ El monto debe ser mayor a cero", "error");
        return;
    }
    
    if (cuentas.length === 0) {
        mostrarMensaje("❌ No tienes cuentas vinculadas", "error");
        return;
    }
    
    // Simular operación con API
    ejecutarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    ejecutarBtn.disabled = true;
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let mensaje = "";
    let tipoMensaje = "success";
    
    switch (tipo) {
        case "transferir":
            mensaje = `📤 Transferencia de $${monto.toFixed(2)} realizada`;
            break;
        case "retirar":
            mensaje = `🏧 Retiro de $${monto.toFixed(2)} realizado`;
            break;
        case "depositar":
            mensaje = `📥 Depósito de $${monto.toFixed(2)} recibido`;
            break;
    }
    
    // Actualizar una cuenta aleatoria para la demo (en un caso real sería específica)
    const cuentaIndex = Math.floor(Math.random() * cuentas.length);
    if (tipo === "depositar") {
        cuentas[cuentaIndex].saldo += monto;
    } else {
        cuentas[cuentaIndex].saldo -= monto;
    }
    
    historial.push({
        id: historial.length + 1,
        tipo: "operacion",
        mensaje: mensaje,
        fecha: new Date()
    });
    
    cargarCuentas();
    cargarHistorial();
    actualizarSaldoTotal();
    mostrarMensaje(mensaje, tipoMensaje);
    
    montoInput.value = "";
    ejecutarBtn.innerHTML = '<i class="fas fa-check-circle"></i> Ejecutar';
    ejecutarBtn.disabled = false;
});

// Mostrar mensajes de feedback
function mostrarMensaje(texto, tipo = "info") {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = "mensaje " + tipo;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.textContent = "";
        mensajeDiv.className = "mensaje";
    }, 5000);
}

// Toggle tema oscuro/claro
toggleThemeBtn.addEventListener("click", () => {
    if (document.body.getAttribute("data-theme") === "dark") {
        document.body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
});