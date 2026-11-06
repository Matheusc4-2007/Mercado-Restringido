import { peticion } from './api'

const BASE = '/api/categoria'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

export const listarCategorias = () => peticion(BASE)

export const crearCategoria = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const actualizarCategoria = (id, datos) =>
  peticion(`${BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const eliminarCategoria = (id) =>
  peticion(`${BASE}/${id}`, { method: 'DELETE' })
