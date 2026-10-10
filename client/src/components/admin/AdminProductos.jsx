import { useEffect, useState } from 'react'
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from '../../services/productos.service'
import { listarUsuarios } from '../../services/usuarios.service'
import { MensajeError } from './MensajeError'
import { FormProducto } from './FormProducto'
import { TablaProductos } from './TablaProductos'

export function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [idEditando, setIdEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('') 
  const [filtro, setFiltro] = useState('')     // el filtro aplicado
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    Promise.all([listarProductos(), listarUsuarios()])
      .then(([prods, usuarios]) => {
        if (!activo) return
        setProductos(prods)
        setVendedores(usuarios.filter((u) => u.es_vendedor))
      })
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [])

  const recargar = async (nombre = filtro) =>
    setProductos(await listarProductos(nombre))

  const editando = productos.find((p) => p.id === idEditando)

  const editar = (id) => {
    setError(null)
    setIdEditando(id)
  }

  const cancelar = () => {
    setError(null)
    setIdEditando(null)
  }

  const buscar = async (e) => {
    e.preventDefault()
    setError(null)
    const texto = busqueda.trim()
    try {
      await recargar(texto)
      setFiltro(texto)
    } catch (err) {
      setError(err)
    }
  }

  const limpiarBusqueda = async () => {
    setBusqueda('')
    setFiltro('')
    setError(null)
    try {
      await recargar('')
    } catch (err) {
      setError(err)
    }
  }

  const guardar = async (datos) => {
    setError(null)
    try {
      if (editando) await actualizarProducto(editando.id, datos)
      else await crearProducto(datos)
      await recargar()
      setIdEditando(null)
      return true
    } catch (err) {
      setError(err)
      return false
    }
  }

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    setError(null)
    try {
      await eliminarProducto(producto.id)
      if (producto.id === idEditando) setIdEditando(null)
      await recargar()
    } catch (err) {
      setError(err)
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
        <p>Cargando...</p>
      ) : (
        <TablaProductos productos={productos} onEditar={editar} onEliminar={eliminar} />
      )}
    </div>
  )
}