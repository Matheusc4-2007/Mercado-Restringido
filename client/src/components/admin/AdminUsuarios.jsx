import { useEffect, useState } from 'react'
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, } from '../../services/usuarios.service'
import { MensajeError } from './MensajeError'
import { FormUsuario } from './FormUsuario'
import { TablaUsuarios } from './TablaUsuarios'


export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [idEditando, setIdEditando] = useState(null) // null = nadie se edita
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    listarUsuarios()
      .then((data) => activo && setUsuarios(data))
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [])

  const recargar = async () => setUsuarios(await listarUsuarios())

  const editando = usuarios.find((u) => u.id === idEditando)

  const editar = (id) => {
    setError(null)
    setIdEditando(id)
  }

  const cancelar = () => {
    setError(null)
    setIdEditando(null)
  }

  // Devuelve true si salió bien (el formulario lo usa para limpiarse)
  const guardar = async (datos) => {
    setError(null)
    try {
      if (editando) await actualizarUsuario(editando.id, datos)
      else await crearUsuario(datos)
      await recargar()
      setIdEditando(null)
      return true
    } 
    catch (err) {
      setError(err)
      return false
    }
  }

  const eliminar = async (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return
    setError(null)
    try {
      await eliminarUsuario(usuario.id)
      if (usuario.id === idEditando) setIdEditando(null)
      await recargar()
    } catch (err) {
      setError(err) // ej: "No se puede eliminar: tiene productos publicados"
    }
  }

  return (
    <div>
      <h2>Usuarios</h2>

      <MensajeError error={error} />

      <FormUsuario
        key={idEditando ?? 'nuevo'}
        usuario={editando}
        onGuardar={guardar}
        onCancelar={cancelar}
      />

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <TablaUsuarios 
          usuarios={usuarios} 
          onEditar={editar} 
          onEliminar={eliminar}
        />
      )}
    </div>
  )
}