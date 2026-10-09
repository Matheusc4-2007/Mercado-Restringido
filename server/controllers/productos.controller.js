import Productos from '../models/productos.model.js'

class ProductosController {
    static todos() {
        return Productos.todos()
    }

    static buscarId(id) {
        return Productos.buscarId(id)
    }

    static buscarVendedor(idVendedor) {
        return Productos.buscarVendedor(idVendedor)
    }

    static crear(body) {
        return Productos.crear(body)
    }

    static actualizar(id, body) {
        return Productos.actualizar(id, body)
    }

    static eliminar(id) {
        return Productos.eliminar(id)
    }
}

export default ProductosController