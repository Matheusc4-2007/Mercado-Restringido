import { useState } from 'react'
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
  const [datos, setDatos] = useState(datosIniciales(usuario))
  const [enviando, setEnviando] = useState(false)

  const editando = Boolean(usuario)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    const ok = await onGuardar(datos)
    setEnviando(false)
    if (ok && !editando) setDatos(VACIO) // al crear, se limpia el formulario
  }

  return (
    <form onSubmit={handleSubmit}>
        <h3>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>

        <label>
            Cédula
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
            />
        </label>

        <label>
            Nombre
            <input
                type="text" 
                name="nombre"
                value={datos.nombre} 
                onChange={handleChange} 
                required
            />
        </label>

        <label>
            Apellido
            <input
                type="text" 
                name="apellido"
                value={datos.apellido} 
                onChange={handleChange} 
                required
            />
        </label>

        <label>
            Fecha de nacimiento
            <input
                type="date" 
                name="fecha_nacimiento"
                value={datos.fecha_nacimiento} 
                onChange={handleChange} 
                required
            />
        </label>

        <label>
            <input
                type="checkbox" 
                name="es_vendedor"
                checked={datos.es_vendedor} 
                onChange={handleChange}
            />
        Es vendedor
        </label>

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