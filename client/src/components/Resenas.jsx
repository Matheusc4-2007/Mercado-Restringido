import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useCargaLista } from '../hooks/useCargaLista'
import { useCrud } from '../hooks/useCrud'
import {
  cargarResenas,
  crearResena,
  actualizarResena,
  eliminarResena,
  reiniciarResenas,
  limpiarErrorResenas,
  selectResenas,
  selectResenasCargando,
  selectResenasError,
  selectPromedioResenas,
} from '../app/resenasSlice'
import { MensajeError } from './admin/MensajeError'
import { FormResena } from './FormResena'

// Reseñas de un producto: promedio, lista y formulario.
// Se monta dentro del detalle (modal) del producto.
export function Resenas({ idProducto, idVendedor }) {
  const { usuario, estaLogueado } = useAuth()
  const resenas = useSelector(selectResenas)
  const cargando = useSelector(selectResenasCargando)
  const error = useSelector(selectResenasError)
  const promedio = useSelector(selectPromedioResenas)

  // Misma identidad del objeto entre renders (ver useCargaLista)
  const filtro = useMemo(() => ({ idProducto }), [idProducto])
  useCargaLista(cargarResenas, reiniciarResenas, filtro)

  const { idEditando, editando, editar, cancelar, guardar, eliminar } = useCrud(
    resenas,
    {
      crear: crearResena,
      actualizar: actualizarResena,
      eliminar: eliminarResena,
      limpiarError: limpiarErrorResenas,
    },
    () => '¿Eliminar tu reseña?'
  )

  const miResena = resenas.find((r) => r.id_usuario === usuario?.id)
  const esElVendedor = usuario?.id === idVendedor
  // Una reseña por usuario: el formulario de "nueva" solo aparece si aún no reseñó
  const puedeEscribir = estaLogueado && !esElVendedor && (editando || !miResena)

  const guardarResena = (datos) =>
    guardar(editando ? datos : { ...datos, id_producto: idProducto, id_usuario: usuario.id })

  return (
    <section className="Resenas">
      <h3>Reseñas</h3>

      {promedio !== null && (
        <p className="Resenas-promedio">
          Promedio: {promedio.toFixed(1)} / 5 ({resenas.length}{' '}
          {resenas.length === 1 ? 'reseña' : 'reseñas'})
        </p>
      )}

      <MensajeError error={error} />

      {cargando ? (
        <p>Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p>Este producto aún no tiene reseñas</p>
      ) : (
        <ul className="Resenas-lista">
          {resenas.map((r) => (
            <li key={r.id} className="Resena-item">
              <p>
                <strong>{r.usuario}</strong> — {r.calificacion}/5
              </p>
              {r.comentario && <p>{r.comentario}</p>}
              <p>{r.fecha}</p>
              {r.id_usuario === usuario?.id && (
                <>
                  <button type="button" onClick={() => editar(r.id)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => eliminar(r)}>
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {puedeEscribir && (
        <FormResena
          key={idEditando ?? 'nueva'}
          resena={editando}
          onGuardar={guardarResena}
          onCancelar={cancelar}
        />
      )}
    </section>
  )
}
