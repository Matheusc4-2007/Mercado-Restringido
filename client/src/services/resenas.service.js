import { peticion } from './api'

const BASE = '/api/resena'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Sin filtro trae todas las reseñas (admin); con idProducto, solo las de ese producto
export const listarResenas = ({ idProducto } = {}) =>
  peticion(idProducto ? `${BASE}?producto=${encodeURIComponent(idProducto)}` : BASE)

export const crearResena = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const actualizarResena = (id, datos) =>
  peticion(`${BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const eliminarResena = (id) =>
  peticion(`${BASE}/${id}`, { method: 'DELETE' })
