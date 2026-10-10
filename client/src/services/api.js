export class ApiError extends Error {
  constructor(mensaje, detalles = [], status = 0) {
    super(mensaje)
    this.detalles = detalles
    this.status = status
  }
}

export async function peticion(url, opciones) {
  let res
  try {
    res = await fetch(url, opciones)
  } catch {
    throw new ApiError('No se pudo conectar con el servidor')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // el backend responde { error, detalle } y detalle puede ser texto o lista
    throw new ApiError(
      data?.error ?? 'Error inesperado',
      [].concat(data?.detalle ?? []),
      res.status
    )
  }
  return data
}