import { useState, useEffect } from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { FormLog } from './components/FormLog';
import { AdminPanel } from './components/admin/AdminPanel';
import { esAdmin } from './utils/admin';
import { Catalog } from './components/Catalog';
import Carrito from './components/Carrito';
import { listarProductos } from './services/productos.service';
import { Account } from './components/Account';

/*Fondos*/

import bg1 from './assets/bg-landing-7.jpg';
import bg2 from './assets/bg-landing-3.png';
import bg3 from './assets/bg-landing-4.jpg';
import bg4 from './assets/bg-landing-5.png';
import bg5 from './assets/bg-landing-2.png';

// para cambiar los fondos
const backgrounds = [
    {
        id: 0,
        url: bg1,
        subtittle: 'gran catálogo en ropas',
        color: '#C9BCB5',
    },
    {
        id: 1,
        url: bg2,
        subtittle: 'tus marcas favoritas',
        color: '#FED338',
    },
    {
        id: 2,
        url: bg3,
        subtittle: 'lo último en tecnología',
        color: '#232323',
    },
    {
        id: 3,
        url: bg4,
        subtittle: 'articulos para tu hogar',
        color: '#C4C5CD',
    },
    {
        id: 4,
        url: bg5,
        subtittle: 'todo en cosmeticos y cuidado personal',
        color: '#F2EEEC',
    },
];

function App() {
    let [page, setPage] = useState('home');
    let [bg, setBg] = useState(0);
    let [usuario, setUsuario] = useState(null);
    let [productsUser, setProductsUser] = useState([]);
    let [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!usuario) {
            setProductsUser([]);
            setCargando(false);
            return;
        }

        setCargando(true);
        listarProductos()
            .then((data) => {
                const userProducts = data.filter(p => p.id_vendedor === usuario.id);
                setProductsUser(userProducts);
            })
            .catch((err) => console.error("Error al cargar productos:", err))
            .finally(() => setCargando(false));
    }, [usuario]);

    const handleLogin = (u) => {
        setUsuario(u);
        setPage(esAdmin(u) ? 'admin' : 'home');
    };

    const handleLogout = () => {
        setUsuario(null);
        setProductsUser([]);
        setPage('home');
    };

    let [busqueda, setBusqueda] = useState('');

    const irA = (destino) => {
        if (destino === 'catalog') setBusqueda('');
        setPage(destino);
    };

    const buscar = (texto) => {
        setBusqueda(texto);
        setPage('catalog');
    };
    

    const renderPage = () => {
        // sergio complicador
        switch (
            page // podemos agregar mas cosas si es necesario y no tenemos un mar de returns
        ) {
            case 'home':
                return (
                    <Home
                        bg={bg}
                        setBg={setBg}
                        backgrounds={backgrounds}
                        setPage={setPage}
                        onBuscar={buscar}
                    />
                );
            case 'login':
                return <FormLog onLogin={handleLogin} />;
            case 'admin':
                return esAdmin(usuario) ? (
                    <AdminPanel />
                ) : (
                    <p>Acceso restringido</p>
                );
            case 'catalog':
                return (
                    <Catalog
                        key={busqueda}
                        busqueda={busqueda}
                        onBuscar={buscar}
                    />
                );
            case 'carrito':
                return <Carrito />;
            case 'account':
                return (
                  <Account user={usuario} products={productsUser} setProducts={setProductsUser}/>
                )
            default:
                return null;
        }
    };

    return (
        <>
            <NavBar
                page={page}
                setPage={irA}
                usuario={usuario}
                onLogout={handleLogout}
            />
            {renderPage()}
        </>
    );
}

export default App;
