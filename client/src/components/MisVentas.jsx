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
import { TRANSICIONES_PEDIDO } from '../utils/pedidos'
import { MensajeError } from './admin/MensajeError'
import { DetallePedido } from './DetallePedido'
import loading from '../assets/loading-icon.svg'

export function MisVentas() {
  const dispatch = useDispatch()
  const { usuario } = useAuth()
  const pedidos = useSelector(selectPedidos)
  const cargando = useSelector(selectPedidosCargando)
  const error = useSelector(selectPedidosError)

  const filtro = useMemo(() => ({ idVendedor: usuario.id }), [usuario.id])
  useCargaLista(cargarPedidos, reiniciarPedidos, filtro)

  const totalVendido = pedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((acc, p) => acc + p.total, 0)

  const cambiarEstado = (pedido, estado) =>
    dispatch(cambiarEstadoPedido({ id: pedido.id, estado, idVendedor: usuario.id }))

  return (
    <section className="Ventas-section">
      <h3>Mis ventas</h3>

      <MensajeError error={error} />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando ventas...</p>
        </>
      ) : pedidos.length === 0 ? (
        <p>Aún no has recibido ningún pedido</p>
      ) : (
        <>
          <p className="Ventas-resumen">
            Pedidos recibidos: {pedidos.length} — Total vendido (sin cancelados):{' '}
            {totalVendido.toFixed(2)}$
          </p>

          {pedidos.map((p) => (
            <article key={p.id} className="Venta-card">
              <header>
                <h4>Pedido del {p.fecha}</h4>
                <p>Comprador: {p.comprador}</p>
                <p>Estado: {p.estado}</p>
                <p>Total: {p.total.toFixed(2)}$</p>
              </header>

              <DetallePedido detalles={p.detalles} />

              {TRANSICIONES_PEDIDO[p.estado]
                .filter((estado) => estado !== 'cancelado')
                .map((estado) => (
                  <button key={estado} type="button" onClick={() => cambiarEstado(p, estado)}>
                    Marcar como {estado}
                  </button>
                ))}
            </article>
          ))}
        </>
      )}
    </section>
  )
}
