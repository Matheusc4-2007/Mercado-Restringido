import { useSelector } from 'react-redux'
import { useCargaLista } from '../../hooks/useCargaLista'
import { useCrud } from '../../hooks/useCrud'
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
  const usuarios = useSelector(selectUsuarios)
  const cargando = useSelector(selectUsuariosCargando)
  const error = useSelector(selectUsuariosError)

  useCargaLista(cargarUsuarios, reiniciarUsuarios)

  const { idEditando, editando, editar, cancelar, guardar, eliminar } = useCrud(
    usuarios,
    {
      crear: crearUsuario,
      actualizar: actualizarUsuario,
      eliminar: eliminarUsuario,
      limpiarError: limpiarErrorUsuarios,
    },
    (usuario) => `¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`
  )

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
