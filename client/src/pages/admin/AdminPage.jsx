import { NavLink, Outlet } from 'react-router-dom'
import './Admin.css'

// Cada sección es una ruta hija: /admin/usuarios, /admin/productos, ...
const SECCIONES = [
  { ruta: 'usuarios', texto: 'Usuarios' },
  { ruta: 'productos', texto: 'Productos' },
  { ruta: 'categorias', texto: 'Categorías' },
  { ruta: 'pedidos', texto: 'Pedidos' },
  { ruta: 'resenas', texto: 'Reseñas' },
]

export function AdminPage() {
  return (
    <section className="Admin">
      <aside className="Admin-sidebar">
        <h2>Administración</h2>
        {SECCIONES.map((s) => (
          <NavLink
            key={s.ruta}
            to={s.ruta}
            className={({ isActive }) => (isActive ? 'Admin-link active' : 'Admin-link')}
          >
            {s.texto}
          </NavLink>
        ))}
      </aside>

      <div className="Admin-content">
        <Outlet />
      </div>
    </section>
  )
}
