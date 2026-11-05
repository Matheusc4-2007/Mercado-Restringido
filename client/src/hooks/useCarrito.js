import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  agregarAlCarrito,
  eliminarItem,
  selectCarrito,
  selectTotalCarrito,
} from '../app/carritoSlice'

export function useCarrito() {
  const dispatch = useDispatch()
  const items = useSelector(selectCarrito)
  const total = useSelector(selectTotalCarrito)

  const agregar = useCallback((item) => dispatch(agregarAlCarrito(item)), [dispatch])
  const quitar = useCallback((id) => dispatch(eliminarItem(id)), [dispatch])

  return { items, total, agregar, quitar }
}
