import { Router } from 'express'
import control from '../controllers/pedidos.controller.js'
import ErrorApi from '../utils/ErrorApi.js'

const router = Router()

const responderError = (res, e) => {
    if (e instanceof ErrorApi) {
        return res.status(e.status).json({ error: e.error, detalle: e.detalle })
    }
    console.error(e)
    res.status(500).json({ error: 'Error interno del servidor', detalle: e.message })
}

// GET /api/pedido                  -> todos los pedidos
// GET /api/pedido?comprador=<id>   -> pedidos de un comprador
router.get('/', async (req, res) => {
    try {
        const { comprador } = req.query
        res.json(await control.listar({ comprador }))
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

// Los pedidos no se editan ni se borran: solo cambian de estado
router.put('/:id/estado', async (req, res) => {
    try {
        res.json(await control.actualizarEstado(req.params.id, req.body))
    } catch (e) {
        responderError(res, e)
    }
})

export default router
