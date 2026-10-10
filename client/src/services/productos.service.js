import { peticion } from './api'

const BASE = '/api/producto'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Con texto filtra por nombre (?nombre=), sin texto trae todos
export const listarProductos = (nombre) =>
  peticion(nombre ? `${BASE}?nombre=${encodeURIComponent(nombre)}` : BASE)

export const crearProducto = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const actualizarProducto = (id, datos) =>
  peticion(`${BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const eliminarProducto = (id) =>
  peticion(`${BASE}/${id}`, { method: 'DELETE' })