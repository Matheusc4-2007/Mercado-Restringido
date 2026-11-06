import { useSelector } from 'react-redux'
import { useCargaLista } from '../../hooks/useCargaLista'
import { useCrud } from '../../hooks/useCrud'
import {
  cargarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  reiniciarCategorias,
  limpiarErrorCategorias,
  selectCategorias,
  selectCategoriasCargando,
  selectCategoriasError,
} from '../../app/categoriasSlice'
import { MensajeError } from './MensajeError'
import { FormCategoria } from './FormCategoria'
import { TablaCategorias } from './TablaCategorias'
import loading from '../../assets/loading-icon.svg'

export function AdminCategorias() {
  const categorias = useSelector(selectCategorias)
  const cargando = useSelector(selectCategoriasCargando)
  const error = useSelector(selectCategoriasError)

  // Carga la lista al entrar y la limpia al salir
  useCargaLista(cargarCategorias, reiniciarCategorias)

  const { idEditando, editando, editar, cancelar, guardar, eliminar } = useCrud(
    categorias,
    {
      crear: crearCategoria,
      actualizar: actualizarCategoria,
      eliminar: eliminarCategoria,
      limpiarError: limpiarErrorCategorias,
    },
    (categoria) => `¿Eliminar la categoría "${categoria.nombre}"?`
  )

  return (
    <div>
      <h2>Categorías</h2>

      <MensajeError error={error} />

      <FormCategoria
        key={idEditando ?? 'nueva'}
        categoria={editando}
        onGuardar={guardar}
        onCancelar={cancelar}
      />

      {cargando ? (
        <>
          <img src={loading} alt="Cargando" className="Loading-icon" />
          <p className="Result-text">Cargando categorías...</p>
        </>
      ) : (
        <TablaCategorias
          categorias={categorias}
          onEditar={editar}
          onEliminar={eliminar}
        />
      )}
    </div>
  )
}
