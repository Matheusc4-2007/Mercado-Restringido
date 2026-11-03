import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cargarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  reiniciarProductos,
  limpiarErrorProductos,
  selectProductos,
  selectFiltroProductos,
  selectProductosCargando,
  selectProductosError,
} from '../../app/productosSlice'
import {
  cargarUsuarios,
  reiniciarUsuarios,
  selectVendedores,
  selectUsuariosCargando,
  selectUsuariosError,
} from '../../app/usuariosSlice'
import { MensajeError } from './MensajeError'
import { FormProducto } from './FormProducto'
import { TablaProductos } from './TablaProductos'
import loading from '../../assets/loading-icon.svg';

export function AdminProductos() {
  const dispatch = useDispatch()
  const productos = useSelector(selectProductos)
  const filtro = useSelector(selectFiltroProductos) // el filtro aplicado
  const vendedores = useSelector(selectVendedores)
  const cargandoProductos = useSelector(selectProductosCargando)
  const cargandoUsuarios = useSelector(selectUsuariosCargando)
  const cargando = cargandoProductos || cargandoUsuarios
  const errorProductos = useSelector(selectProductosError)
  const errorUsuarios = useSelector(selectUsuariosError)
  const error = errorProductos ?? errorUsuarios

  const [idEditando, setIdEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('') // lo que se escribe en el input

  // Carga productos y vendedores al entrar y limpia ambas listas al salir
  useEffect(() => {
    dispatch(cargarProductos())
    dispatch(cargarUsuarios())
    return () => {
      dispatch(reiniciarProductos())
      dispatch(reiniciarUsuarios())
    }
  }, [dispatch])

  const editando = productos.find((p) => p.id === idEditando)

  const editar = (id) => {
    dispatch(limpiarErrorProductos())
    setIdEditando(id)
  }

  const cancelar = () => {
    dispatch(limpiarErrorProductos())
    setIdEditando(null)
  }

  const buscar = (e) => {
    e.preventDefault()
    dispatch(cargarProductos(busqueda.trim()))
  }

  const limpiarBusqueda = () => {
    setBusqueda('')
    dispatch(cargarProductos(''))
  }

  const guardar = async (datos) => {
    const accion = editando
      ? actualizarProducto({ id: editando.id, datos })
      : crearProducto(datos)
    const res = await dispatch(accion)
    const ok = res.meta.requestStatus === 'fulfilled'
    if (ok) setIdEditando(null)
    return ok
  }

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    const res = await dispatch(eliminarProducto(producto.id))
    if (res.meta.requestStatus === 'fulfilled' && producto.id === idEditando) {
      setIdEditando(null)
    }
  }
  
  return (
    <div>
      <h2>Productos</h2>

      <MensajeError error={error} />

      <FormProducto
        key={idEditando ?? 'nuevo'}
        producto={editando}
        vendedores={vendedores}
        onGuardar={guardar}
        onCancelar={cancelar}
      />

      <form onSubmit={buscar}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          minLength={2}
          maxLength={100}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">Buscar</button>
        {filtro && (
          <button type="button" onClick={limpiarBusqueda}>Limpiar</button>
        )}
      </form>

      {filtro && <p>Resultados para "{filtro}"</p>}

      {cargando ? (
        <>
        <img src={loading} alt="Cargando" className='Loading-icon'/>
        <p className='Result-text'>Cargando productos...</p>
        </>
      ) : (
        <TablaProductos productos={productos} onEditar={editar} onEliminar={eliminar} />
      )}
    </div>
  )
}