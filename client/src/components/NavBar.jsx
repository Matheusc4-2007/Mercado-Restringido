import Logo from '../assets/logo.svg';
import { esAdmin } from '../utils/admin';
import { ShoppingCart, LogOut } from 'lucide-react';

export function ButtonNav({ text, page, setPage, direction }) {
    const isActive = page == direction;

    return (
        <button
            className={isActive ? 'ButtonNav-active' : 'ButtonNav'}
            onClick={() => setPage(direction)}
        >
            {text}
        </button>
    );
}

export function NavBar({ page, setPage, usuario, onLogout }) {
    return (
        <nav className="NavBar">
            <a className="NavBar-brand" onClick={() => setPage('home')}>
                <img src={Logo} className="Logo" />
                <h1 className='titulo-pagina'>Mercado Restringido</h1>
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
                            text="Administrar"
                            page={page}
                            setPage={setPage}
                            direction="admin"
                        />
                        <span className="NavSeparator"></span>
                    </>
                )}
                {usuario ? (
                    <>
                        <ButtonNav
                        text="Cuenta"
                        page={page}
                        setPage={setPage}
                        direction="account"
                        />
                        <span className="NavSeparator"></span>
                        <ButtonNav
                            text={<ShoppingCart />}
                            page={page}
                            setPage={setPage}
                            direction="cart"
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
