import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  verificarCompra,
  selectCompro,
  selectResenas,
  selectResenasCargando,
  selectResenasError,
  selectPromedioResenas,
} from '../app/resenasSlice'
import { MensajeError } from './admin/MensajeError'
import { FormResena } from './FormResena'

// Reseñas de un producto: promedio, lista y formulario.
// Se monta dentro del detalle (modal) del producto.
export function Resenas({ idProducto, idVendedor, onResumen }) {
  const dispatch = useDispatch()
  const { usuario, estaLogueado } = useAuth()
  const resenas = useSelector(selectResenas)
  const cargando = useSelector(selectResenasCargando)
  const error = useSelector(selectResenasError)
  const promedio = useSelector(selectPromedioResenas)
  const compro = useSelector(selectCompro)

  // Misma identidad del objeto entre renders (ver useCargaLista)
  const filtro = useMemo(() => ({ idProducto }), [idProducto])
  useCargaLista(cargarResenas, reiniciarResenas, filtro)

  useEffect(() => {
    if (!cargando && onResumen) {
      onResumen({ promedio: promedio === null ? null : Math.round(promedio * 10) / 10, total: resenas.length })
    }
  }, [cargando, promedio, resenas.length, onResumen])

  const idUsuario = usuario?.id
  useEffect(() => {
    if (idUsuario) dispatch(verificarCompra({ idComprador: idUsuario, idProducto }))
  }, [dispatch, idUsuario, idProducto])

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
  // Una reseña por usuario y solo si compró el producto; editar o borrar no lo exige
  const puedeEscribir =
    estaLogueado && !esElVendedor && (editando || (!miResena && compro === true))
  const sinCompra = estaLogueado && !esElVendedor && !miResena && compro === false

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

      {sinCompra && (
        <p className="Resenas-aviso">Solo puedes reseñar productos que hayas comprado</p>
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
