import { peticion } from './api'

const BASE = '/api/pedido'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Sin filtro trae todos los pedidos (admin); con idComprador, solo los de ese usuario
export const listarPedidos = ({ idComprador } = {}) =>
  peticion(idComprador ? `${BASE}?comprador=${encodeURIComponent(idComprador)}` : BASE)

// datos: { id_comprador, items: [{ id_producto, cantidad }] }
export const crearPedido = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const cambiarEstadoPedido = (id, estado) =>
  peticion(`${BASE}/${id}/estado`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ estado }),
  })
