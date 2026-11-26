import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

// Marco común de todas las páginas: barra de navegación + la página activa
export function Layout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}
