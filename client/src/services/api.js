export class ApiError extends Error {
  constructor(mensaje, detalles = [], status = 0) {
    super(mensaje)
    this.detalles = detalles
    this.status = status
  }
}

export async function peticion(url, opciones = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...opciones.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(url, { ...opciones, headers })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/'
    }
    throw new ApiError(data?.error ?? 'Error inesperado', [].concat(data?.detalle ?? []), res.status)
  }
  return data
}