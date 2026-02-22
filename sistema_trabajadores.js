const readline = require('readline-sync');
const fs = require('fs');

const FILE_NAME = 'trabajadores.json';

let trabajadores = [];

// Cargar datos existentes al iniciar
if (fs.existsSync(FILE_NAME)) {
    const data = fs.readFileSync(FILE_NAME);
    trabajadores = JSON.parse(data);
}

function mostrarMenu() {
    console.log(`
    === SISTEMA DE GESTIÓN DE TRABAJADORES ===
    1. Insertar trabajador
    2. Modificar trabajador
    3. Eliminar trabajador
    4. Contar trabajadores con salario superior
    5. Verificar si es docente por CI
    6. Contar doctores
    7. Promedio de edad
    8. Buscar trabajador por área
    9. Guardar en archivo
    0. Salir
    `);
}

function insertarTrabajador() {
    console.log("\n--- Insertar nuevo trabajador ---");
    const ci = readline.question("CI: ");
    const nombre = readline.question("Nombre completo: ");
    const edad = parseInt(readline.question("Edad: "));
    const salario = parseFloat(readline.question("Salario: "));
    const esDocente = readline.question("¿Es docente? (s/n): ").toLowerCase() === 's';
    const gradoCientifico = esDocente ? readline.question("Grado científico (Msc/Dr): ") : "N/A";
    const area = readline.question("Área de trabajo: ");

    trabajadores.push({
        ci,
        nombre,
        edad,
        salario,
        esDocente,
        gradoCientifico,
        area
    });
    console.log("Trabajador agregado exitosamente.");
}

function modificarTrabajador() {
    const ci = readline.question("CI del trabajador a modificar: ");
    const index = trabajadores.findIndex(t => t.ci === ci);
    
    if (index === -1) {
        console.log("Trabajador no encontrado.");
        return;
    }

    console.log("Deje en blanco los campos que no desea modificar:");
    const nuevoNombre = readline.question(`Nombre (${trabajadores[index].nombre}): `);
    const nuevaEdad = readline.question(`Edad (${trabajadores[index].edad}): `);
    const nuevoSalario = readline.question(`Salario (${trabajadores[index].salario}): `);
    const nuevaArea = readline.question(`Área (${trabajadores[index].area}): `);

    if (nuevoNombre) trabajadores[index].nombre = nuevoNombre;
    if (nuevaEdad) trabajadores[index].edad = parseInt(nuevaEdad);
    if (nuevoSalario) trabajadores[index].salario = parseFloat(nuevoSalario);
    if (nuevaArea) trabajadores[index].area = nuevaArea;

    console.log("Trabajador modificado exitosamente.");
}

function eliminarTrabajador() {
    const ci = readline.question("CI del trabajador a eliminar: ");
    const index = trabajadores.findIndex(t => t.ci === ci);
    
    if (index === -1) {
        console.log("Trabajador no encontrado.");
        return;
    }

    trabajadores.splice(index, 1);
    console.log("Trabajador eliminado exitosamente.");
}

function contarSalarioSuperior() {
    const salario = parseFloat(readline.question("Salario de referencia: "));
    const count = trabajadores.filter(t => t.salario > salario).length;
    console.log(`Cantidad de trabajadores con salario superior: ${count}`);
}

function verificarDocente() {
    const ci = readline.question("CI del trabajador: ");
    const trabajador = trabajadores.find(t => t.ci === ci);
    
    if (!trabajador) {
        console.log("Trabajador no encontrado.");
        return;
    }

    console.log(trabajador.esDocente ? "ES docente" : "NO es docente");
}

function contarDoctores() {
    const count = trabajadores.filter(t => t.gradoCientifico === 'Dr').length;
    console.log(`Cantidad de doctores: ${count}`);
}

function promedioEdad() {
    if (trabajadores.length === 0) {
        console.log("No hay trabajadores registrados.");
        return;
    }
    
    const promedio = trabajadores.reduce((sum, t) => sum + t.edad, 0) / trabajadores.length;
    console.log(`Promedio de edad: ${promedio.toFixed(2)}`);
}

function buscarPorArea() {
    const area = readline.question("Área de búsqueda: ");
    const trabajador = trabajadores.find(t => t.area === area);
    
    if (!trabajador) {
        console.log("No se encontraron trabajadores en esa área.");
        return;
    }

    console.log(`Trabajador encontrado: ${trabajador.nombre}`);
}

function guardarArchivo() {
    fs.writeFileSync(FILE_NAME, JSON.stringify(trabajadores, null, 2));
    console.log("Datos guardados en el archivo.");
}

// Menú principal
while (true) {
    mostrarMenu();
    const opcion = readline.question("Seleccione una opción: ");
    
    switch (opcion) {
        case '1': insertarTrabajador(); break;
        case '2': modificarTrabajador(); break;
        case '3': eliminarTrabajador(); break;
        case '4': contarSalarioSuperior(); break;
        case '5': verificarDocente(); break;
        case '6': contarDoctores(); break;
        case '7': promedioEdad(); break;
        case '8': buscarPorArea(); break;
        case '9': guardarArchivo(); break;
        case '0':
            console.log("Saliendo del sistema...");
            process.exit();
        default:
            console.log("Opción no válida.");
    }
}