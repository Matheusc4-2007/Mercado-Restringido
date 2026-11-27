import { Router } from 'express';
import control from '../controllers/usuarios.controller.js';
import ErrorApi from '../utils/ErrorApi.js';
import { verificarToken, permitirRoles } from '../middlewares/auth.js';

const router = Router();

const responderError = (res, e) => {
    if (e instanceof ErrorApi) {
        return res
            .status(e.status)
            .json({ error: e.error, detalle: e.detalle });
    }
    console.error(e);
    res.status(500).json({
        error: 'Error interno del servidor',
        detalle: e.message,
    });
};

router.post('/login', async (req, res) => {
    try {
        res.json(await control.login(req.body?.cedula));
    } catch (e) {
        responderError(res, e);
    }
});

router.get('/', verificarToken, permitirRoles('admin'), async (req, res) => {
    try {
        res.json(await control.todos());
    } catch (e) {
        responderError(res, e);
    }
});

router.get('/:id', verificarToken, async (req, res) => {
    try {
        res.json(await control.buscarId(req.params.id));
    } catch (e) {
        responderError(res, e);
    }
});

router.post('/', async (req, res) => {
    try {
        res.status(201).json(await control.crear(req.body));
    } catch (e) {
        responderError(res, e);
    }
});

router.delete(
    '/:id',
    verificarToken,
    permitirRoles('admin'),
    async (req, res) => {
        try {
            res.json(await control.eliminar(req.params.id));
        } catch (e) {
            responderError(res, e);
        }
    },
);

router.put('/:id', verificarToken, permitirRoles('admin'), async (req, res) => {
    try {
        res.json(await control.actualizar(req.params.id, req.body));
    } catch (e) {
        responderError(res, e);
    }
});

export default router;
