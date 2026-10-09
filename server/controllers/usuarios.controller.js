import Usuarios from '../models/usuarios.model.js'
import { validate as uuidValido } from 'uuid'
import ErrorApi from '../utils/ErrorApi.js'

const EDAD_MINIMA = 0

const REGEX_CEDULA= /^\d{5,15}$/
const REGEX_NOMBRE = /^\p{L}[\p{L}\s'-]*$/u
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/

const validarNombre = (v,etiqueta)=>{
    if (typeof v !== 'string') return {error: `El ${etiqueta} debe ser texto`}
    const limpio = v.trim().replace(/\s+/g, ' ')
    if (limpio.length < 2 || limpio.length > 50)
        return { error: `El ${etiqueta} debe tener entre 2 y 50 caracteres` }
    if(!REGEX_NOMBRE.test(limpio))
        return {error: `El ${etiqueta} solo puede tener letras, espacios, guiones y apóstrofes`}
    return {valor : limpio}
}

const validadores = {
    cedula(v){
       if (typeof v !== 'string' && typeof v !== 'number')
            return { error: 'La cédula debe ser texto o número' }
        const limpio = String(v).trim()
        if (!REGEX_CEDULA.test(limpio))
            return { error: 'La cédula debe tener entre 5 y 15 dígitos' }
        return { valor: limpio } 
    },

    nombre: (v) => validarNombre(v, 'nombre'),
    apellido: (v) => validarNombre(v, 'apellido'),

    fecha_nacimiento(v){
        if (typeof v !== 'string' || !REGEX_FECHA.test(v.trim()))
            return { error: 'La fecha de nacimiento debe tener formato AAAA-MM-DD' }

        const limpio = v.trim()
        const [a, m, d] = limpio.split('-').map(Number)
        const fecha = new Date(Date.UTC(a, m - 1, d))

        const esReal =
            fecha.getUTCFullYear() === a &&
            fecha.getUTCMonth() === m - 1 &&
            fecha.getUTCDate() === d
        if (!esReal || a < 1900)
            return { error: 'La fecha de nacimiento no es una fecha válida' }

        const hoy = new Date()
        const limite = new Date(
            Date.UTC(hoy.getUTCFullYear() - EDAD_MINIMA, hoy.getUTCMonth(), hoy.getUTCDate())
        )
        if (fecha > limite)
            return {
                error:
                    EDAD_MINIMA > 0
                        ? `Debe tener al menos ${EDAD_MINIMA} años`
                        : 'La fecha de nacimiento no puede ser futura',
            }

        return { valor: limpio }
    },

    es_vendedor(v) {
        if (typeof v === 'boolean') return { valor: v }
        if (v === 1 || v === 0 || v === '1' || v === '0') return { valor: Number(v) === 1 }
        if (v === 'true' || v === 'false') return { valor: v === 'true' }
        return { error: 'es_vendedor debe ser verdadero o falso' }
    }
}

const OBLIGATORIOS = ['cedula', 'nombre', 'apellido', 'fecha_nacimiento']
const PERMITIDOS = [...OBLIGATORIOS, 'es_vendedor']

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

    if (!parcial) datos.es_vendedor ??= false

    return datos
}

const validarId = (id) => {
    if (!uuidValido(id))
        throw new ErrorApi(400, 'ID inválido', 'El ID debe ser un UUID válido')
}

// respuestas mysql y transformacion de es_vendedor

const aRespuesta = (usuario) =>
    usuario && { ...usuario, es_vendedor: Boolean(usuario.es_vendedor) }

const esDuplicado = (e) => e.code === 'ER_DUP_ENTRY'

const noEncontrado = (id) =>
    new ErrorApi(404, 'Usuario no encontrado', `No existe un usuario con el id ${id}`)

const cedulaDuplicada = (cedula) =>
    new ErrorApi(409, 'Cédula duplicada', `Ya existe un usuario con la cédula ${cedula}`)

class UsuariosController{
    
    static async todos(){
        const usuarios = await Usuarios.todos()
        return usuarios.map(aRespuesta)
    }

    static  async buscarId(id){
        validarId(id)
        const usuario = await Usuarios.buscarId(id)
        if(!usuario) throw noEncontrado(id)
        return aRespuesta(usuario)
    }

    static async buscarCedula(cedula){
        const v = validadores.cedula(cedula)
        if (v.error) throw new ErrorApi(400 , 'Cedula invalida', v.error);
        
        const usuario = await Usuarios.buscarCedula(v.valor)
        if (!usuario)
            throw new ErrorApi(404 ,'Usuario no encontrado' , `No existe usuario con la cédula ${v.valor} `)
        return aRespuesta(usuario)
    }
        
    static async crear(body){
        const datos =  validarDatos(body , {parcial: false})
        
        if(await Usuarios.buscarCedula(datos.cedula)) throw cedulaDuplicada(datos.cedula)
        
        try {
            return aRespuesta(await Usuarios.crear(datos))
        }
        catch(e){
            if(esDuplicado(e)) throw cedulaDuplicada(datos.cedula)
                throw e
        }
    }

    static async actualizar(id , body){
        validarId(id)
        const datos = validarDatos(body,{parcial : true})
        
        const existente = await Usuarios.buscarId(id)
        if(!existente) throw noEncontrado(id)
        
        if (datos.cedula && datos.cedula !== existente.cedula){
            if (await Usuarios.buscarCedula(datos.cedula)) throw cedulaDuplicada(datos.cedula)
        }

        try{
            return aRespuesta (await Usuarios.actualizar(id,datos))
        }
        catch(e){
            if (esDuplicado(e)) throw cedulaDuplicada(datos.cedula);
            throw e
        }
    }

    static async eliminar(id){
        validarId(id)

        const existente = await Usuarios.buscarId(id)
        if(!existente) throw noEncontrado(id)
        

        try{
            return aRespuesta(await Usuarios.eliminar(id))
        }
        catch(e){ 
            if (e.code === 'ER_ROW_IS_REFERENCED_2')
                throw new ErrorApi(409, 'No se puede eliminar', 'El usuario tiene productos publicados')
            throw e
        }
    }
}

export default UsuariosController