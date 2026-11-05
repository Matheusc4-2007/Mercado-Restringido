import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

const SELECT_CATEGORIA = `
    SELECT c.id, c.nombre, c.descripcion, COUNT(p.id) AS total_productos
    FROM categorias c
    LEFT JOIN productos p ON p.id_categoria = c.id
`
const GROUP_CATEGORIA = 'GROUP BY c.id, c.nombre, c.descripcion'

class Categorias {
    static async todas() {
        try {
            const [rows] = await connection.query(
                `${SELECT_CATEGORIA} ${GROUP_CATEGORIA} ORDER BY c.nombre ASC`
            )
            return rows
        } catch (error) {
            throw errorDB('Error al obtener categorías', error)
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(
                `${SELECT_CATEGORIA} WHERE c.id = ? ${GROUP_CATEGORIA}`,
                [id]
            )
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar categoría por ID', error)
        }
    }

    static async buscarNombre(nombre) {
        try {
            const [rows] = await connection.query(
                `${SELECT_CATEGORIA} WHERE c.nombre = ? ${GROUP_CATEGORIA}`,
                [nombre]
            )
            return rows.length === 0 ? null : rows[0]
        } catch (error) {
            throw errorDB('Error al buscar categoría por nombre', error)
        }
    }

    static async crear(categoriaData) {
        try {
            const nuevaCategoriaDB = {
                id: uuidv4(),
                nombre: categoriaData.nombre,
                descripcion: categoriaData.descripcion ?? null,
            }

            await connection.query('INSERT INTO categorias SET ?', nuevaCategoriaDB)

            return await this.buscarId(nuevaCategoriaDB.id)
        } catch (error) {
            throw errorDB('Error al crear categoría', error)
        }
    }

    static async actualizar(id, categoriaData) {
        try {
            const camposActualizados = {}

            if (categoriaData.nombre !== undefined)
                camposActualizados.nombre = categoriaData.nombre
            if (categoriaData.descripcion !== undefined)
                camposActualizados.descripcion = categoriaData.descripcion

            if (Object.keys(camposActualizados).length === 0) return null

            await connection.query('UPDATE categorias SET ? WHERE id = ?', [
                camposActualizados,
                id,
            ])

            return await this.buscarId(id)
        } catch (error) {
            throw errorDB('Error al actualizar categoría', error)
        }
    }

    static async eliminar(id) {
        try {
            const categoria = await this.buscarId(id)
            await connection.query('DELETE FROM categorias WHERE id = ?', [id])
            return categoria // devuelve lo eliminado (o null si no existía)
        } catch (error) {
            throw errorDB('Error al eliminar categoría', error)
        }
    }
}

export default Categorias
