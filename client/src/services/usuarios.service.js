import { peticion } from './api'

const BASE = '/api/usuario'
const JSON_HEADERS = { 'Content-Type': 'application/json'}

export const buscarPorCedula = (cedula) =>
  peticion(`${BASE}/cedula/${encodeURIComponent(cedula.trim())}`)

export const listarUsuarios = () => peticion(BASE)

export const crearUsuario = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
})

export const actualizarUsuario = (id, datos) =>
  peticion(`${BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(datos),
  })

export const eliminarUsuario = (id) =>
  peticion(`${BASE}/${id}`, { method: 'DELETE' })