export class Transaccion {
    static historial = [];
    static categorias = ["Sueldo", "Comida", "Transporte", "Otros"];

    constructor(id, tipo, descripcion, monto, categoria) {
        this.id = id;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.monto = monto;
        this.categoria = categoria;
    }

    static agregar(movimiento) {
        Transaccion.historial.push(movimiento);
    }

    static eliminar(id) {
        Transaccion.historial = Transaccion.historial.filter(
            (movimiento) => movimiento.id !== id,
        );
    }

    static obtenerIngresos() {
        return Transaccion.historial.filter(
            (movimiento) => movimiento.tipo === "ingreso",
        );
    }

    static obtenerGastos() {
        return Transaccion.historial.filter(
            (movimiento) => movimiento.tipo === "gasto",
        );
    }

    static agruparCategoria(categoria) {
        return Transaccion.historial.filter(
            (movimiento) => movimiento.categoria === categoria,
        );
    }

    static actualizarHistorial() {
        const historialCadena = JSON.stringify(Transaccion.historial);
        localStorage.setItem("historialPagina", historialCadena);
    }

    static obtenerHistorial() {
        const historialPagina = JSON.parse(
            localStorage.getItem("historialPagina"),
        );

        if (historialPagina === null) {
            return (this.historial = []);
        } else {
            return (this.historial = historialPagina);
        }
    }
}
