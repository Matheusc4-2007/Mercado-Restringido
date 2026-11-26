import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from '../components/SearchBar';
import { Product } from '../components/Product';
import { MensajeError } from '../components/common/MensajeError';
import loading from '../assets/loading-icon.svg';
import { useAuth } from '../hooks/useAuth';
import { useCargaLista } from '../hooks/useCargaLista';
import { useBusquedaCatalogo } from '../hooks/useBusquedaCatalogo';
import { selectAviso, limpiarAviso } from '../app/uiSlice';
import {
    cargarCategorias,
    reiniciarCategorias,
    selectCategorias,
} from '../app/categoriasSlice';
import {
    cargarFavoritos,
    reiniciarFavoritos,
} from '../app/favoritosSlice';
import {
    cargarProductos,
    reiniciarProductos,
    selectProductos,
    selectProductosCargando,
    selectProductosError,
} from '../app/productosSlice';

export function CatalogoPage() {
    const dispatch = useDispatch();
    // Búsqueda y categoría viven en la URL: /catalogo?q=...&cat=...
    const { busqueda, categoria: categoriaFiltro, buscar, filtrarPorCategoria } =
        useBusquedaCatalogo();
    const categorias = useSelector(selectCategorias);
    const { estaLogueado, usuario } = useAuth();
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
    // Los favoritos del usuario marcan el botón de cada producto (sin sesión: vacío)
    const filtroFavoritos = useMemo(
        () => ({ idUsuario: usuario?.id ?? '' }),
        [usuario?.id],
    );
    useCargaLista(cargarFavoritos, reiniciarFavoritos, filtroFavoritos);

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
            <SearchBar valorInicial={busqueda} onBuscar={buscar} />

            <div className="Category-filter">
                <label htmlFor="category-filter" className='label-x'>Categoría</label>
                <select
                    id="category-filter"
                    value={categoriaFiltro}
                    onChange={(e) => filtrarPorCategoria(e.target.value)}
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
                            sellerId={p.id_vendedor}
                            stock={p.stock}
                            rating={p.promedio_calificacion}
                            reviewCount={p.total_resenas}
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
