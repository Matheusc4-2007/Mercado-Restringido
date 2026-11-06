import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCargaLista } from '../../hooks/useCargaLista'
import { useCrud } from '../../hooks/useCrud'
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
import {
  cargarCategorias,
  reiniciarCategorias,
  selectCategorias,
  selectCategoriasCargando,
  selectCategoriasError,
} from '../../app/categoriasSlice'
import { MensajeError } from './MensajeError'
import { FormProducto } from './FormProducto'
import { TablaProductos } from './TablaProductos'
import loading from '../../assets/loading-icon.svg';

export function AdminProductos() {
  const dispatch = useDispatch()
  const productos = useSelector(selectProductos)
  const { nombre: filtro } = useSelector(selectFiltroProductos) // búsqueda aplicada
  const vendedores = useSelector(selectVendedores)
  const cargandoProductos = useSelector(selectProductosCargando)
  const cargandoUsuarios = useSelector(selectUsuariosCargando)
  const cargando = cargandoProductos || cargandoUsuarios
  const errorProductos = useSelector(selectProductosError)
  const errorUsuarios = useSelector(selectUsuariosError)
  const categorias = useSelector(selectCategorias)
  const cargandoCategorias = useSelector(selectCategoriasCargando)
  const errorCategorias = useSelector(selectCategoriasError)
  const error = errorProductos ?? errorUsuarios ?? errorCategorias

  const [busqueda, setBusqueda] = useState('') // lo que se escribe en el input

  // Carga productos y vendedores al entrar y limpia ambas listas al salir
  useCargaLista(cargarProductos, reiniciarProductos)
  useCargaLista(cargarUsuarios, reiniciarUsuarios)
  useCargaLista(cargarCategorias, reiniciarCategorias)

  const { idEditando, editando, editar, cancelar, guardar, eliminar } = useCrud(
    productos,
    {
      crear: crearProducto,
      actualizar: actualizarProducto,
      eliminar: eliminarProducto,
      limpiarError: limpiarErrorProductos,
    },
    (producto) => `¿Eliminar "${producto.nombre}"?`
  )

  const buscar = (e) => {
    e.preventDefault()
    dispatch(cargarProductos({ nombre: busqueda.trim() }))
  }

  const limpiarBusqueda = () => {
    setBusqueda('')
    dispatch(cargarProductos())
  }

  return (
    <div>
      <h2>Productos</h2>

      <MensajeError error={error} />

      <FormProducto
        key={idEditando ?? 'nuevo'}
        producto={editando}
        vendedores={vendedores}
        categorias={categorias}
        cargandoCategorias={cargandoCategorias}
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
