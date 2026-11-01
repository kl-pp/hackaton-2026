import { Transaccion } from "./classes/Transaccion.js";

const formulario = document.querySelector("#formulario-movimientos");
const lista = document.querySelector("#lista-movimientos");
const descripcion = document.querySelector("#descripcion");
const monto = document.querySelector("#monto");
const tipo = document.querySelector("#tipo");
const categoria = document.querySelector("#categoria");

let balance = 0;
const ingresosP = document.querySelector("#total-ingresos");
const gastosP = document.querySelector("#total-gastos");
const balanceP = document.querySelector("#balance-neto");

const resumenT = document.querySelector("#resumen-texto");

function actualizarBalance() {
    const ingresos = Transaccion.obtenerIngresos().reduce(
        (total, movimiento) => total + movimiento.monto,
        0,
    );
    const gastos = Transaccion.obtenerGastos().reduce(
        (total, movimiento) => total + movimiento.monto,
        0,
    );

    balance = ingresos - gastos;

    ingresosP.textContent = `$${ingresos.toLocaleString("es-AR")}`;
    gastosP.textContent = `$${gastos.toLocaleString("es-AR")}`;

    if (balance < 0) {
        balanceP.textContent = `-$${Math.abs(balance).toLocaleString("es-AR")}`;
    } else {
        balanceP.textContent = `$${balance.toLocaleString("es-AR")}`;
    }
}

function mostrarMovimiento(movimiento) {
    const elemento = document.createElement("li");

    const montoFormateado =
        (movimiento.tipo === "ingreso" ? "+" : "-") +
        "$" +
        movimiento.monto.toLocaleString("es-AR");

    elemento.textContent =
        `${movimiento.descripcion} | ` +
        `${movimiento.categoria} | ` +
        `${montoFormateado}`;

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", () => {
        elemento.remove();
        Transaccion.eliminar(movimiento.id);
        Transaccion.actualizarHistorial();
        actualizarBalance();
        generarResumen();
    });

    elemento.appendChild(botonEliminar);

    lista.prepend(elemento);
}

function generarResumen() {
    const titulos = ["Categoría", "Ingresos", "Gastos"];
    const resumen = document.createElement("table");
    const encabezado = document.createElement("tr");

    titulos.forEach((titulo) => {
        const titular = document.createElement("th");
        titular.textContent = titulo;

        encabezado.appendChild(titular);
    });

    resumen.appendChild(encabezado);

    Transaccion.categorias.forEach((categoria) => {
        const fila = document.createElement("tr");

        const movimientosCategoria = Transaccion.agruparCategoria(categoria);

        const ingresosCategoria = movimientosCategoria
            .filter((movimiento) => movimiento.tipo === "ingreso")
            .reduce((total, movimiento) => total + movimiento.monto, 0);

        const gastosCategoria = movimientosCategoria
            .filter((movimiento) => movimiento.tipo === "gasto")
            .reduce((total, movimiento) => total + movimiento.monto, 0);

        const datos = [
            categoria,
            `$${ingresosCategoria.toLocaleString("es-AR")}`,
            `$${gastosCategoria.toLocaleString("es-AR")}`,
        ];

        for (let i = 0; i < datos.length; i++) {
            const valor = datos[i];
            const data = document.createElement("td");

            data.textContent = valor;
            fila.appendChild(data);
        }

        resumen.appendChild(fila);
    });

    resumenT.innerHTML = "<h2>Resumen por Categorías</h2>";
    resumenT.appendChild(resumen);
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nuevoMovimiento = new Transaccion(
        Date.now(),
        tipo.value,
        descripcion.value.trim(),
        Number(monto.value),
        categoria.value,
    );

    Transaccion.agregar(nuevoMovimiento);

    Transaccion.actualizarHistorial();

    actualizarBalance();

    mostrarMovimiento(nuevoMovimiento);

    generarResumen();

    formulario.reset();
});

Transaccion.obtenerHistorial();
Transaccion.historial.forEach((movimiento) => mostrarMovimiento(movimiento));
actualizarBalance();
generarResumen();
