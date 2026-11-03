import { DashBoard } from './DashBoard';
import { TablaProductos } from './admin/TablaProductos';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUsuario } from '../app/authSlice'
import {
  cargarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  reiniciarProductos,
  limpiarErrorProductos,
  selectProductosDeVendedor,
  selectProductosCargando,
  selectProductosError,
} from '../app/productosSlice'

export function FormProducto({ producto, vendedores = [], userId, onGuardar, onCancelar }) {
  const VACIO = { nombre: '', precio: '', imagen: '', id_vendedor: userId || '' }

  const datosIniciales = (p) =>
    p
      ? {
          nombre: p.nombre,
          precio: String(p.precio),
          imagen: p.imagen,
          id_vendedor: p.id_vendedor,
        }
      : VACIO

  const [datos, setDatos] = useState(datosIniciales(producto))
  const [enviando, setEnviando] = useState(false)

  const editando = Boolean(producto)

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)

    const aEnviar = editando
      ? { nombre: datos.nombre, precio: datos.precio, imagen: datos.imagen }
      : datos

    const ok = await onGuardar(aEnviar)
    setEnviando(false)
    if (ok && !editando) setDatos(VACIO)
  }

  return (
    <form onSubmit={handleSubmit} className="Form-products-users">
      <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>

      <label htmlFor="name">Nombre</label>
      <input
        type="text"
        name="nombre"
        value={datos.nombre}
        onChange={handleChange}
        required
        id="name"
      />

      <label htmlFor="price">Precio</label>
      <input
        type="number"
        name="precio"
        min="0"
        step="0.01"
        value={datos.precio}
        onChange={handleChange}
        required
        id="price"
      />

      <label htmlFor="img">URL de la imagen</label>
      <input
        type="url"
        name="imagen"
        value={datos.imagen}
        onChange={handleChange}
        required
        id="img"
      />

      {!editando && vendedores.length > 0 && (
        <>
          <label>Vendedor</label>
          <select
            name="id_vendedor"
            value={datos.id_vendedor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un vendedor</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre} {v.apellido} ({v.cedula})
              </option>
            ))}
          </select>
        </>
      )}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear producto'}
      </button>

      {editando && (
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  )
}

export function Account() {
  const dispatch = useDispatch()
  const user = useSelector(selectUsuario)
  const products = useSelector((state) => selectProductosDeVendedor(state, user.id))
  const cargando = useSelector(selectProductosCargando)
  const error = useSelector(selectProductosError)

  const name = user.nombre
  const [idEditando, setIdEditando] = useState(null)

  // Carga la lista al entrar y la limpia al salir
  useEffect(() => {
    dispatch(cargarProductos())
    return () => {
      dispatch(reiniciarProductos())
    }
  }, [dispatch])

  const editando = products.find((p) => p.id === idEditando)

  const editar = (id) => {
    dispatch(limpiarErrorProductos())
    setIdEditando(id)
  }

  const cancelar = () => {
    dispatch(limpiarErrorProductos())
    setIdEditando(null)
  }

  // Devuelve true si salió bien (el formulario lo usa para limpiarse)
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
    <section className="Account-container">
      <h2>Bienvenido '{name}'</h2>

      <div className="DashBoard-container">
        <DashBoard products={products} model={1} />
        <span className="NavSeparator"></span>
        <DashBoard products={products} model={2} />
        <span className="NavSeparator"></span>
        <DashBoard products={products} model={3} />
      </div>

      {error && <p className="Error-message">{error.message}</p>}

      <FormProducto
        key={idEditando ?? 'nuevo'}
        producto={editando}
        userId={user.id}
        onGuardar={guardar}
        onCancelar={cancelar}
      />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <TablaProductos
          productos={products}
          onEditar={editar}
          onEliminar={eliminar}
        />
      )}
    </section>
  )
}
