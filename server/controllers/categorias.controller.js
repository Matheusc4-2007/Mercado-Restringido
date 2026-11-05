import Categorias from '../models/categorias.model.js'
import { validate as uuidValido } from 'uuid'
import ErrorApi from '../utils/ErrorApi.js'

const REGEX_NOMBRE = /^[\p{L}\p{N}][\p{L}\p{N}\s&,.'/-]*$/u

const validadores = {
    nombre(v) {
        if (typeof v !== 'string') return { error: 'El nombre debe ser texto' }
        const limpio = v.trim().replace(/\s+/g, ' ')
        if (limpio.length < 2 || limpio.length > 50)
            return { error: 'El nombre debe tener entre 2 y 50 caracteres' }
        if (!REGEX_NOMBRE.test(limpio))
            return { error: 'El nombre solo puede tener letras, números, espacios y los signos & , . \' / -' }
        return { valor: limpio }
    },

    descripcion(v) {
        if (v === null) return { valor: null }
        if (typeof v !== 'string') return { error: 'La descripción debe ser texto' }
        const limpio = v.trim()
        if (limpio.length === 0) return { valor: null }
        if (limpio.length > 255)
            return { error: 'La descripción no puede superar los 255 caracteres' }
        return { valor: limpio }
    },
}

const OBLIGATORIOS = ['nombre']
const PERMITIDOS = [...OBLIGATORIOS, 'descripcion']

const validarDatos = (body, { parcial }) => {
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')

    const datos = {}
    const errores = []

    for (const campo of PERMITIDOS) {
        if (body[campo] === undefined) {
            if (!parcial && OBLIGATORIOS.includes(campo))
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
    if (!uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

const aRespuesta = (categoria) =>
    categoria && { ...categoria, total_productos: Number(categoria.total_productos) }

const esDuplicado = (e) => e.code === 'ER_DUP_ENTRY'

const noEncontrada = (id) =>
    new ErrorApi(404, 'Categoría no encontrada', `No existe una categoría con el id ${id}`)

const nombreDuplicado = (nombre) =>
    new ErrorApi(409, 'Nombre duplicado', `Ya existe una categoría llamada "${nombre}"`)

class CategoriasController {
    static async todas() {
        const categorias = await Categorias.todas()
        return categorias.map(aRespuesta)
    }

    static async buscarId(id) {
        validarId(id)
        const categoria = await Categorias.buscarId(id)
        if (!categoria) throw noEncontrada(id)
        return aRespuesta(categoria)
    }

    static async crear(body) {
        const datos = validarDatos(body, { parcial: false })

        if (await Categorias.buscarNombre(datos.nombre)) throw nombreDuplicado(datos.nombre)

        try {
            return aRespuesta(await Categorias.crear(datos))
        } catch (e) {
            if (esDuplicado(e)) throw nombreDuplicado(datos.nombre)
            throw e
        }
    }

    static async actualizar(id, body) {
        validarId(id)
        const datos = validarDatos(body, { parcial: true })

        const existente = await Categorias.buscarId(id)
        if (!existente) throw noEncontrada(id)

        // Solo es duplicado si el nombre lo tiene OTRA categoría
        // (cambiar "ropa" por "Ropa" en la misma categoría sí está permitido)
        if (datos.nombre) {
            const otra = await Categorias.buscarNombre(datos.nombre)
            if (otra && otra.id !== id) throw nombreDuplicado(datos.nombre)
        }

        try {
            return aRespuesta(await Categorias.actualizar(id, datos))
        } catch (e) {
            if (esDuplicado(e)) throw nombreDuplicado(datos.nombre)
            throw e
        }
    }

    static async eliminar(id) {
        validarId(id)

        const existente = await Categorias.buscarId(id)
        if (!existente) throw noEncontrada(id)

        try {
            return aRespuesta(await Categorias.eliminar(id))
        } catch (e) {
            if (e.code === 'ER_ROW_IS_REFERENCED_2')
                throw new ErrorApi(409, 'No se puede eliminar', 'La categoría tiene productos asociados')
            throw e
        }
    }
}

export default CategoriasController
