import { v4 as uuidv4 } from 'uuid'
import connection from '../db.js'

const errorDB = (mensaje, error) => {
    const err = new Error(`${mensaje}: ${error.message}`)
    err.code = error.code
    return err
}

const SELECT_PEDIDO = `
    SELECT p.id, p.id_comprador, CONCAT(u.nombre, ' ', u.apellido) AS comprador,
           p.fecha, p.total, p.estado
    FROM pedidos p
    JOIN usuarios u ON u.id = p.id_comprador
`

const SELECT_DETALLE = `
    SELECT d.id, d.id_pedido, d.id_producto, pr.nombre AS producto, pr.imagen,
           d.cantidad, d.precio_unitario,
           pr.id_vendedor, CONCAT(v.nombre, ' ', v.apellido) AS vendedor
    FROM detalle_pedido d
    JOIN productos pr ON pr.id = d.id_producto
    JOIN usuarios v ON v.id = pr.id_vendedor
`

// Adjunta a cada pedido su lista de productos (una sola consulta para todos)
const conDetalles = async (pedidos) => {
    if (pedidos.length === 0) return pedidos

    const [detalles] = await connection.query(
        `${SELECT_DETALLE} WHERE d.id_pedido IN (?) ORDER BY pr.nombre ASC`,
        [pedidos.map((p) => p.id)]
    )

    return pedidos.map((p) => ({
        ...p,
        detalles: detalles.filter((d) => d.id_pedido === p.id),
    }))
}

class Pedidos {
    static async listar({ idComprador } = {}) {
        try {
            const condiciones = []
            const params = []

            if (idComprador !== undefined) {
                condiciones.push('p.id_comprador = ?')
                params.push(idComprador)
            }

            const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''
            const [rows] = await connection.query(
                `${SELECT_PEDIDO} ${where} ORDER BY p.fecha DESC`,
                params
            )
            return await conDetalles(rows)
        } catch (error) {
            throw errorDB('Error al obtener pedidos', error)
        }
    }

    static async buscarId(id) {
        try {
            const [rows] = await connection.query(`${SELECT_PEDIDO} WHERE p.id = ?`, [id])
            if (rows.length === 0) return null
            return (await conDetalles(rows))[0]
        } catch (error) {
            throw errorDB('Error al buscar pedido por ID', error)
        }
    }

    // pedidoData: { id_comprador, total, items: [{ id_producto, cantidad, precio_unitario }] }
    // El pedido y sus líneas se guardan en una transacción: o entra todo o nada.
    static async crear(pedidoData) {
        let conexion
        try {
            const idPedido = uuidv4()

            conexion = await connection.getConnection()
            await conexion.beginTransaction()

            await conexion.query('INSERT INTO pedidos SET ?', {
                id: idPedido,
                id_comprador: pedidoData.id_comprador,
                total: pedidoData.total,
            })

            const filas = pedidoData.items.map((i) => [
                uuidv4(),
                idPedido,
                i.id_producto,
                i.cantidad,
                i.precio_unitario,
            ])
            await conexion.query(
                'INSERT INTO detalle_pedido (id, id_pedido, id_producto, cantidad, precio_unitario) VALUES ?',
                [filas]
            )

            await conexion.commit()
            return await this.buscarId(idPedido)
        } catch (error) {
            if (conexion) await conexion.rollback()
            throw errorDB('Error al crear pedido', error)
        } finally {
            if (conexion) conexion.release()
        }
    }

    static async actualizarEstado(id, estado) {
        try {
            await connection.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id])
            return await this.buscarId(id)
        } catch (error) {
            throw errorDB('Error al actualizar el estado del pedido', error)
        }
    }
}

export default Pedidos
