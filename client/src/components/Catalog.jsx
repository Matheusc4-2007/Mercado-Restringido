import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from './Home';
import { Product } from './Product';
import { MensajeError } from './admin/MensajeError';
import loading from '../assets/loading-icon.svg';
import { useAuth } from '../hooks/useAuth';
import { useCargaLista } from '../hooks/useCargaLista';
import {
    selectBusqueda,
    selectCategoriaFiltro,
    selectAviso,
    buscarEnCatalogo,
    filtrarPorCategoria,
    limpiarAviso,
} from '../app/uiSlice';
import {
    cargarCategorias,
    reiniciarCategorias,
    selectCategorias,
} from '../app/categoriasSlice';
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
    const categoriaFiltro = useSelector(selectCategoriaFiltro);
    const categorias = useSelector(selectCategorias);
    const { estaLogueado } = useAuth();
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
    // useMemo mantiene la misma identidad del objeto entre renders: si se creara
    // uno nuevo cada vez, el efecto de useCargaLista se repetiría sin parar
    const filtros = useMemo(
        () => ({ nombre: busqueda, idCategoria: categoriaFiltro }),
        [busqueda, categoriaFiltro],
    );
    useCargaLista(cargarProductos, reiniciarProductos, filtros);
    // Las categorías alimentan el selector de filtro
    useCargaLista(cargarCategorias, reiniciarCategorias);

    const onBuscar = useCallback(
        (texto) => dispatch(buscarEnCatalogo(texto)),
        [dispatch],
    );

    return (
        <section className="Catalog-section">
            {!estaLogueado ? (
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

            <div className="Category-filter">
                <label htmlFor="category-filter">Categoría</label>
                <select
                    id="category-filter"
                    value={categoriaFiltro}
                    onChange={(e) => dispatch(filtrarPorCategoria(e.target.value))}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

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
                            category={p.categoria}
                            description={p.descripcion}
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
