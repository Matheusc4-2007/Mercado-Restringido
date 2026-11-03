import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from './Home';
import { Product } from './Product';
import { MensajeError } from './admin/MensajeError';
import loading from '../assets/loading-icon.svg';
import { selectUsuario } from '../app/authSlice'
import { selectBusqueda, selectAviso, buscarEnCatalogo, limpiarAviso } from '../app/uiSlice';
import {
    cargarProductos,
    reiniciarProductos,
    selectProductos,
    selectProductosCargando,
    selectProductosError,
} from '../app/productosSlice';

export function Catalog() {
    const dispatch = useDispatch();
    const busqueda = useSelector(selectBusqueda);
    const usuarioExiste = useSelector(selectUsuario);
    const productos = useSelector(selectProductos);
    const cargando = useSelector(selectProductosCargando);
    const error = useSelector(selectProductosError);
    const aviso = useSelector(selectAviso);

    // El aviso se oculta solo a los 2.5 s y no se arrastra a otras vistas
    useEffect(() => {
        if (!aviso) return;
        const t = setTimeout(() => dispatch(limpiarAviso()), 2500);
        return () => clearTimeout(t);
    }, [aviso, dispatch]);

    useEffect(() => () => dispatch(limpiarAviso()), [dispatch]);

    // Carga al entrar (o al cambiar la búsqueda) y limpia la lista al salir
    useEffect(() => {
        dispatch(cargarProductos(busqueda));
        return () => {
            dispatch(reiniciarProductos());
        };
    }, [dispatch, busqueda]);

    const onBuscar = useCallback(
        (texto) => dispatch(buscarEnCatalogo(texto)),
        [dispatch],
    );

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
