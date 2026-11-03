import { createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { mostrarAviso } from './uiSlice'

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
      if (existe) existe.cantidad += 1
      else state.items.push({ ...nuevo, cantidad: 1 })
    },
    eliminarItem: (state, action) => {
      state.items = state.items.filter((item) => item.idCompra !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState)
  },
})

export const { agregarItem, eliminarItem } = carritoSlice.actions
export default carritoSlice.reducer

// Thunk: agrega al carrito y avisa solo si el producto es nuevo en él
export const agregarAlCarrito = (item) => (dispatch, getState) => {
  const yaEstaba = getState().carrito.items.some(
    (i) => i.idCompra === item.idCompra
  )
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
