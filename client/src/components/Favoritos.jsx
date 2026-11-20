import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useCargaLista } from '../hooks/useCargaLista'
import {
  cargarFavoritos,
  reiniciarFavoritos,
  selectFavoritos,
  selectFavoritosCargando,
  selectFavoritosError,
} from '../app/favoritosSlice'
import { Product } from './Product'
import { MensajeError } from './admin/MensajeError'
import loading from '../assets/loading-icon.svg'

export function Favoritos() {
  const { usuario } = useAuth()
  const favoritos = useSelector(selectFavoritos)
  const cargando = useSelector(selectFavoritosCargando)
  const error = useSelector(selectFavoritosError)

  // Misma identidad del objeto entre renders (ver useCargaLista)
  const filtro = useMemo(() => ({ idUsuario: usuario.id }), [usuario.id])
  useCargaLista(cargarFavoritos, reiniciarFavoritos, filtro)

  return (
    <section className="Favoritos-section">
      <h2>Mis favoritos</h2>

      <MensajeError error={error} />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando favoritos...</p>
        </>
      ) : favoritos.length === 0 ? (
        <p>Aún no tienes productos favoritos</p>
      ) : (
        <div className="Products-container">
          {favoritos.map((f) => (
            <Product
              key={f.id}
              id={f.id_producto}
              name={f.nombre}
              price={f.precio.toFixed(2)}
              seller={f.vendedor}
              sellerId={f.id_vendedor}
              img={f.imagen}
              category={f.categoria}
              description={f.descripcion}
            />
          ))}
        </div>
      )}
    </section>
  )
}
