import Productos from '../models/productos.model.js'
import ErrorApi from '../utils/ErrorApi.js'
import Usuarios from '../models/usuarios.model.js'
import Categorias from '../models/categorias.model.js'
import { validate as uuidValido } from 'uuid'

const PRECIO_MAXIMO = 99999999.99
const DESCRIPCION_MIN = 10
const DESCRIPCION_MAX = 1000

const validadores = {
    nombre(v) {
        if (typeof v !== 'string') return { error: 'El nombre debe ser texto' }
        const limpio = v.trim().replace(/\s+/g, ' ')
        if (limpio.length < 2 || limpio.length > 100)
            return { error: 'El nombre debe tener entre 2 y 100 caracteres' }
        return { valor: limpio }
    },

    descripcion(v) {
        if (typeof v !== 'string') return { error: 'La descripción debe ser texto' }
        const limpio = v.trim()
        if (limpio.length < DESCRIPCION_MIN || limpio.length > DESCRIPCION_MAX)
            return {
                error: `La descripción debe tener entre ${DESCRIPCION_MIN} y ${DESCRIPCION_MAX} caracteres`,
            }
        return { valor: limpio }
    },

    precio(v) {
        if (typeof v !== 'number' && typeof v !== 'string')
            return { error: 'El precio debe ser un número' }
        if (typeof v === 'string' && v.trim() === '')
            return { error: 'El precio debe ser un número' }

        const n = Number(v)
        if (!Number.isFinite(n)) return { error: 'El precio debe ser un número' }
        if (n < 0) return { error: 'El precio no puede ser negativo' }
        if (n > PRECIO_MAXIMO) return { error: `El precio no puede superar ${PRECIO_MAXIMO}` }
        if (Math.round(n * 100) / 100 !== n)
            return { error: 'El precio puede tener máximo 2 decimales' }

        return { valor: n }
    },

    imagen(v) {
        if (typeof v !== 'string') return { error: 'La imagen debe ser un enlace (URL)' }
        const limpio = v.trim()
        if (limpio.length === 0 || limpio.length > 500)
            return { error: 'La URL de la imagen debe tener entre 1 y 500 caracteres' }

        try {
            const url = new URL(limpio)
            if (url.protocol !== 'http:' && url.protocol !== 'https:')
                return { error: 'La imagen debe ser una URL http o https' }
        } catch {
            return { error: 'La imagen debe ser una URL válida' }
        }
        return { valor: limpio }
    },

    id_vendedor(v) {
        if (typeof v !== 'string' || !uuidValido(v))
            return { error: 'El id_vendedor debe ser un UUID válido' }
        return { valor: v }
    },

    id_categoria(v) {
        if (typeof v !== 'string' || !uuidValido(v))
            return { error: 'El id_categoria debe ser un UUID válido' }
        return { valor: v }
    },
}

const CAMPOS_CREAR = ['nombre', 'descripcion', 'precio', 'imagen', 'id_vendedor', 'id_categoria']
const CAMPOS_ACTUALIZAR = ['nombre', 'descripcion', 'precio', 'imagen', 'id_categoria']

const validarDatos = (body, { parcial }) => {
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')

    const permitidos = parcial ? CAMPOS_ACTUALIZAR : CAMPOS_CREAR
    const datos = {}
    const errores = []

    for (const campo of permitidos) {
        if (body[campo] === undefined) {
            if (!parcial) errores.push(`El campo ${campo} es obligatorio`)
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
    if (!uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

// mysql devuelve decimal como texto ('10.50')
const aRespuesta = (producto) =>
    producto && { ...producto, precio: Number(producto.precio) }

const noEncontrado = (id) =>
    new ErrorApi(404, 'Producto no encontrado', `No existe un producto con el id ${id}`)

const categoriaNoEncontrada = (id) =>
    new ErrorApi(404, 'Categoría no encontrada', `No existe una categoría con el id ${id}`)

// Comprueba que la categoría exista antes de guardar
const exigirCategoria = async (idCategoria) => {
    if (!(await Categorias.buscarId(idCategoria))) throw categoriaNoEncontrada(idCategoria)
}

const traducirErrorCategoria = (e, idCategoria) => {
    if (e.code === 'ER_NO_REFERENCED_ROW_2' && idCategoria) throw categoriaNoEncontrada(idCategoria)
    throw e
}


class ProductosController {
    static async listar({ nombre, categoria } = {}) {
        const filtros = {}

        if (nombre !== undefined) {
            const v = validadores.nombre(nombre)
            if (v.error) throw new ErrorApi(400, 'Búsqueda inválida', v.error)
            filtros.nombre = v.valor
        }

        if (categoria !== undefined) {
            const v = validadores.id_categoria(categoria)
            if (v.error) throw new ErrorApi(400, 'Filtro inválido', v.error)
            await exigirCategoria(v.valor)
            filtros.idCategoria = v.valor
        }

        const productos = await Productos.listar(filtros)
        return productos.map(aRespuesta)
    }

    static async buscarId(id) {
        validarId(id)
        const producto = await Productos.buscarId(id)
        if (!producto) throw noEncontrado(id)
        return aRespuesta(producto)
    }

    static async buscarVendedor(idVendedor) {
        validarId(idVendedor)

        const vendedor = await Usuarios.buscarId(idVendedor)
        if (!vendedor)
            throw new ErrorApi(404, 'Vendedor no encontrado', `No existe un usuario con el id ${idVendedor}`)

        const productos = await Productos.buscarVendedor(idVendedor)
        return productos.map(aRespuesta)
    }

    static async crear(body) {
        const datos = validarDatos(body, { parcial: false })

        // Solo los usuarios marcados como vendedores pueden publicar
        const vendedor = await Usuarios.buscarId(datos.id_vendedor)
        if (!vendedor)
            throw new ErrorApi(404, 'Vendedor no encontrado', `No existe un usuario con el id ${datos.id_vendedor}`)
        if (!vendedor.es_vendedor)
            throw new ErrorApi(403, 'Acción no permitida', 'El usuario no es vendedor')

        await exigirCategoria(datos.id_categoria)

        try {
            return aRespuesta(await Productos.crear(datos))
        } catch (e) {
            traducirErrorCategoria(e, datos.id_categoria)
        }
    }

    static async actualizar(id, body) {
        validarId(id)
        const datos = validarDatos(body, { parcial: true })

        const existente = await Productos.buscarId(id)
        if (!existente) throw noEncontrado(id)

        if (datos.id_categoria) await exigirCategoria(datos.id_categoria)

        try {
            return aRespuesta(await Productos.actualizar(id, datos))
        } catch (e) {
            traducirErrorCategoria(e, datos.id_categoria)
        }
    }

    static async eliminar(id) {
        validarId(id)

        const existente = await Productos.buscarId(id)
        if (!existente) throw noEncontrado(id)

        return aRespuesta(await Productos.eliminar(id))
    }
}

export default ProductosController