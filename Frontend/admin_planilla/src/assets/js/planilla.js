// planilla.js
// Aquí van todas tus funciones de manejo de planillas, trabajadores, etc.
// ⚠️ IMPORTANTE: No modifiques nada, Angular solo lo carga como JS global.

// =======================
// Variables globales
// =======================
let trabajadores = [];
let contadorId = 1;

// =======================
// Funciones principales
// =======================

// Registrar un nuevo trabajador
function registrarTrabajador(nombre, dni, cargo, sueldo) {
    const trabajador = {
        id: contadorId++,
        nombre,
        dni,
        cargo,
        sueldo
    };
    trabajadores.push(trabajador);
    mostrarTrabajadores();
}

// Mostrar listado de trabajadores
function mostrarTrabajadores() {
    const lista = document.getElementById("listaTrabajadores");
    if (!lista) return;

    lista.innerHTML = "";
    trabajadores.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `${t.id} - ${t.nombre} - ${t.dni} - ${t.cargo} - S/ ${t.sueldo}`;
        lista.appendChild(li);
    });
}

// Buscar trabajador por DNI
function buscarTrabajador(dni) {
    return trabajadores.find(t => t.dni === dni);
}

// Eliminar trabajador por ID
function eliminarTrabajador(id) {
    trabajadores = trabajadores.filter(t => t.id !== id);
    mostrarTrabajadores();
}

// Calcular total de sueldos
function calcularTotalSueldos() {
    return trabajadores.reduce((acc, t) => acc + parseFloat(t.sueldo), 0);
}

// =======================
// Helpers de la interfaz
// =======================

// Ejemplo: atar botones a funciones
document.addEventListener("DOMContentLoaded", () => {
    const btnRegistrar = document.getElementById("btnRegistrar");
    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", () => {
            const nombre = document.getElementById("nombre").value;
            const dni = document.getElementById("dni").value;
            const cargo = document.getElementById("cargo").value;
            const sueldo = parseFloat(document.getElementById("sueldo").value);

            registrarTrabajador(nombre, dni, cargo, sueldo);
        });
    }

    const btnTotal = document.getElementById("btnTotal");
    if (btnTotal) {
        btnTotal.addEventListener("click", () => {
            alert("Total sueldos: S/ " + calcularTotalSueldos());
        });
    }
});
