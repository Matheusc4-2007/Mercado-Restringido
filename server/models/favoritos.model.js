import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'
import { COLUMNAS_RESUMEN_RESENAS, JOIN_RESUMEN_RESENAS } from '../utils/resumenResenas.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

// Trae los datos del producto para poder mostrar la lista sin más consultas
const SELECT_FAVORITO = `
    SELECT f.id, f.id_usuario, f.id_producto, f.fecha,
           p.nombre, p.descripcion, p.precio, p.stock, p.imagen,
           p.id_vendedor, CONCAT(v.nombre, ' ', v.apellido) AS vendedor,
           p.id_categoria, c.nombre AS categoria,${COLUMNAS_RESUMEN_RESENAS}
    FROM favoritos f
    JOIN productos p ON p.id = f.id_producto
    JOIN usuarios v ON v.id = p.id_vendedor
    JOIN categorias c ON c.id = p.id_categoria${JOIN_RESUMEN_RESENAS}
`

class Favoritos {
    static async listarUsuario(idUsuario) {
        try {
            const [rows] = await connection.query(
                `${SELECT_FAVORITO} WHERE f.id_usuario = ? ORDER BY f.fecha DESC`,
                [idUsuario]
            )
            return rows
        } catch (error) {
            throw errorDB('Error al obtener favoritos', error)
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(`${SELECT_FAVORITO} WHERE f.id = ?`, [id])
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar favorito por ID', error)
        }
    }

    static async buscarUsuarioProducto(idUsuario, idProducto) {
        try {
            const [rows] = await connection.query(
                `${SELECT_FAVORITO} WHERE f.id_usuario = ? AND f.id_producto = ?`,
                [idUsuario, idProducto]
            )
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar favorito del usuario', error)
        }
    }

    static async crear(favoritoData) {
        try {
            const nuevoFavoritoDB = {
                id: uuidv4(),
                id_usuario: favoritoData.id_usuario,
                id_producto: favoritoData.id_producto,
            }

            await connection.query('INSERT INTO favoritos SET ?', nuevoFavoritoDB)

            return await this.buscarId(nuevoFavoritoDB.id)
        } catch (error) {
            throw errorDB('Error al crear favorito', error)
        }
    }

    static async eliminar(id) {
        try {
            const favorito = await this.buscarId(id)
            await connection.query('DELETE FROM favoritos WHERE id = ?', [id])
            return favorito // devuelve lo eliminado (o null si no existía)
        } catch (error) {
            throw errorDB('Error al eliminar favorito', error)
        }
    }
}

export default Favoritos
