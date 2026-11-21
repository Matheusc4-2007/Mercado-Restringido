import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/resenas.service'
import { consultarCompra } from '../services/pedidos.service'
import { conRechazo, errorDeAccion } from './utils'

// Reseñas de un producto (modal del producto) o todas (panel admin).
// Cada vista la carga al montarse y la reinicia al salir.
const initialState = {
  items: [],
  filtro: { idProducto: '' }, // filtro aplicado a la lista actual
  cargado: false,
  error: null,
  requestId: null,
  compro: null,
  compraRequestId: null,
}

export const cargarResenas = createAsyncThunk(
  'resenas/cargar',
  conRechazo(async ({ idProducto = '' } = {}) => ({
    items: await api.listarResenas({ idProducto }),
    filtro: { idProducto },
  }))
)

export const verificarCompra = createAsyncThunk(
  'resenas/verificarCompra',
  conRechazo((datos) => consultarCompra(datos))
)

// Crear, actualizar y eliminar terminan recargando la lista con el filtro vigente
const recargar = (getState) => api.listarResenas(getState().resenas.filtro)

export const crearResena = createAsyncThunk(
  'resenas/crear',
  conRechazo(async (datos, { getState }) => {
    await api.crearResena(datos)
    return recargar(getState)
  })
)

export const actualizarResena = createAsyncThunk(
  'resenas/actualizar',
  conRechazo(async ({ id, datos }, { getState }) => {
    await api.actualizarResena(id, datos)
    return recargar(getState)
  })
)

export const eliminarResena = createAsyncThunk(
  'resenas/eliminar',
  conRechazo(async (id, { getState }) => {
    await api.eliminarResena(id)
    return recargar(getState)
  })
)

const resenasSlice = createSlice({
  name: 'resenas',
  initialState,
  reducers: {
    reiniciarResenas: () => initialState,
    limpiarErrorResenas: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarResenas.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarResenas.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // respuesta vieja
        state.items = action.payload.items
        state.filtro = action.payload.filtro
        state.cargado = true
      })
      .addCase(cargarResenas.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

    builder
      .addCase(verificarCompra.pending, (state, action) => {
        state.compraRequestId = action.meta.requestId
        state.compro = null
      })
      .addCase(verificarCompra.fulfilled, (state, action) => {
        if (state.compraRequestId !== action.meta.requestId) return // respuesta vieja
        state.compro = action.payload.compro
      })
      .addCase(verificarCompra.rejected, (state, action) => {
        if (state.compraRequestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
      })

    for (const thunk of [crearResena, actualizarResena, eliminarResena]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.items = action.payload
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = errorDeAccion(action)
        })
    }
  },
})

export const { reiniciarResenas, limpiarErrorResenas } = resenasSlice.actions
export default resenasSlice.reducer

export const selectResenas = (state) => state.resenas.items
export const selectResenasCargando = (state) => !state.resenas.cargado
export const selectResenasError = (state) => state.resenas.error
export const selectCompro = (state) => state.resenas.compro

// Promedio de calificación de la lista cargada (null si no hay reseñas)
export const selectPromedioResenas = createSelector([selectResenas], (items) =>
  items.length === 0
    ? null
    : items.reduce((acc, r) => acc + r.calificacion, 0) / items.length
)
