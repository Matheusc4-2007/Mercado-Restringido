import { createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { mostrarAviso } from './uiSlice'
import { crearPedido } from './pedidosSlice'

// El carrito vive solo en memoria: se vacía al cerrar sesión
// (igual que antes, que se limpiaba el localStorage).
const initialState = {
  items: [],
}

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    // Si el producto ya está suma una unidad, si no lo agrega
    agregarItem: (state, action) => {
      const nuevo = action.payload
      const existe = state.items.find((item) => item.idCompra === nuevo.idCompra)
      if (existe) {
        if (existe.cantidad < existe.stockCompra) existe.cantidad += 1
      } else if (nuevo.stockCompra > 0) {
        state.items.push({ ...nuevo, cantidad: 1 })
      }
    },
    eliminarItem: (state, action) => {
      state.items = state.items.filter((item) => item.idCompra !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      // Pedido creado con éxito: el carrito queda vacío
      .addCase(crearPedido.fulfilled, () => initialState)
  },
})

export const { agregarItem, eliminarItem } = carritoSlice.actions
export default carritoSlice.reducer

// Thunk: agrega al carrito y avisa solo si el producto es nuevo en él
export const agregarAlCarrito = (item) => (dispatch, getState) => {
  const existente = getState().carrito.items.find(
    (i) => i.idCompra === item.idCompra
  )
  if (existente && existente.cantidad >= existente.stockCompra) {
    dispatch(mostrarAviso(`No hay más unidades disponibles de ${item.nombreCompra}`))
    return
  }
  const yaEstaba = Boolean(existente)
  dispatch(agregarItem(item))
  if (!yaEstaba) {
    dispatch(mostrarAviso(`${item.nombreCompra} se ha añadido a su carrito`))
  }
}

export const selectCarrito = (state) => state.carrito.items
export const selectTotalCarrito = (state) =>
  state.carrito.items.reduce(
    (acc, item) => acc + Number(item.precioCompra) * item.cantidad,
    0
  )
