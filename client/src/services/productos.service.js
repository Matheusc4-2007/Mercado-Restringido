import { peticion } from './api'

const BASE = '/api/producto'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Filtros opcionales y combinables: ?nombre= (texto) y ?categoria= (id).
// Sin filtros trae todos.
export const listarProductos = ({ nombre, idCategoria } = {}) => {
  const params = new URLSearchParams()
  if (nombre) params.set('nombre', nombre)
  if (idCategoria) params.set('categoria', idCategoria)
  const consulta = params.toString()
  return peticion(consulta ? `${BASE}?${consulta}` : BASE)
}

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