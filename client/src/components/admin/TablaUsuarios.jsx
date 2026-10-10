import { esAdmin } from '../../utils/admin'

export function TablaUsuarios({ usuarios, onEditar, onEliminar }) {
  if (usuarios.length === 0) return <p>No hay usuarios registrados</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Cédula</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Nacimiento</th>
          <th>Vendedor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td>{u.cedula}</td>
            <td>{u.nombre}</td>
            <td>{u.apellido}</td>
            <td>{u.fecha_nacimiento}</td>
            <td>{u.es_vendedor ? 'Sí' : 'No'}</td>
            <td>
              <button type="button" onClick={() => onEditar(u.id)}>Editar</button>
              {/* el admin no se puede eliminar */}
              {!esAdmin(u) && (
                <button type="button" onClick={() => onEliminar(u)}>Eliminar</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}