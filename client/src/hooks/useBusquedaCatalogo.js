import { useCallback } from 'react'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'

export const RUTA_CATALOGO = '/catalogo'

/**
 * Búsqueda y filtro de categoría del catálogo, guardados en la URL:
 *   /catalogo?q=<texto>&cat=<idCategoria>
 *
 * Así el botón "atrás" y los enlaces compartidos conservan el filtro.
 *
 * Devuelve: busqueda, categoria, buscar(texto) y filtrarPorCategoria(id).
 * Se puede usar desde cualquier página: si no estás en el catálogo,
 * `buscar` te lleva a él.
 */
export function useBusquedaCatalogo() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const enCatalogo = useMatch(RUTA_CATALOGO) !== null

  const busqueda = params.get('q') ?? ''
  const categoria = params.get('cat') ?? ''

  // Desde otra página va al catálogo sin categoría; dentro del catálogo
  // busca dentro de la categoría elegida. Mientras se escribe se reemplaza
  // la entrada del historial para no llenarlo de búsquedas intermedias.
  const buscar = useCallback(
    (texto) => {
      if (!enCatalogo) {
        const search = texto ? `?${new URLSearchParams({ q: texto })}` : ''
        navigate({ pathname: RUTA_CATALOGO, search })
        return
      }
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (texto) next.set('q', texto)
          else next.delete('q')
          return next
        },
        { replace: true }
      )
    },
    [enCatalogo, navigate, setParams]
  )

  // '' = todas las categorías
  const filtrarPorCategoria = useCallback(
    (id) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (id) next.set('cat', id)
        else next.delete('cat')
        return next
      })
    },
    [setParams]
  )

  return { busqueda, categoria, buscar, filtrarPorCategoria }
}
