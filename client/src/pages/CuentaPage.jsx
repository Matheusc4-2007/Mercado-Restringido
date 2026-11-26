import { DashBoard } from '../components/DashBoard';
import { MisVentas } from '../components/MisVentas';
import { TablaProductos } from '../components/admin/TablaProductos';
import { FormProducto } from '../components/admin/FormProducto';
import { MensajeError } from '../components/common/MensajeError';
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
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
import {
  cargarCategorias,
  reiniciarCategorias,
  selectCategorias,
  selectCategoriasCargando,
  selectCategoriasError,
} from '../app/categoriasSlice'

export function CuentaPage() {
  const { usuario: user } = useAuth()
  const products = useSelector((state) => selectProductosDeVendedor(state, user.id))
  const cargando = useSelector(selectProductosCargando)
  const errorProductos = useSelector(selectProductosError)
  const categorias = useSelector(selectCategorias)
  const cargandoCategorias = useSelector(selectCategoriasCargando)
  const errorCategorias = useSelector(selectCategoriasError)
  const error = errorProductos ?? errorCategorias

  const name = user.nombre

  // Carga la lista al entrar y la limpia al salir
  useCargaLista(cargarProductos, reiniciarProductos)
  useCargaLista(cargarCategorias, reiniciarCategorias)

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

      <MensajeError error={error} />

      <FormProducto
        key={idEditando ?? 'nuevo'}
        producto={editando}
        userId={user.id}
        categorias={categorias}
        cargandoCategorias={cargandoCategorias}
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

      <MisVentas />
    </section>
  )
}
