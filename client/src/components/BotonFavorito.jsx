import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { agregarFavorito, quitarFavorito, selectFavoritos } from '../app/favoritosSlice'

// Alterna un producto entre "favorito" y "no favorito" para el usuario con sesión.
// Necesita que la lista de favoritos esté cargada (la cargan Catalog y Favoritos).
export function BotonFavorito({ idProducto }) {
  const dispatch = useDispatch()
  const { usuario, estaLogueado } = useAuth()
  const favoritos = useSelector(selectFavoritos)

  if (!estaLogueado) return null

  const favorito = favoritos.find((f) => f.id_producto === idProducto)

  const alternar = () =>
    dispatch(
      favorito
        ? quitarFavorito(favorito.id)
        : agregarFavorito({ id_usuario: usuario.id, id_producto: idProducto })
    )

  return (
    <button
      type="button"
      className="Btn-favorito"
      aria-pressed={Boolean(favorito)}
      onClick={alternar}
    >
      {favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    </button>
  )
}
