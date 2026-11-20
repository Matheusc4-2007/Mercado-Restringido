export function TablaResenas({ resenas, onEliminar }) {
  if (resenas.length === 0) return <p>No hay reseñas</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Usuario</th>
          <th>Calificación</th>
          <th>Comentario</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {resenas.map((r) => (
          <tr key={r.id}>
            <td>{r.producto}</td>
            <td>{r.usuario}</td>
            <td>{r.calificacion}/5</td>
            <td>{r.comentario ?? '—'}</td>
            <td>{r.fecha}</td>
            <td>
              <button type="button" onClick={() => onEliminar(r)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
