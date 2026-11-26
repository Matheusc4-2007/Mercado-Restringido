import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.webp';
import { ShoppingCart, LogOut, User, UserStar, Heart, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// NavLink marca solo cuál es la ruta activa; las clases son las de siempre.
// `end` evita que "/" quede activo en todas las páginas.
export function ButtonNav({ text, to, end = false, admin = false }) {
    const base = admin ? 'AdminBtn' : 'ButtonNav';
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? `${base}-active` : base)}
        >
            {text}
        </NavLink>
    );
}

export function NavBar() {
    const navigate = useNavigate();
    const { usuario, esAdmin, esVendedor, cerrarSesion } = useAuth();

    const salir = () => {
        cerrarSesion();
        navigate('/');
    };

    return (
        <nav className="NavBar">
            <Link className="NavBar-brand" to="/">
                <img src={Logo} className="Logo" />
                <h1 className="titulo-pagina">Mercado Restringido</h1>
            </Link>
            <div className="NavBar-links">
                <span className="NavSeparator"></span>
                <ButtonNav text="Inicio" to="/" end />
                <span className="NavSeparator"></span>
                <ButtonNav text="Catálogo" to="/catalogo" />
                <span className="NavSeparator"></span>
                {esAdmin && (
                    <>
                        <ButtonNav text={<UserStar />} to="/admin" admin />
                        <span className="NavSeparator"></span>
                    </>
                )}
                {usuario ? (
                    <>
                        {esVendedor ? (
                            <ButtonNav
                                text={
                                    <span className="usuario-view">
                                        <User /> {usuario.nombre}
                                    </span>
                                }
                                to="/cuenta"
                            />
                        ) : (
                            <span className="usuario-view">
                                <User /> {usuario.nombre}
                            </span>
                        )}

                        <ButtonNav text={<Heart />} to="/favoritos" />
                        <ButtonNav text={<Package />} to="/pedidos" />
                        <ButtonNav text={<ShoppingCart />} to="/carrito" />
                        <span className="NavSeparator"></span>
                        <button className="ButtonNav" onClick={salir}>
                            <LogOut />
                        </button>
                    </>
                ) : (
                    <ButtonNav text="Iniciar Sesion" to="/login" />
                )}
            </div>
        </nav>
    );
}
