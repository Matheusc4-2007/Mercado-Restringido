import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

// Columnas que se devuelven siempre, una vez tienes la base es rapido
const SELECT_PRODUCTO = `
    SELECT p.id, p.nombre, p.precio, p.imagen, p.id_vendedor,
           CONCAT(u.nombre, ' ', u.apellido) AS vendedor
    FROM productos p
    JOIN usuarios u ON u.id = p.id_vendedor
`

class Productos {
    static async todos() {
        try {
            const [rows] = await connection.query(
                `${SELECT_PRODUCTO} ORDER BY p.nombre ASC`
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
                precio: productoData.precio,
                id_vendedor: productoData.id_vendedor,
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
            if (productoData.precio !== undefined)
                camposActualizados.precio = productoData.precio
            if (productoData.imagen !== undefined)
                camposActualizados.imagen = productoData.imagen

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

    static async buscarNombre(texto) {
        try {
            // Escapa \ % _ para que se busquen como texto literal
            const patron = `%${texto.replace(/[\\%_]/g, '\\$&')}%`
            const [rows] = await connection.query(
                `${SELECT_PRODUCTO} WHERE p.nombre LIKE ? ORDER BY p.nombre ASC`,
                [patron]
            )
            return rows
        } catch (error) {
            throw errorDB('Error al buscar productos por nombre', error)
        }
    }
}

export default Productos