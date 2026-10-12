import { useEffect, useState } from 'react';
import { listarProductos } from '../services/productos.service';
import { SearchBar } from './Home';
import { Product } from './Product';
import { MensajeError } from './admin/MensajeError';
import loading from '../assets/loading-icon.svg';

export function Catalog({ busqueda, onBuscar, usuarioExiste }) {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [aviso, setAviso] = useState(null);

    useEffect(() => {
        if (!aviso) return;
        const t = setTimeout(() => setAviso(null), 2500);
        return () => clearTimeout(t);
    }, [aviso]);

    const [carritoData, setCarritoData] = useState(() => {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    });

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carritoData));
    }, [carritoData]);

    function agregarCarrito(id, nombre, precio, vendedor, imagen) {
        setCarritoData((prev) => {
            const existe = prev.find((item) => item.idCompra === id);

            if (existe) {
                return prev.map((item) =>
                    item.idCompra === id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item,
                );
            }
            setAviso({ texto: `${nombre} se ha añadido a su carrito` });
            return [
                ...prev,
                {
                    idCompra: id,
                    nombreCompra: nombre,
                    precioCompra: precio,
                    vendedorCompra: vendedor,
                    imagenCompra: imagen,
                    cantidad: 1,
                },
            ];
        });
    }

    useEffect(() => {
        let activo = true;
        listarProductos(busqueda)
            .then((data) => activo && setProductos(data))
            .catch((err) => activo && setError(err))
            .finally(() => setTimeout(() => activo && setCargando(false), 200));
        return () => {
            activo = false;
        };
    }, [busqueda]);

    return (
        <section className="Catalog-section">
            {!usuarioExiste ? (
                <div className="info-catalogo-cuenta">
                    <p>
                        Si desea realizar alguna compra le recomendamos Crear
                        una Cuenta y/o Iniciar Sesión
                    </p>
                </div>
            ) : (
                ''
            )}
            <SearchBar valorInicial={busqueda} onBuscar={onBuscar} />

            {busqueda && (
                <p className="Result-text">Resultados para "{busqueda}"</p>
            )}

            <MensajeError error={error} />

            {cargando ? (
                <>
                    <img
                        src={loading}
                        alt="Cargando"
                        className="Loading-icon"
                    />
                    <p className="Result-text">Cargando productos...</p>
                </>
            ) : productos.length === 0 && !error ? (
                <p>No se encontraron productos</p>
            ) : (
                <div className="Products-container">
                    {productos.map((p) => (
                        <Product
                            key={p.id}
                            id={p.id}
                            name={p.nombre}
                            price={p.precio.toFixed(2)}
                            seller={p.vendedor}
                            img={p.imagen}
                            agregarCarrito={agregarCarrito}
                            usuarioExiste={usuarioExiste}
                        />
                    ))}
                </div>
            )}
            {aviso && (
                <div className="Toast" role="status" aria-live="polite">
                    {aviso.texto}
                </div>
            )}
        </section>
    );
}
