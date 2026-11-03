import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cargarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reiniciarUsuarios,
  limpiarErrorUsuarios,
  selectUsuarios,
  selectUsuariosCargando,
  selectUsuariosError,
} from '../../app/usuariosSlice'
import { MensajeError } from './MensajeError'
import { FormUsuario } from './FormUsuario'
import { TablaUsuarios } from './TablaUsuarios'
import loading from '../../assets/loading-icon.svg';

export function AdminUsuarios() {
  const dispatch = useDispatch()
  const usuarios = useSelector(selectUsuarios)
  const cargando = useSelector(selectUsuariosCargando)
  const error = useSelector(selectUsuariosError)

  const [idEditando, setIdEditando] = useState(null) // null = nadie se edita

  // Carga la lista al entrar y la limpia al salir
  useEffect(() => {
    dispatch(cargarUsuarios())
    return () => {
      dispatch(reiniciarUsuarios())
    }
  }, [dispatch])

  const editando = usuarios.find((u) => u.id === idEditando)

  const editar = (id) => {
    dispatch(limpiarErrorUsuarios())
    setIdEditando(id)
  }

  const cancelar = () => {
    dispatch(limpiarErrorUsuarios())
    setIdEditando(null)
  }

  // Devuelve true si salió bien (el formulario lo usa para limpiarse)
  const guardar = async (datos) => {
    const accion = editando
      ? actualizarUsuario({ id: editando.id, datos })
      : crearUsuario(datos)
    const res = await dispatch(accion)
    const ok = res.meta.requestStatus === 'fulfilled'
    if (ok) setIdEditando(null)
    return ok
  }

  const eliminar = async (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return
    // si falla, el error llega al store (ej: "No se puede eliminar: tiene productos publicados")
    const res = await dispatch(eliminarUsuario(usuario.id))
    if (res.meta.requestStatus === 'fulfilled' && usuario.id === idEditando) {
      setIdEditando(null)
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
        <>
        <img src={loading} alt="Cargando" className='Loading-icon'/>
        <p className='Result-text'>Cargando productos...</p>
        </>
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
