import { useState } from 'react'

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
    const [datos, setDatos] = useState(datosIniciales(producto))
    const [enviando, setEnviando] = useState(false)

    const editando = Boolean(producto)
    const sinVendedores = !editando && vendedores.length === 0

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
    <form onSubmit={handleSubmit}>
        <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>

        <label>
            Nombre
            <input
                type="text" 
                name="nombre"
                value={datos.nombre} 
                onChange={handleChange} 
                required
            />
        </label>

        <label>
            Precio
            <input
                type="number" 
                name="precio" 
                min="0" 
                step="0.01"
                value={datos.precio} 
                onChange={handleChange} 
                required
            />
        </label>

        <label>
            URL de la imagen
            <input
                type="url" 
                name="imagen"
                value={datos.imagen} 
                onChange={handleChange} 
                required
            />
        </label>

        {editando ? (
            <p>Vendedor: {producto.vendedor}</p>
        ) : (
            <label>
                Vendedor
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
            </label>
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