import { useForm } from '../../hooks/useForm'

const VACIO = { nombre: '', descripcion: '' }

// Si hay categoría (modo edición) arranca con sus datos, si no, vacío.
// La descripción es opcional y llega como null cuando no existe.
const datosIniciales = (c) =>
  c ? { nombre: c.nombre, descripcion: c.descripcion ?? '' } : VACIO

export function FormCategoria({ categoria, onGuardar, onCancelar }) {
  const editando = Boolean(categoria)

  // Al crear, el formulario se limpia cuando el guardado sale bien
  const { datos, handleChange, handleSubmit, enviando } = useForm(
    datosIniciales(categoria),
    onGuardar,
    { limpiarSiExito: !editando }
  )

  return (
    <form onSubmit={handleSubmit} className="Form-products-users">
      <h3>{editando ? 'Editar categoría' : 'Nueva categoría'}</h3>

      <label htmlFor="cat-nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        value={datos.nombre}
        onChange={handleChange}
        minLength={2}
        maxLength={50}
        required
        id="cat-nombre"
      />

      <label htmlFor="cat-descripcion">Descripción (opcional)</label>
      <input
        type="text"
        name="descripcion"
        value={datos.descripcion}
        onChange={handleChange}
        maxLength={255}
        id="cat-descripcion"
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear categoría'}
      </button>
      {editando && (
        <button type="button" onClick={onCancelar}>Cancelar</button>
      )}
    </form>
  )
}
