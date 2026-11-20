import Favoritos from '../models/favoritos.model.js'
import Productos from '../models/productos.model.js'
import Usuarios from '../models/usuarios.model.js'
import { validate as uuidValido } from 'uuid'
import ErrorApi from '../utils/ErrorApi.js'

const validarId = (id) => {
    if (typeof id !== 'string' || !uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

// mysql devuelve decimal como texto ('10.50')
const aRespuesta = (favorito) =>
    favorito && { ...favorito, precio: Number(favorito.precio) }

const noEncontrado = (id) =>
    new ErrorApi(404, 'Favorito no encontrado', `No existe un favorito con el id ${id}`)

const usuarioNoEncontrado = (id) =>
    new ErrorApi(404, 'Usuario no encontrado', `No existe un usuario con el id ${id}`)

const yaEsFavorito = () =>
    new ErrorApi(409, 'Favorito duplicado', 'Este producto ya está en tus favoritos')

const esDuplicado = (e) => e.code === 'ER_DUP_ENTRY'

class FavoritosController {
    static async listarUsuario(idUsuario) {
        validarId(idUsuario)
        if (!(await Usuarios.buscarId(idUsuario))) throw usuarioNoEncontrado(idUsuario)

        const favoritos = await Favoritos.listarUsuario(idUsuario)
        return favoritos.map(aRespuesta)
    }

    static async crear(body) {
        if (!body || typeof body !== 'object' || Array.isArray(body))
            throw new ErrorApi(400, 'Datos inválidos', 'El cuerpo de la petición debe ser un objeto JSON')

        const errores = []
        if (typeof body.id_usuario !== 'string' || !uuidValido(body.id_usuario))
            errores.push('El id_usuario debe ser un UUID válido')
        if (typeof body.id_producto !== 'string' || !uuidValido(body.id_producto))
            errores.push('El id_producto debe ser un UUID válido')
        if (errores.length > 0) throw new ErrorApi(400, 'Datos inválidos', errores)

        const datos = { id_usuario: body.id_usuario, id_producto: body.id_producto }

        if (!(await Usuarios.buscarId(datos.id_usuario))) throw usuarioNoEncontrado(datos.id_usuario)
        if (!(await Productos.buscarId(datos.id_producto)))
            throw new ErrorApi(404, 'Producto no encontrado', `No existe un producto con el id ${datos.id_producto}`)

        if (await Favoritos.buscarUsuarioProducto(datos.id_usuario, datos.id_producto))
            throw yaEsFavorito()

        try {
            return aRespuesta(await Favoritos.crear(datos))
        } catch (e) {
            if (esDuplicado(e)) throw yaEsFavorito()
            throw e
        }
    }

    static async eliminar(id) {
        validarId(id)

        const existente = await Favoritos.buscarId(id)
        if (!existente) throw noEncontrado(id)

        return aRespuesta(await Favoritos.eliminar(id))
    }
}

export default FavoritosController
