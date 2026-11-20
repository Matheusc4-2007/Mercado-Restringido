import { Fragment } from 'react'
import { DetallePedido } from '../DetallePedido'
import { TRANSICIONES_PEDIDO } from '../../utils/pedidos'

export function TablaPedidos({ pedidos, onCambiarEstado }) {
  if (pedidos.length === 0) return <p>No hay pedidos</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Comprador</th>
          <th>Productos</th>
          <th>Total</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p) => {
          // Solo se ofrecen los estados a los que el servidor permite pasar
          const opciones = [p.estado, ...TRANSICIONES_PEDIDO[p.estado]]
          return (
            <Fragment key={p.id}>
              <tr>
                <td>{p.fecha}</td>
                <td>{p.comprador}</td>
                <td>{p.detalles.length}</td>
                <td>{p.total.toFixed(2)}$</td>
                <td>
                  <select
                    value={p.estado}
                    onChange={(e) => onCambiarEstado(p, e.target.value)}
                    disabled={opciones.length === 1}
                    aria-label={`Estado del pedido de ${p.comprador}`}
                  >
                    {opciones.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <DetallePedido detalles={p.detalles} />
                </td>
              </tr>
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
