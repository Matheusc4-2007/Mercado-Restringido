import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

// Columnas que se devuelven siempre, una vez tienes la base es rapido
const SELECT_PRODUCTO = `
    SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
           p.id_vendedor, CONCAT(u.nombre, ' ', u.apellido) AS vendedor,
           p.id_categoria, c.nombre AS categoria
    FROM productos p
    JOIN usuarios u ON u.id = p.id_vendedor
    JOIN categorias c ON c.id = p.id_categoria
`

class Productos {
    static async listar({ nombre, idCategoria } = {}) {
        try {
            const condiciones = []
            const params = []

            if (nombre !== undefined) {
                // Escapa \ % _ para que se busquen como texto literal
                condiciones.push('p.nombre LIKE ?')
                params.push(`%${nombre.replace(/[\\%_]/g, '\\$&')}%`)
            }
            if (idCategoria !== undefined) {
                condiciones.push('p.id_categoria = ?')
                params.push(idCategoria)
            }

            const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''
            const [rows] = await connection.query(
                `${SELECT_PRODUCTO} ${where} ORDER BY p.nombre ASC`,
                params
            )
            return rows
        } catch (error) {
            throw errorDB('Error al obtener productos', error)
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(
                `${SELECT_PRODUCTO} WHERE p.id = ?`,
                [id]
            )
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar producto por ID', error)
        }
    }

    static async buscarVendedor(idVendedor) {
        try {
            const [rows] = await connection.query(
                `${SELECT_PRODUCTO} WHERE p.id_vendedor = ? ORDER BY p.nombre ASC`,
                [idVendedor]
            )
            return rows
        } catch (error) {
            throw errorDB('Error al buscar productos del vendedor', error)
        }
    }

    static async crear(productoData) {
        try {
            const nuevoProductoDB = {
                id: uuidv4(),
                nombre: productoData.nombre,
                descripcion: productoData.descripcion,
                precio: productoData.precio,
                id_vendedor: productoData.id_vendedor,
                id_categoria: productoData.id_categoria,
                imagen: productoData.imagen,
            }

            await connection.query('INSERT INTO productos SET ?', nuevoProductoDB)

            // Se vuelve a buscar para devolver también el nombre del vendedor
            return await this.buscarId(nuevoProductoDB.id)
        } catch (error) {
            throw errorDB('Error al crear producto', error)
        }
    }

    static async actualizar(id, productoData) {
        try {
            const camposActualizados = {}

            if (productoData.nombre !== undefined)
                camposActualizados.nombre = productoData.nombre
            if (productoData.descripcion !== undefined)
                camposActualizados.descripcion = productoData.descripcion
            if (productoData.precio !== undefined)
                camposActualizados.precio = productoData.precio
            if (productoData.imagen !== undefined)
                camposActualizados.imagen = productoData.imagen
            if (productoData.id_categoria !== undefined)
                camposActualizados.id_categoria = productoData.id_categoria

            if (Object.keys(camposActualizados).length === 0) return null

            await connection.query('UPDATE productos SET ? WHERE id = ?', [
                camposActualizados,
                id,
            ])

            return await this.buscarId(id)
        } catch (error) {
            throw errorDB('Error al actualizar producto', error)
        }
    }

    static async eliminar(id) {
        try {
            const producto = await this.buscarId(id)
            await connection.query('DELETE FROM productos WHERE id = ?', [id])
            return producto // devuelve lo eliminado (o null si no existía)
        } catch (error) {
            throw errorDB('Error al eliminar producto', error)
        }
    }
}

export default Productos