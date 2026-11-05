import { useForm } from '../../hooks/useForm'

const VACIO = { nombre: '', precio: '', imagen: '', id_vendedor: '' }

const datosIniciales = (p) =>
  p ? {
        nombre: p.nombre,
        precio: String(p.precio),
        imagen: p.imagen,
        id_vendedor: p.id_vendedor,
      }
    : VACIO

export function FormProducto({ producto, vendedores, onGuardar, onCancelar }) {
    const editando = Boolean(producto)
    const sinVendedores = !editando && vendedores.length === 0

    const { datos, handleChange, handleSubmit, enviando } = useForm(
        datosIniciales(producto),
        (d) =>
            onGuardar(
                editando
                    ? { nombre: d.nombre, precio: d.precio, imagen: d.imagen }
                    : d
            ),
        { limpiarSiExito: !editando }
    )

  return (
    <form onSubmit={handleSubmit} className='Form-products-users'>
        <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>

        <label htmlFor='name'>
            Nombre
        </label>
        <input
                type="text" 
                name="nombre"
                value={datos.nombre} 
                onChange={handleChange} 
                required
                id='name'
        />

        <label htmlFor='price'>
            Precio
        </label>
        <input
                type="number" 
                name="precio" 
                min="0" 
                step="0.01"
                value={datos.precio} 
                onChange={handleChange} 
                required
                id='price'
        />

        <label htmlFor='img'>
            URL de la imagen
        </label>
        <input
                type="url" 
                name="imagen"
                value={datos.imagen} 
                onChange={handleChange} 
                required
                id='img'
        />

        {editando ? (
            <p>Vendedor: {producto.vendedor}</p>
        ) : (
            <>
            <label>
                Vendedor
            </label>
            <select
                    name="id_vendedor"
                    value={datos.id_vendedor} 
                    onChange={handleChange} required
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

        {sinVendedores && (
            <p>No hay vendedores: crea primero un usuario con "Es vendedor".</p>
        )}

        <button 
            type="submit" 
            disabled={enviando || sinVendedores}
        >{enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear producto'}
        </button>
        {editando && (
            <button type="button" onClick={onCancelar}>Cancelar</button>
        )}
    </form>
  )
}