import { useState } from 'react'
import { AdminUsuarios } from './AdminUsuarios'
import { AdminProductos } from './AdminProductos'
import { AdminCategorias } from './AdminCategorias'
import { AdminPedidos } from './AdminPedidos'
import { AdminResenas } from './AdminResenas'
import './Admin.css'

const SECCIONES = [
  { id: 'usuarios', texto: 'Usuarios' },
  { id: 'productos', texto: 'Productos' },
  { id: 'categorias', texto: 'Categorías' },
  { id: 'pedidos', texto: 'Pedidos' },
  { id: 'resenas', texto: 'Reseñas' },
]

export function AdminPanel() {
  const [seccion, setSeccion] = useState('usuarios')

  return (
    <section className="Admin">
      <aside className="Admin-sidebar">
        <h2>Administración</h2>
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={seccion === s.id ? 'Admin-link active' : 'Admin-link'}
            onClick={() => setSeccion(s.id)}
          >
            {s.texto}
          </button>
        ))}
      </aside>

      <div className="Admin-content">
        {seccion === 'usuarios' && <AdminUsuarios />}
        {seccion === 'productos' && <AdminProductos />}
        {seccion === 'categorias' && <AdminCategorias />}
        {seccion === 'pedidos' && <AdminPedidos />}
        {seccion === 'resenas' && <AdminResenas />}
      </div>
    </section>
  )
}