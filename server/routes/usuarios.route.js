import {Router} from 'express'
import control from '../controllers/usuarios.controller.js'

const router = Router()

const responderError = (res ,e) => {
    res.status(500).json({error : e.message , code: e.code ?? null})
}

router.get('/' , async (req , res) =>{ 
    try{
        res.json(await control.todos())
    }
    catch(e){
        responderError(res, e)
    }
})

router.get('/cedula/:cedula' , async (req , res) => {
    try{
        const usuario = await control.buscarCedula(req.params.cedula)
        res.status(usuario ? 200 : 404).json(usuario ?? {error: 'No encontrado'})
    }
    catch(e){
        responderError(res, e)
    }
})

router.get('/:id' , async (req , res) => {
    try{
        const usuario = await control.buscarId(req.params.id)
        res.status(usuario ? 200 : 404).json(usuario ?? {error: 'No encontrado'})
    }
    catch(e){
        responderError(res, e)
    }
})

router.post('/' , async(req ,res) => {
    try{
        res.status(201).json(await control.crear(req.body))
    }
    catch(e){
        responderError(res , e)
    }
})

router.delete('/:id' , async (req , res) => {
    try{
        const usuario = await control.eliminar(req.params.id)
        res.status(usuario ? 200 : 404).json(usuario ?? {error: 'No encontrado'})
    }
    catch(e){
        responderError(res, e)
    }
})

router.put('/:id' , async (req , res) => {
    try{
        const usuario = await control.actualizar(req.params.id , req.body)
        res.status(usuario ? 200 : 404).json(usuario ?? {error: 'No encontrado o sin cambios'})
    }
    catch(e){
        responderError(res, e)
    }
})

export default router