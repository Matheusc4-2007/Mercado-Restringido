import { useForm } from '../../hooks/useForm'
import { esAdmin } from '../../utils/admin'

const VACIO = {
  cedula: '',
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  es_vendedor: false,
}

// Si hay usuario (modo edición) arranca con sus datos, si no, vacío
const datosIniciales = (u) =>
  u
    ? {
        cedula: u.cedula,
        nombre: u.nombre,
        apellido: u.apellido,
        fecha_nacimiento: u.fecha_nacimiento,
        es_vendedor: Boolean(u.es_vendedor),
      }
    : VACIO

export function FormUsuario({ usuario, onGuardar, onCancelar }) {
  const editando = Boolean(usuario)

  // Al crear, el formulario se limpia cuando el guardado sale bien
  const { datos, handleChange, handleSubmit, enviando } = useForm(
    datosIniciales(usuario),
    onGuardar,
    { limpiarSiExito: !editando }
  )

  return (
    <form onSubmit={handleSubmit} className='Form-products-users'>
        <h3>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>

        <label htmlFor='c'>
            Cédula
        </label>
        <input
                type="text" 
                name="cedula"
                inputMode="numeric" 
                pattern="\d{5,15}" 
                title="Entre 5 y 15 dígitos"
                value={datos.cedula} 
                onChange={handleChange} 
                required
                disabled={editando && esAdmin(usuario)} // la cédula del admin no se cambia
                id='c'
        />

        <label htmlFor='name'>
            Nombre
        </label>
        <input
                type="text" 
                name="nombre"
                value={datos.nombre} 
                onChange={handleChange} 
                required
                id='name'
            />

        <label htmlFor='lastName'>
            Apellido
        </label>
        <input
                type="text" 
                name="apellido"
                value={datos.apellido} 
                onChange={handleChange} 
                required
                id='lastName'
        />

        <label htmlFor='date'>
            Fecha de nacimiento
        </label>
        <input
                type="date" 
                name="fecha_nacimiento"
                value={datos.fecha_nacimiento} 
                onChange={handleChange} 
                required
                id='date'
        />

        <label htmlFor='seller'>
        Es vendedor
        </label>
        <input
                type="checkbox" 
                name="es_vendedor"
                checked={datos.es_vendedor} 
                onChange={handleChange}
                id='seller'
        />

        <button 
            type="submit" 
            disabled={enviando}
            >{enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear usuario'}
        </button>
        {editando && (
            <button 
                type="button" 
                onClick={onCancelar}
            >Cancelar</button>
        )}
    </form>
  )
}