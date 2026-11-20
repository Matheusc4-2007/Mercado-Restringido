import { peticion } from './api'

const BASE = '/api/favorito'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

export const listarFavoritos = (idUsuario) => peticion(`${BASE}/usuario/${idUsuario}`)

// datos: { id_usuario, id_producto }
export const agregarFavorito = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const quitarFavorito = (id) =>
  peticion(`${BASE}/${id}`, { method: 'DELETE' })
