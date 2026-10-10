import { peticion } from './api'

const BASE = '/api/usuario'

export const buscarPorCedula = (cedula) =>
  peticion(`${BASE}/cedula/${encodeURIComponent(cedula.trim())}`)

export const crearUsuario = (datos) =>
  peticion(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
})