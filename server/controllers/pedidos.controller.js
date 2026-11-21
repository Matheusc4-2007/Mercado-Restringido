import Pedidos from '../models/pedidos.model.js'
import Usuarios from '../models/usuarios.model.js'
import Productos from '../models/productos.model.js'
import { validate as uuidValido } from 'uuid'
import ErrorApi from '../utils/ErrorApi.js'

const MAX_LINEAS = 50
const MAX_CANTIDAD = 99

const ESTADOS = ['pendiente', 'enviado', 'entregado', 'cancelado']

// A qué estados se puede pasar desde cada uno
const TRANSICIONES = {
    pendiente: ['enviado', 'cancelado'],
    enviado: ['entregado'],
    entregado: [],
    cancelado: [],
}

const validarId = (id) => {
    if (typeof id !== 'string' || !uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

// mysql devuelve decimal como texto ('10.50')
const aRespuesta = (pedido) =>
    pedido && {
        ...pedido,
        total: Number(pedido.total),
        detalles: pedido.detalles.map((d) => ({
            ...d,
            precio_unitario: Number(d.precio_unitario),
            subtotal: Math.round(Number(d.precio_unitario) * 100 * d.cantidad) / 100,
        })),
    }

const noEncontrado = (id) =>
    new ErrorApi(404, 'Pedido no encontrado', `No existe un pedido con el id ${id}`)

const stockInsuficiente = (nombre, disponible) =>
    new ErrorApi(
        409,
        'Stock insuficiente',
        `No hay suficientes unidades de "${nombre}" (disponibles: ${disponible})`
    )

const usuarioNoEncontrado = (id) =>
    new ErrorApi(404, 'Usuario no encontrado', `No existe un usuario con el id ${id}`)

// Valida el cuerpo de POST y junta las líneas repetidas de un mismo producto
const validarPedido = (body) => {
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')

    const errores = []

    if (typeof body.id_comprador !== 'string' || !uuidValido(body.id_comprador))
        errores.push('El id_comprador debe ser un UUID válido')

    const porProducto = new Map()

    if (!Array.isArray(body.items) || body.items.length === 0) {
        errores.push('El pedido debe tener al menos un producto (items)')
    } else if (body.items.length > MAX_LINEAS) {
        errores.push(`El pedido no puede tener más de ${MAX_LINEAS} líneas`)
    } else {
        body.items.forEach((item, i) => {
            const linea = `items[${i}]`
            if (!item || typeof item !== 'object') {
                errores.push(`${linea} debe ser un objeto`)
                return
            }
            if (typeof item.id_producto !== 'string' || !uuidValido(item.id_producto)) {
                errores.push(`${linea}: el id_producto debe ser un UUID válido`)
                return
            }
            if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
                errores.push(`${linea}: la cantidad debe ser un entero mayor a 0`)
                return
            }
            porProducto.set(
                item.id_producto,
                (porProducto.get(item.id_producto) ?? 0) + item.cantidad
            )
        })

        for (const [id, cantidad] of porProducto) {
            if (cantidad > MAX_CANTIDAD)
                errores.push(`No se pueden pedir más de ${MAX_CANTIDAD} unidades del producto ${id}`)
        }
    }

    if (errores.length > 0) throw new ErrorApi(400, 'Datos inválidos', errores)

    return {
        id_comprador: body.id_comprador,
        items: [...porProducto].map(([id_producto, cantidad]) => ({ id_producto, cantidad })),
    }
}

class PedidosController {
    static async listar({ comprador, vendedor } = {}) {
        const filtros = {}

        if (comprador !== undefined) {
            validarId(comprador)
            if (!(await Usuarios.buscarId(comprador))) throw usuarioNoEncontrado(comprador)
            filtros.idComprador = comprador
        }

        if (vendedor !== undefined) {
            validarId(vendedor)
            if (!(await Usuarios.buscarId(vendedor))) throw usuarioNoEncontrado(vendedor)
            filtros.idVendedor = vendedor
        }

        const pedidos = await Pedidos.listar(filtros)
        return pedidos.map(aRespuesta)
    }

    static async compro({ comprador, producto } = {}) {
        validarId(comprador)
        validarId(producto)

        if (!(await Usuarios.buscarId(comprador))) throw usuarioNoEncontrado(comprador)
        if (!(await Productos.buscarId(producto)))
            throw new ErrorApi(404, 'Producto no encontrado', `No existe un producto con el id ${producto}`)

        return { compro: await Pedidos.compro(comprador, producto) }
    }

    static async buscarId(id) {
        validarId(id)
        const pedido = await Pedidos.buscarId(id)
        if (!pedido) throw noEncontrado(id)
        return aRespuesta(pedido)
    }

    static async crear(body) {
        const datos = validarPedido(body)

        const comprador = await Usuarios.buscarId(datos.id_comprador)
        if (!comprador) throw usuarioNoEncontrado(datos.id_comprador)

        // El precio y el total salen SIEMPRE de la base de datos, nunca del cliente.
        // Los cálculos se hacen en centavos para evitar errores de decimales.
        // Un pedido por vendedor: cada uno gestiona el estado de lo suyo.
        const porVendedor = new Map()

        for (const { id_producto, cantidad } of datos.items) {
            const producto = await Productos.buscarId(id_producto)
            if (!producto)
                throw new ErrorApi(404, 'Producto no encontrado', `No existe un producto con el id ${id_producto}`)
            if (producto.id_vendedor === datos.id_comprador)
                throw new ErrorApi(403, 'Acción no permitida', `No puedes comprar tu propio producto "${producto.nombre}"`)

            if (producto.stock < cantidad) throw stockInsuficiente(producto.nombre, producto.stock)

            const precioCentavos = Math.round(Number(producto.precio) * 100)
            const grupo = porVendedor.get(producto.id_vendedor) ?? { totalCentavos: 0, items: [] }
            grupo.totalCentavos += precioCentavos * cantidad
            grupo.items.push({ id_producto, cantidad, precio_unitario: precioCentavos / 100 })
            porVendedor.set(producto.id_vendedor, grupo)
        }

        try {
            const creados = await Pedidos.crear({
                id_comprador: datos.id_comprador,
                pedidos: [...porVendedor.values()].map((g) => ({
                    total: g.totalCentavos / 100,
                    items: g.items,
                })),
            })
            return creados.map(aRespuesta)
        } catch (e) {
            if (e.code === 'STOCK_INSUFICIENTE') throw stockInsuficiente(e.producto, e.disponible)
            throw e
        }
    }

    static async actualizarEstado(id, body) {
        validarId(id)

        if (!body || typeof body !== 'object' || Array.isArray(body))
            throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')
        if (typeof body.estado !== 'string' || !ESTADOS.includes(body.estado))
            throw new ErrorApi(400, 'Datos inválidos', `El estado debe ser uno de: ${ESTADOS.join(', ')}`)

        const existente = await Pedidos.buscarId(id)
        if (!existente) throw noEncontrado(id)

        if (body.id_vendedor !== undefined) {
            validarId(body.id_vendedor)
            if (!existente.detalles.every((d) => d.id_vendedor === body.id_vendedor))
                throw new ErrorApi(403, 'Acción no permitida', 'Este pedido no es tuyo')
            if (body.estado === 'cancelado')
                throw new ErrorApi(403, 'Acción no permitida', 'Los vendedores no pueden cancelar pedidos')
        }

        if (!TRANSICIONES[existente.estado].includes(body.estado))
            throw new ErrorApi(
                409,
                'Cambio de estado no permitido',
                `No se puede pasar un pedido de "${existente.estado}" a "${body.estado}"`
            )

        try {
            return aRespuesta(await Pedidos.actualizarEstado(id, body.estado, existente.estado))
        } catch (e) {
            if (e.code === 'ESTADO_CAMBIADO')
                throw new ErrorApi(
                    409,
                    'Cambio de estado no permitido',
                    'El pedido cambió de estado mientras tanto, recarga la lista'
                )
            throw e
        }
    }
}

export default PedidosController
