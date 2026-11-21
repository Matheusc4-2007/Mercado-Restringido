import { textoValoracion } from '../../utils/valoracion'

export function TablaProductos({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) return <p>No hay productos</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Valoración</th>
          <th>Vendedor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td><img src={p.imagen} alt={p.nombre} width="60" /></td>
            <td title={p.descripcion || undefined}>{p.nombre}</td>
            <td>{p.categoria}</td>
            <td>{p.precio.toFixed(2)}</td>
            <td>{p.stock === 0 ? 'Agotado' : p.stock}</td>
            <td>{textoValoracion(p.promedio_calificacion, p.total_resenas)}</td>
            <td>{p.vendedor}</td>
            <td>
              <button type="button" onClick={() => onEditar(p.id)}>Editar</button>
              <button type="button" onClick={() => onEliminar(p)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}