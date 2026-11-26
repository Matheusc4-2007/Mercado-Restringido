import { useDispatch, useSelector } from 'react-redux'
import { useCargaLista } from '../../hooks/useCargaLista'
import {
  cargarResenas,
  eliminarResena,
  reiniciarResenas,
  selectResenas,
  selectResenasCargando,
  selectResenasError,
} from '../../app/resenasSlice'
import { MensajeError } from '../../components/common/MensajeError'
import { TablaResenas } from '../../components/admin/TablaResenas'
import loading from '../../assets/loading-icon.svg'

// Moderación: el admin puede ver todas las reseñas y borrar las que no correspondan
export function AdminResenasPage() {
  const dispatch = useDispatch()
  const resenas = useSelector(selectResenas)
  const cargando = useSelector(selectResenasCargando)
  const error = useSelector(selectResenasError)

  // Carga todas las reseñas al entrar y las limpia al salir
  useCargaLista(cargarResenas, reiniciarResenas)

  const eliminar = (resena) => {
    if (!window.confirm(`¿Eliminar la reseña de ${resena.usuario} sobre "${resena.producto}"?`)) return
    dispatch(eliminarResena(resena.id))
  }

  return (
    <div>
      <h2>Reseñas</h2>

      <MensajeError error={error} />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando reseñas...</p>
        </>
      ) : (
        <TablaResenas resenas={resenas} onEliminar={eliminar} />
      )}
    </div>
  )
}
