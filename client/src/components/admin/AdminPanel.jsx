import { useState } from 'react'
import { AdminUsuarios } from './AdminUsuarios'
import { AdminProductos } from './AdminProductos'
import './Admin.css'

const SECCIONES = [
  { id: 'usuarios', texto: 'Usuarios' },
  { id: 'productos', texto: 'Productos' },
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
      </div>
    </section>
  )
}