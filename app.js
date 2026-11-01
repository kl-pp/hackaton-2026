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
        balanceP.classList.add("text-red-600");
    } else {
        balanceP.textContent = `$${balance.toLocaleString("es-AR")}`;
        balanceP.classList.remove("text-red-600");
    }
}

function mostrarMovimiento(movimiento) {
    const elemento = document.createElement("li");

    elemento.classList.add(
        "flex",
        "flex-col",
        "gap-3",
        "w-full",
        "max-w-md",
        "break-words",
        "bg-amber-100/95",
        "border-2",
        "border-amber-700",
        "rounded-xl",
        "p-4",
        "shadow-md",
    );

    const montoFormateado =
        (movimiento.tipo === "ingreso" ? "+" : "-") +
        "$" +
        movimiento.monto.toLocaleString("es-AR");

    elemento.textContent =
        `${movimiento.descripcion} | ` +
        `${movimiento.categoria} | ` +
        `${montoFormateado}`;

    if (movimiento.tipo === "ingreso") {
        elemento.classList.add("text-green-600");
    } else {
        elemento.classList.add("text-red-600");
    }

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add(
        "bg-red-700",
        "hover:bg-red-800",
        "text-white",
        "font-semibold",
        "px-3",
        "py-2",
        "rounded-lg",
        "shadow-sm",
        "transition-colors",
    );

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

    resumen.classList.add(
        "w-full",
        "max-w-2xl",
        "border-collapse",
        "bg-amber-100/95",
        "rounded-lg",
        "overflow-hidden",
        "shadow-lg",
    );
    const encabezado = document.createElement("tr");

    encabezado.classList.add(
        "bg-linear-to-r",
        "from-green-950",
        "via-green-800",
        "to-green-600",
        "text-white",
    );

    titulos.forEach((titulo) => {
        const titular = document.createElement("th");
        titular.classList.add(
            "px-4",
            "py-3",
            "text-left",
            "font-bold",
            "border-b-2",
            "border-green-700",
        );
        titular.textContent = titulo;

        encabezado.appendChild(titular);
    });

    resumen.appendChild(encabezado);

    Transaccion.categorias.forEach((categoria) => {
        const fila = document.createElement("tr");
        fila.classList.add(
            "even:bg-amber-100",
            "odd:bg-amber-50",
            "hover:bg-yellow-200",
            "transition-colors",
        );

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
            data.classList.add(
                "px-4",
                "py-3",
                "border-b",
                "border-amber-200",
                "text-gray-900",
            );

            data.textContent = valor;
            fila.appendChild(data);
        }

        resumen.appendChild(fila);
    });

    resumenT.innerHTML =
        "<h2 class='text-xl font-bold'>Resumen por Categorías</h2>";
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
