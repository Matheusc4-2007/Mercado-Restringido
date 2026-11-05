import { DashBoard } from './DashBoard';
import { TablaProductos } from './admin/TablaProductos';
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { useCrud } from '../hooks/useCrud'
import { useCargaLista } from '../hooks/useCargaLista'
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
  const editando = Boolean(producto)

  const valoresIniciales = producto
    ? {
        nombre: producto.nombre,
        precio: String(producto.precio),
        imagen: producto.imagen,
        id_vendedor: producto.id_vendedor,
      }
    : { nombre: '', precio: '', imagen: '', id_vendedor: userId || '' }

  const { datos, handleChange, handleSubmit, enviando } = useForm(
    valoresIniciales,
    (d) =>
      onGuardar(
        editando ? { nombre: d.nombre, precio: d.precio, imagen: d.imagen } : d
      ),
    { limpiarSiExito: !editando }
  )

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
  const { usuario: user } = useAuth()
  const products = useSelector((state) => selectProductosDeVendedor(state, user.id))
  const cargando = useSelector(selectProductosCargando)
  const error = useSelector(selectProductosError)

  const name = user.nombre

  // Carga la lista al entrar y la limpia al salir
  useCargaLista(cargarProductos, reiniciarProductos)

  const { idEditando, editando, editar, cancelar, guardar, eliminar } = useCrud(
    products,
    {
      crear: crearProducto,
      actualizar: actualizarProducto,
      eliminar: eliminarProducto,
      limpiarError: limpiarErrorProductos,
    },
    (producto) => `¿Eliminar "${producto.nombre}"?`
  )

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
