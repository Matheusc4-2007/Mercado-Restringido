import { useDispatch, useSelector } from 'react-redux';
import Logo from '../assets/logo.webp';
import { esAdmin } from '../utils/admin';
import { ShoppingCart, LogOut, User, UserStar } from 'lucide-react';
import { logout, selectUsuario } from '../app/authSlice';
import { irA, selectPage } from '../app/uiSlice';

export function ButtonNav({ text, page, setPage, direction }) {
    const isActive = page == direction;
    if (direction === 'admin') {
        return (
            <button
                className={isActive ? 'AdminBtn-active' : 'AdminBtn'}
                onClick={() => setPage(direction)}
            >
                {text}
            </button>
        );
    }

    return (
        <button
            className={isActive ? 'ButtonNav-active' : 'ButtonNav'}
            onClick={() => setPage(direction)}
        >
            {text}
        </button>
    );
}

// ButtonNav sigue siendo presentacional (recibe todo por props);
// NavBar le entrega los datos que obtiene del store.
export function NavBar() {
    const dispatch = useDispatch();
    const page = useSelector(selectPage);
    const usuario = useSelector(selectUsuario);

    const setPage = (destino) => dispatch(irA(destino));
    const onLogout = () => dispatch(logout());

    return (
        <nav className="NavBar">
            <a className="NavBar-brand" onClick={() => setPage('home')}>
                <img src={Logo} className="Logo" />
                <h1 className="titulo-pagina">Mercado Restringido</h1>
            </a>
            <div className="NavBar-links">
                <span className="NavSeparator"></span>
                <ButtonNav
                    text="Inicio"
                    page={page}
                    setPage={setPage}
                    direction="home"
                />
                <span className="NavSeparator"></span>
                <ButtonNav
                    text="Catálogo"
                    page={page}
                    setPage={setPage}
                    direction="catalog"
                />
                <span className="NavSeparator"></span>
                {esAdmin(usuario) && (
                    <>
                        <ButtonNav
                            text={<UserStar />}
                            page={page}
                            setPage={setPage}
                            direction="admin"
                        />
                        <span className="NavSeparator"></span>
                    </>
                )}
                {usuario ? (
                    <>
                        {usuario.es_vendedor ? (
                            <ButtonNav
                                text={
                                    <span className="usuario-view">
                                        <User /> {usuario.nombre}
                                    </span>
                                }
                                page={page}
                                setPage={setPage}
                                direction="account"
                            />
                        ) : (
                            <span className="usuario-view">
                                <User /> {usuario.nombre}
                            </span>
                        )}

                        <ButtonNav
                            text={<ShoppingCart />}
                            page={page}
                            setPage={setPage}
                            direction="carrito"
                        />
                        <span className="NavSeparator"></span>
                        <button className="ButtonNav" onClick={onLogout}>
                            <LogOut />
                        </button>
                    </>
                ) : (
                    <ButtonNav
                        text="Iniciar Sesion"
                        page={page}
                        setPage={setPage}
                        direction="login"
                    />
                )}
            </div>
        </nav>
    );
}

