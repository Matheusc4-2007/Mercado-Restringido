import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/pedidos.service'
import { logout } from './authSlice'
import { conRechazo, errorDeAccion } from './utils'

// Lista de pedidos. La comparten "Mis pedidos" (filtrada por comprador) y el
// panel admin (todos); cada vista la carga al montarse y la reinicia al salir.
const initialState = {
  items: [],
  filtro: { idComprador: '' }, // filtro aplicado a la lista actual
  cargado: false,
  error: null,
  requestId: null,
}

export const cargarPedidos = createAsyncThunk(
  'pedidos/cargar',
  conRechazo(async ({ idComprador = '' } = {}) => ({
    items: await api.listarPedidos({ idComprador }),
    filtro: { idComprador },
  }))
)

// Devuelve el pedido creado. El carrito se vacía escuchando crearPedido.fulfilled
// (ver carritoSlice); la lista se carga cuando se abre "Mis pedidos".
export const crearPedido = createAsyncThunk(
  'pedidos/crear',
  conRechazo((datos) => api.crearPedido(datos))
)

// Al cambiar el estado se recarga la lista con el filtro vigente
export const cambiarEstadoPedido = createAsyncThunk(
  'pedidos/cambiarEstado',
  conRechazo(async ({ id, estado }, { getState }) => {
    await api.cambiarEstadoPedido(id, estado)
    return api.listarPedidos(getState().pedidos.filtro)
  })
)

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  reducers: {
    reiniciarPedidos: () => initialState,
    limpiarErrorPedidos: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(cargarPedidos.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarPedidos.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // respuesta vieja
        state.items = action.payload.items
        state.filtro = action.payload.filtro
        state.cargado = true
      })
      .addCase(cargarPedidos.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

      .addCase(crearPedido.pending, (state) => {
        state.error = null
      })
      .addCase(crearPedido.rejected, (state, action) => {
        state.error = errorDeAccion(action)
      })

      .addCase(cambiarEstadoPedido.pending, (state) => {
        state.error = null
      })
      .addCase(cambiarEstadoPedido.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(cambiarEstadoPedido.rejected, (state, action) => {
        state.error = errorDeAccion(action)
      })
  },
})

export const { reiniciarPedidos, limpiarErrorPedidos } = pedidosSlice.actions
export default pedidosSlice.reducer

export const selectPedidos = (state) => state.pedidos.items
export const selectPedidosCargando = (state) => !state.pedidos.cargado
export const selectPedidosError = (state) => state.pedidos.error
