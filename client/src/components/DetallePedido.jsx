// Líneas de un pedido: se usa en "Mis pedidos" y en el panel admin
export function DetallePedido({ detalles }) {
  return (
    <table className="Detalle-pedido">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Vendedor</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {detalles.map((d) => (
          <tr key={d.id}>
            <td>{d.producto}</td>
            <td>{d.vendedor}</td>
            <td>{d.cantidad}</td>
            <td>{d.precio_unitario.toFixed(2)}$</td>
            <td>{d.subtotal.toFixed(2)}$</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
