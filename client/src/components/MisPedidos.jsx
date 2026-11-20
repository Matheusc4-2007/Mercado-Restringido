import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useCargaLista } from '../hooks/useCargaLista'
import {
  cargarPedidos,
  cambiarEstadoPedido,
  reiniciarPedidos,
  selectPedidos,
  selectPedidosCargando,
  selectPedidosError,
} from '../app/pedidosSlice'
import { MensajeError } from './admin/MensajeError'
import { DetallePedido } from './DetallePedido'
import loading from '../assets/loading-icon.svg'

export function MisPedidos() {
  const dispatch = useDispatch()
  const { usuario } = useAuth()
  const pedidos = useSelector(selectPedidos)
  const cargando = useSelector(selectPedidosCargando)
  const error = useSelector(selectPedidosError)

  // useMemo mantiene la misma identidad del objeto entre renders
  // (si se creara uno nuevo cada vez, el efecto de useCargaLista se repetiría)
  const filtro = useMemo(() => ({ idComprador: usuario.id }), [usuario.id])
  useCargaLista(cargarPedidos, reiniciarPedidos, filtro)

  const cancelar = (pedido) => {
    if (!window.confirm('¿Cancelar este pedido?')) return
    dispatch(cambiarEstadoPedido({ id: pedido.id, estado: 'cancelado' }))
  }

  return (
    <section className="Pedidos-section">
      <h2>Mis pedidos</h2>

      <MensajeError error={error} />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando pedidos...</p>
        </>
      ) : pedidos.length === 0 ? (
        <p>Aún no has realizado ningún pedido</p>
      ) : (
        pedidos.map((p) => (
          <article key={p.id} className="Pedido-card">
            <header>
              <h3>Pedido del {p.fecha}</h3>
              <p>Estado: {p.estado}</p>
              <p>Total: {p.total.toFixed(2)}$</p>
            </header>

            <DetallePedido detalles={p.detalles} />

            {/* Solo se puede cancelar mientras no haya sido enviado */}
            {p.estado === 'pendiente' && (
              <button type="button" onClick={() => cancelar(p)}>
                Cancelar pedido
              </button>
            )}
          </article>
        ))
      )}
    </section>
  )
}
