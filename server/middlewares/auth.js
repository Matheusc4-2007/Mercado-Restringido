import 'dotenv/config'
import jwt from 'jsonwebtoken'
import ErrorApi from '../utils/ErrorApi.js'

export const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return next(new ErrorApi(401, 'No autenticado', 'Token requerido'))
    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        next(new ErrorApi(401, 'Sesión inválida o expirada', 'Inicia sesión nuevamente'))
    }
}

export const permitirRoles = (...roles) => (req, res, next) =>
    roles.includes(req.usuario?.rol)
        ? next()
        : next(new ErrorApi(403, 'Sin permiso', 'No tienes permiso para esta acción'))