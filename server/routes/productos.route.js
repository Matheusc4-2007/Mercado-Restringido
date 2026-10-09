import { Router } from 'express'
import control from '../controllers/productos.controller.js'

const router = Router()

const responderError = (res, e) => {
    res.status(500).json({ error: e.message, code: e.code ?? null })
}

router.get('/', async (req, res) => {
    try {
        res.json(await control.todos())
    } catch (e) {
        responderError(res, e)
    }
})

// va ANTES de '/:id', si no Express toma "vendedor" como un id
router.get('/vendedor/:idVendedor', async (req, res) => {
    try {
        res.json(await control.buscarVendedor(req.params.idVendedor))
    } catch (e) {
        responderError(res, e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const producto = await control.buscarId(req.params.id)
        res.status(producto ? 200 : 404).json(producto ?? { error: 'No encontrado' })
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
        const producto = await control.actualizar(req.params.id, req.body)
        res.status(producto ? 200 : 404).json(producto ?? { error: 'No encontrado o sin cambios' })
    } catch (e) {
        responderError(res, e)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const producto = await control.eliminar(req.params.id)
        res.status(producto ? 200 : 404).json(producto ?? { error: 'No encontrado' })
    } catch (e) {
        responderError(res, e)
    }
})

export default router