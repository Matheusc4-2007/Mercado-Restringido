import { useState } from 'react'
import { useDispatch } from 'react-redux'


export function useCrud(items, acciones, mensajeEliminar = () => '¿Eliminar este registro?') {
  const { crear, actualizar, eliminar, limpiarError } = acciones
  const dispatch = useDispatch()
  const [idEditando, setIdEditando] = useState(null) // null = nada se edita

  const editando = items.find((item) => item.id === idEditando)

  const editar = (id) => {
    dispatch(limpiarError())
    setIdEditando(id)
  }

  const cancelar = () => {
    dispatch(limpiarError())
    setIdEditando(null)
  }

  // Crea o actualiza según haya un registro en edición.
  //devuelve true
  const guardar = async (datos) => {
    const accion = editando
      ? actualizar({ id: editando.id, datos })
      : crear(datos)
    const res = await dispatch(accion)
    const ok = res.meta.requestStatus === 'fulfilled'
    if (ok) setIdEditando(null)
    return ok
  }

  const eliminarRegistro = async (registro) => {
    if (!window.confirm(mensajeEliminar(registro))) return
    const res = await dispatch(eliminar(registro.id))
    if (res.meta.requestStatus === 'fulfilled' && registro.id === idEditando) {
      setIdEditando(null)
    }
  }

  return { idEditando, editando, editar, cancelar, guardar, eliminar: eliminarRegistro }
}
