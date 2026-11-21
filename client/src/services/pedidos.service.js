import { peticion } from './api'

const BASE = '/api/pedido'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Sin filtro trae todos los pedidos (admin); con idComprador, solo los de ese usuario
export const listarPedidos = ({ idComprador, idVendedor } = {}) => {
  const params = new URLSearchParams()
  if (idComprador) params.set('comprador', idComprador)
  if (idVendedor) params.set('vendedor', idVendedor)
  const consulta = params.toString()
  return peticion(consulta ? `${BASE}?${consulta}` : BASE)
}

// datos: { id_comprador, items: [{ id_producto, cantidad }] }
export const crearPedido = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const consultarCompra = ({ idComprador, idProducto }) =>
  peticion(
    `${BASE}/compra?comprador=${encodeURIComponent(idComprador)}&producto=${encodeURIComponent(idProducto)}`
  )

export const cambiarEstadoPedido = (id, estado, idVendedor) =>
  peticion(`${BASE}/${id}/estado`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(idVendedor ? { estado, id_vendedor: idVendedor } : { estado }),
  })
