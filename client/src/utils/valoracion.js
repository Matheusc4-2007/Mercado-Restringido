export const textoValoracion = (promedio, total) => {
  if (!total) return 'Sin reseñas'
  return `★ ${promedio.toFixed(1)} (${total} ${total === 1 ? 'reseña' : 'reseñas'})`
}
