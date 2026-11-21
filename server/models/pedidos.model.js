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
    static async listar({ idComprador, idVendedor } = {}) {
        try {
            const condiciones = []
            const params = []

            if (idComprador !== undefined) {
                condiciones.push('p.id_comprador = ?')
                params.push(idComprador)
            }

            if (idVendedor !== undefined) {
                condiciones.push(`EXISTS (
                    SELECT 1 FROM detalle_pedido dv
                    JOIN productos pv ON pv.id = dv.id_producto
                    WHERE dv.id_pedido = p.id AND pv.id_vendedor = ?
                )`)
                params.push(idVendedor)
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

    // Compra válida: pedido que incluye el producto y no está cancelado
    static async compro(idComprador, idProducto) {
        try {
            const [rows] = await connection.query(
                `SELECT 1
                 FROM pedidos p
                 JOIN detalle_pedido d ON d.id_pedido = p.id
                 WHERE p.id_comprador = ? AND d.id_producto = ? AND p.estado <> 'cancelado'
                 LIMIT 1`,
                [idComprador, idProducto]
            )
            return rows.length > 0
        } catch (error) {
            throw errorDB('Error al comprobar la compra del producto', error)
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

    // Un pedido por vendedor; el descuento de stock y todos los pedidos van en una sola transacción
    static async crear({ id_comprador, pedidos }) {
        let conexion
        try {
            conexion = await connection.getConnection()
            await conexion.beginTransaction()

            // Descuento atómico (WHERE stock >= cantidad) y en orden fijo para evitar bloqueos
            const porId = pedidos
                .flatMap((p) => p.items)
                .sort((a, b) => a.id_producto.localeCompare(b.id_producto))
            for (const i of porId) {
                const [r] = await conexion.query(
                    'UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?',
                    [i.cantidad, i.id_producto, i.cantidad]
                )
                if (r.affectedRows === 0) {
                    const [rows] = await conexion.query(
                        'SELECT nombre, stock FROM productos WHERE id = ?',
                        [i.id_producto]
                    )
                    const err = new Error('Stock insuficiente')
                    err.code = 'STOCK_INSUFICIENTE'
                    err.producto = rows[0]?.nombre ?? 'el producto'
                    err.disponible = rows[0]?.stock ?? 0
                    throw err
                }
            }

            const idsCreados = []
            for (const pedido of pedidos) {
                const idPedido = uuidv4()
                idsCreados.push(idPedido)

                await conexion.query('INSERT INTO pedidos SET ?', {
                    id: idPedido,
                    id_comprador,
                    total: pedido.total,
                })

                const filas = pedido.items.map((i) => [
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
            }

            await conexion.commit()
            return await Promise.all(idsCreados.map((id) => this.buscarId(id)))
        } catch (error) {
            if (conexion) await conexion.rollback()
            if (error.code === 'STOCK_INSUFICIENTE') throw error
            throw errorDB('Error al crear pedido', error)
        } finally {
            if (conexion) conexion.release()
        }
    }

    // Al cancelar, las unidades vuelven al stock
    static async actualizarEstado(id, estado, estadoAnterior) {
        let conexion
        try {
            conexion = await connection.getConnection()
            await conexion.beginTransaction()

            const [r] = await conexion.query(
                'UPDATE pedidos SET estado = ? WHERE id = ? AND estado = ?',
                [estado, id, estadoAnterior]
            )
            if (r.affectedRows === 0) {
                const err = new Error('El pedido cambió de estado')
                err.code = 'ESTADO_CAMBIADO'
                throw err
            }

            if (estado === 'cancelado') {
                await conexion.query(
                    `UPDATE productos p
                     JOIN (SELECT id_producto, SUM(cantidad) AS cantidad
                           FROM detalle_pedido WHERE id_pedido = ? GROUP BY id_producto) d
                       ON d.id_producto = p.id
                     SET p.stock = p.stock + d.cantidad`,
                    [id]
                )
            }

            await conexion.commit()
            return await this.buscarId(id)
        } catch (error) {
            if (conexion) await conexion.rollback()
            if (error.code === 'ESTADO_CAMBIADO') throw error
            throw errorDB('Error al actualizar el estado del pedido', error)
        } finally {
            if (conexion) conexion.release()
        }
    }
}

export default Pedidos
