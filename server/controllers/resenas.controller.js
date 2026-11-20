import Resenas from '../models/resenas.model.js'
import Productos from '../models/productos.model.js'
import Usuarios from '../models/usuarios.model.js'
import { validate as uuidValido } from 'uuid'
import ErrorApi from '../utils/ErrorApi.js'

const COMENTARIO_MAX = 500

const validadores = {
    id_producto(v) {
        if (typeof v !== 'string' || !uuidValido(v))
            return { error: 'El id_producto debe ser un UUID válido' }
        return { valor: v }
    },

    id_usuario(v) {
        if (typeof v !== 'string' || !uuidValido(v))
            return { error: 'El id_usuario debe ser un UUID válido' }
        return { valor: v }
    },

    calificacion(v) {
        if (typeof v !== 'number' && typeof v !== 'string')
            return { error: 'La calificación debe ser un número del 1 al 5' }
        if (typeof v === 'string' && v.trim() === '')
            return { error: 'La calificación debe ser un número del 1 al 5' }

        const n = Number(v)
        if (!Number.isInteger(n) || n < 1 || n > 5)
            return { error: 'La calificación debe ser un número entero del 1 al 5' }
        return { valor: n }
    },

    comentario(v) {
        if (v === null) return { valor: null }
        if (typeof v !== 'string') return { error: 'El comentario debe ser texto' }
        const limpio = v.trim()
        if (limpio.length === 0) return { valor: null }
        if (limpio.length > COMENTARIO_MAX)
            return { error: `El comentario no puede superar los ${COMENTARIO_MAX} caracteres` }
        return { valor: limpio }
    },
}

const OBLIGATORIOS_CREAR = ['id_producto', 'id_usuario', 'calificacion']
const CAMPOS_CREAR = [...OBLIGATORIOS_CREAR, 'comentario']
// Al editar solo se cambia el contenido de la reseña, no a quién pertenece
const CAMPOS_ACTUALIZAR = ['calificacion', 'comentario']

const validarDatos = (body, { parcial }) => {
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')

    const permitidos = parcial ? CAMPOS_ACTUALIZAR : CAMPOS_CREAR
    const datos = {}
    const errores = []

    for (const campo of permitidos) {
        if (body[campo] === undefined) {
            if (!parcial && OBLIGATORIOS_CREAR.includes(campo))
                errores.push(`El campo ${campo} es obligatorio`)
            continue
        }
        const resultado = validadores[campo](body[campo])
        if (resultado.error) errores.push(resultado.error)
        else datos[campo] = resultado.valor
    }

    if (errores.length > 0) throw new ErrorApi(400, 'Datos inválidos', errores)

    if (parcial && Object.keys(datos).length === 0)
        throw new ErrorApi(400, 'Datos inválidos', 'No se enviaron campos para actualizar')

    return datos
}

const validarId = (id) => {
    if (typeof id !== 'string' || !uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

const noEncontrada = (id) =>
    new ErrorApi(404, 'Reseña no encontrada', `No existe una reseña con el id ${id}`)

const productoNoEncontrado = (id) =>
    new ErrorApi(404, 'Producto no encontrado', `No existe un producto con el id ${id}`)

const yaReseno = () =>
    new ErrorApi(409, 'Reseña duplicada', 'Ya reseñaste este producto, edita tu reseña existente')

const esDuplicado = (e) => e.code === 'ER_DUP_ENTRY'

class ResenasController {
    static async listar({ producto } = {}) {
        const filtros = {}

        if (producto !== undefined) {
            validarId(producto)
            if (!(await Productos.buscarId(producto))) throw productoNoEncontrado(producto)
            filtros.idProducto = producto
        }

        return await Resenas.listar(filtros)
    }

    static async buscarId(id) {
        validarId(id)
        const resena = await Resenas.buscarId(id)
        if (!resena) throw noEncontrada(id)
        return resena
    }

    static async crear(body) {
        const datos = validarDatos(body, { parcial: false })

        const producto = await Productos.buscarId(datos.id_producto)
        if (!producto) throw productoNoEncontrado(datos.id_producto)

        const usuario = await Usuarios.buscarId(datos.id_usuario)
        if (!usuario)
            throw new ErrorApi(404, 'Usuario no encontrado', `No existe un usuario con el id ${datos.id_usuario}`)

        if (producto.id_vendedor === datos.id_usuario)
            throw new ErrorApi(403, 'Acción no permitida', 'No puedes reseñar tu propio producto')

        if (await Resenas.buscarProductoUsuario(datos.id_producto, datos.id_usuario)) throw yaReseno()

        try {
            return await Resenas.crear(datos)
        } catch (e) {
            if (esDuplicado(e)) throw yaReseno()
            throw e
        }
    }

    static async actualizar(id, body) {
        validarId(id)
        const datos = validarDatos(body, { parcial: true })

        const existente = await Resenas.buscarId(id)
        if (!existente) throw noEncontrada(id)

        return await Resenas.actualizar(id, datos)
    }

    static async eliminar(id) {
        validarId(id)

        const existente = await Resenas.buscarId(id)
        if (!existente) throw noEncontrada(id)

        return await Resenas.eliminar(id)
    }
}

export default ResenasController
