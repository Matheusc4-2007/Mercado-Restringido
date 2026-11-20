import { useForm } from '../hooks/useForm'

const VACIO = { calificacion: '5', comentario: '' }

// Si hay reseña (modo edición) arranca con sus datos, si no, vacío.
// El comentario es opcional y llega como null cuando no existe.
const datosIniciales = (r) =>
  r
    ? { calificacion: String(r.calificacion), comentario: r.comentario ?? '' }
    : VACIO

export function FormResena({ resena, onGuardar, onCancelar }) {
  const editando = Boolean(resena)

  const enviar = (d) =>
    onGuardar({
      calificacion: Number(d.calificacion),
      comentario: d.comentario.trim() || null,
    })

  // Al crear, el formulario se limpia cuando el guardado sale bien
  const { datos, handleChange, handleSubmit, enviando } = useForm(
    datosIniciales(resena),
    enviar,
    { limpiarSiExito: !editando }
  )

  return (
    <form onSubmit={handleSubmit} className="Form-resena">
      <h4>{editando ? 'Editar tu reseña' : 'Deja tu reseña'}</h4>

      <label htmlFor="resena-calificacion">Calificación</label>
      <select
        name="calificacion"
        id="resena-calificacion"
        value={datos.calificacion}
        onChange={handleChange}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <label htmlFor="resena-comentario">Comentario (opcional)</label>
      <textarea
        name="comentario"
        id="resena-comentario"
        value={datos.comentario}
        onChange={handleChange}
        maxLength={500}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Publicar reseña'}
      </button>
      {editando && (
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  )
}
