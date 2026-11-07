import { useForm } from '../../hooks/useForm'

// Formulario único de producto, usado por el panel admin y por la cuenta del vendedor.
const datosIniciales = (p, userId) =>
  p
    ? {
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        precio: String(p.precio),
        imagen: p.imagen,
        id_categoria: p.id_categoria,
        id_vendedor: p.id_vendedor,
      }
    : {
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        id_categoria: '',
        id_vendedor: userId || '',
      }

export function FormProducto({
  producto,
  vendedores,
  userId,
  categorias = [],
  cargandoCategorias = false,
  onGuardar,
  onCancelar,
}) {
  const editando = Boolean(producto)
  const modoAdmin = Array.isArray(vendedores)
  const sinVendedores = !editando && modoAdmin && vendedores.length === 0
  const sinCategorias = !cargandoCategorias && categorias.length === 0

  // Al editar solo se envían los campos modificables (el vendedor no cambia)
  const { datos, handleChange, handleSubmit, enviando } = useForm(
    datosIniciales(producto, userId),
    (d) =>
      onGuardar(
        editando
          ? {
              nombre: d.nombre,
              descripcion: d.descripcion,
              precio: d.precio,
              imagen: d.imagen,
              id_categoria: d.id_categoria,
            }
          : d
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

      <label htmlFor="desc">Descripción</label>
      <textarea
        name="descripcion"
        rows={4}
        minLength={10}
        maxLength={1000}
        placeholder="Describe el producto (mínimo 10 caracteres)"
        value={datos.descripcion}
        onChange={handleChange}
        required
        id="desc"
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

      <label htmlFor="category">Categoría</label>
      <select
        name="id_categoria"
        value={datos.id_categoria}
        onChange={handleChange}
        required
        id="category"
      >
        <option value="">Seleccione una categoría</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {modoAdmin &&
        (editando ? (
          <p>Vendedor: {producto.vendedor}</p>
        ) : (
          <>
            <label htmlFor="vendor">Vendedor</label>
            <select
              name="id_vendedor"
              value={datos.id_vendedor}
              onChange={handleChange}
              required
              id="vendor"
            >
              <option value="">Seleccione un vendedor</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre} {v.apellido} ({v.cedula})
                </option>
              ))}
            </select>
          </>
        ))}

      {sinVendedores && (
        <p>No hay vendedores: crea primero un usuario con "Es vendedor".</p>
      )}
      {!editando && sinCategorias && (
        <p>No hay categorías creadas: el administrador debe crear una primero.</p>
      )}

      <button
        type="submit"
        disabled={enviando || sinVendedores || (!editando && sinCategorias)}
        className='boton-x'
      >
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
