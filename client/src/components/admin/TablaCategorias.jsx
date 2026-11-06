export function TablaCategorias({ categorias, onEditar, onEliminar }) {
  if (categorias.length === 0) return <p>No hay categorías</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Productos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((c) => {
          // El servidor también lo impide (ON DELETE RESTRICT); aquí se evita el intento
          const tieneProductos = c.total_productos > 0
          return (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.descripcion ?? '—'}</td>
              <td>{c.total_productos}</td>
              <td>
                <button type="button" onClick={() => onEditar(c.id)}>Editar</button>
                <button
                  type="button"
                  onClick={() => onEliminar(c)}
                  disabled={tieneProductos}
                  title={
                    tieneProductos
                      ? `No se puede eliminar: tiene ${c.total_productos} producto(s)`
                      : undefined
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
