import { useDispatch, useSelector } from 'react-redux'
import { useCargaLista } from '../../hooks/useCargaLista'
import {
  cargarPedidos,
  cambiarEstadoPedido,
  reiniciarPedidos,
  selectPedidos,
  selectPedidosCargando,
  selectPedidosError,
} from '../../app/pedidosSlice'
import { MensajeError } from '../../components/common/MensajeError'
import { TablaPedidos } from '../../components/admin/TablaPedidos'
import loading from '../../assets/loading-icon.svg'

export function AdminPedidosPage() {
  const dispatch = useDispatch()
  const pedidos = useSelector(selectPedidos)
  const cargando = useSelector(selectPedidosCargando)
  const error = useSelector(selectPedidosError)

  // Carga todos los pedidos al entrar y los limpia al salir
  useCargaLista(cargarPedidos, reiniciarPedidos)

  const cambiarEstado = (pedido, estado) =>
    dispatch(cambiarEstadoPedido({ id: pedido.id, estado }))

  return (
    <div>
      <h2>Pedidos</h2>

      <MensajeError error={error} />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando pedidos...</p>
        </>
      ) : (
        <TablaPedidos pedidos={pedidos} onCambiarEstado={cambiarEstado} />
      )}
    </div>
  )
}
