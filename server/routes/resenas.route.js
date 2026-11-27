import { Router } from 'express'
import control from '../controllers/resenas.controller.js'
import ErrorApi from '../utils/ErrorApi.js'
import { verificarToken, permitirRoles } from '../middlewares/auth.js';

const router = Router()

const responderError = (res, e) => {
    if (e instanceof ErrorApi) {
        return res.status(e.status).json({ error: e.error, detalle: e.detalle })
    }
    console.error(e)
    res.status(500).json({ error: 'Error interno del servidor', detalle: e.message })
}

// GET /api/resena                  -> todas las reseñas
// GET /api/resena?producto=<id>    -> reseñas de un producto
router.get('/', async (req, res) => {
    try {
        const { producto } = req.query
        res.json(await control.listar({ producto }))
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

router.post('/', verificarToken, async (req, res) => {
    try {
        res.status(201).json(await control.crear(req.body))
    } catch (e) {
        responderError(res, e)
    }
})

router.put('/:id', verificarToken, async (req, res) => {
    try {
        res.json(await control.actualizar(req.params.id, req.body))
    } catch (e) {
        responderError(res, e)
    }
})

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        res.json(await control.eliminar(req.params.id))
    } catch (e) {
        responderError(res, e)
    }
})

export default router
