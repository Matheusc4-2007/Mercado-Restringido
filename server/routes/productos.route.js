import { Router } from 'express'
import control from '../controllers/productos.controller.js'
import ErrorApi from '../utils/ErrorApi.js'

const router = Router()

const responderError = (res, e) => {
    if(e instanceof ErrorApi){
        return res.status(e.status).json({error: e.error , detalle: e.detalle})
    }
    console.error(e)
    res.status(500).json({ error: 'Error interno del server' , detalle: e.message  })
}

router.get('/', async (req, res) => {
    try {
        res.json(await control.todos())
    } catch (e) {
        responderError(res, e)
    }
})

router.get('/vendedor/:idVendedor', async (req, res) => {
    try {
        res.json(await control.buscarVendedor(req.params.idVendedor))
    } catch (e) {
        responderError(res, e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        res.json(await control.buscarId(req.params.id))
    } catch (e) {
        responderError(res, e)
    }
})

router.post('/', async (req, res) => {
    try {
        res.status(201).json(await control.crear(req.body))
    } catch (e) {
        responderError(res, e)
    }
})

router.put('/:id', async (req, res) => {
    try {
        res.json(await control.actualizar(req.params.id, req.body))
    } catch (e) {
        responderError(res, e)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        res.json(await control.eliminar(req.params.id))
    } catch (e) {
        responderError(res, e)
    }
})

export default router