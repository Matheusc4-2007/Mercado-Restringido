import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

const SELECT_RESENA = `
    SELECT r.id, r.id_producto, pr.nombre AS producto,
           r.id_usuario, CONCAT(u.nombre, ' ', u.apellido) AS usuario,
           r.calificacion, r.comentario, r.fecha
    FROM resenas r
    JOIN productos pr ON pr.id = r.id_producto
    JOIN usuarios u ON u.id = r.id_usuario
`

class Resenas {
    static async listar({ idProducto } = {}) {
        try {
            const condiciones = []
            const params = []

            if (idProducto !== undefined) {
                condiciones.push('r.id_producto = ?')
                params.push(idProducto)
            }

            const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''
            const [rows] = await connection.query(
                `${SELECT_RESENA} ${where} ORDER BY r.fecha DESC`,
                params
            )
            return rows
        } catch (error) {
            throw errorDB('Error al obtener reseñas', error)
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(`${SELECT_RESENA} WHERE r.id = ?`, [id])
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar reseña por ID', error)
        }
    }

    // Un usuario solo puede reseñar una vez cada producto
    static async buscarProductoUsuario(idProducto, idUsuario) {
        try {
            const [rows] = await connection.query(
                `${SELECT_RESENA} WHERE r.id_producto = ? AND r.id_usuario = ?`,
                [idProducto, idUsuario]
            )
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar la reseña del usuario', error)
        }
    }

    static async crear(resenaData) {
        try {
            const nuevaResenaDB = {
                id: uuidv4(),
                id_producto: resenaData.id_producto,
                id_usuario: resenaData.id_usuario,
                calificacion: resenaData.calificacion,
                comentario: resenaData.comentario ?? null,
            }

            await connection.query('INSERT INTO resenas SET ?', nuevaResenaDB)

            return await this.buscarId(nuevaResenaDB.id)
        } catch (error) {
            throw errorDB('Error al crear reseña', error)
        }
    }

    static async actualizar(id, resenaData) {
        try {
            const camposActualizados = {}

            if (resenaData.calificacion !== undefined)
                camposActualizados.calificacion = resenaData.calificacion
            if (resenaData.comentario !== undefined)
                camposActualizados.comentario = resenaData.comentario

            if (Object.keys(camposActualizados).length === 0) return null

            await connection.query('UPDATE resenas SET ? WHERE id = ?', [camposActualizados, id])

            return await this.buscarId(id)
        } catch (error) {
            throw errorDB('Error al actualizar reseña', error)
        }
    }

    static async eliminar(id) {
        try {
            const resena = await this.buscarId(id)
            await connection.query('DELETE FROM resenas WHERE id = ?', [id])
            return resena // devuelve lo eliminado (o null si no existía)
        } catch (error) {
            throw errorDB('Error al eliminar reseña', error)
        }
    }
}

export default Resenas
