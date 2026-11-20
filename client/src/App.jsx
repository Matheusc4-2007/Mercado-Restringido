import { useSelector } from 'react-redux';
import './App.css';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { FormLog } from './components/FormLog';
import { AdminPanel } from './components/admin/AdminPanel';
import { Catalog } from './components/Catalog';
import { Account } from './components/Account';
import { Carrito } from './components/Carrito';
import { MisPedidos } from './components/MisPedidos';
import { Favoritos } from './components/Favoritos';
import { esAdmin } from './utils/admin';
import { selectUsuario } from './app/authSlice';
import { selectPage, selectBusqueda } from './app/uiSlice';

function App() {
    const page = useSelector(selectPage);
    const busqueda = useSelector(selectBusqueda);
    const usuario = useSelector(selectUsuario);

    const renderPage = () => {
        // sergio complicador
        switch (
            page // podemos agregar mas cosas si es necesario y no tenemos un mar de returns
        ) {
            case 'home':
                return <Home />;
            case 'login':
                return <FormLog />;
            case 'admin':
                return esAdmin(usuario) ? (
                    <AdminPanel />
                ) : (
                    <p>Acceso restringido</p>
                );
            case 'catalog':
                return <Catalog key={busqueda} />;
            case 'carrito':
                return <Carrito />;
            case 'pedidos':
                return usuario ? <MisPedidos /> : <p>Acceso restringido</p>;
            case 'favoritos':
                return usuario ? <Favoritos /> : <p>Acceso restringido</p>;
            case 'account':
                return usuario?.es_vendedor ? (
                    <Account />
                ) : (
                    <p>Acceso restringido</p>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <NavBar />
            {renderPage()}
        </>
    );
}

export default App;
