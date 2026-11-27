import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { CatalogoPage } from '../pages/CatalogoPage';
import { LoginPage } from '../pages/LoginPage';
import { CarritoPage } from '../pages/CarritoPage';
import { MisPedidosPage } from '../pages/MisPedidosPage';
import { FavoritosPage } from '../pages/FavoritosPage';
import { CuentaPage } from '../pages/CuentaPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminPage } from '../pages/admin/AdminPage';
import { AdminUsuariosPage } from '../pages/admin/AdminUsuariosPage';
import { AdminProductosPage } from '../pages/admin/AdminProductosPage';
import { AdminCategoriasPage } from '../pages/admin/AdminCategoriasPage';
import { AdminPedidosPage } from '../pages/admin/AdminPedidosPage';
import { AdminResenasPage } from '../pages/admin/AdminResenasPage';

// TEMPORAL: es la misma comprobación que antes hacía App.jsx con sus ternarios.
// Se reemplazará por guardas de ruta cuando exista la autenticación con JWT.
// Ya existe jeje
function Restringido({ permitido, children }) {
    return permitido ? children : <Navigate to="/" replace />;
}

export function AppRoutes() {
    const { estaLogueado, esAdmin, esVendedor } = useAuth();

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalogo" element={<CatalogoPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="carrito" element={<CarritoPage />} />

                <Route
                    path="pedidos"
                    element={
                        <Restringido permitido={estaLogueado}>
                            <MisPedidosPage />
                        </Restringido>
                    }
                />
                <Route
                    path="favoritos"
                    element={
                        <Restringido permitido={estaLogueado}>
                            <FavoritosPage />
                        </Restringido>
                    }
                />
                <Route
                    path="cuenta"
                    element={
                        <Restringido permitido={esVendedor}>
                            <CuentaPage />
                        </Restringido>
                    }
                />

                <Route
                    path="admin"
                    element={
                        <Restringido permitido={esAdmin}>
                            <AdminPage />
                        </Restringido>
                    }
                >
                    <Route index element={<Navigate to="usuarios" replace />} />
                    <Route path="usuarios" element={<AdminUsuariosPage />} />
                    <Route path="productos" element={<AdminProductosPage />} />
                    <Route path="categorias" element={<AdminCategoriasPage />} />
                    <Route path="pedidos" element={<AdminPedidosPage />} />
                    <Route path="resenas" element={<AdminResenasPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
