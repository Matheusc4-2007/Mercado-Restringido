import { useEffect, useState } from 'react'
import { listarProductos } from '../services/productos.service'
import { SearchBar } from './Home'
import { Product } from './Product'
import { MensajeError } from './admin/MensajeError'

export function Catalog({ busqueda, onBuscar }) {
  const [productos, setProductos] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    listarProductos(busqueda)
      .then((data) => activo && setProductos(data))
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [busqueda])

  return (
    <section className="Catalog-section">
      <SearchBar valorInicial={busqueda} onBuscar={onBuscar} />

      {busqueda && <p>Resultados para "{busqueda}"</p>}

      <MensajeError error={error} />

        {cargando ? (
            <p>Cargando productos...</p>
                ) : productos.length === 0 && !error ? (
            <p>No se encontraron productos</p>
                 ) : (
            <div className="Products-container">
                {productos.map((p) => (
                    <Product
                        key={p.id}
                        name={p.nombre}
                        price={p.precio.toFixed(2)}
                        seller={p.vendedor}
                        img={p.imagen}
                    />
                ))}
            </div>
        )}
    </section>
  )
}