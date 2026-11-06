import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/productos.service'
import { conRechazo, errorDeAccion } from './utils'

// Lista de productos. La comparten el catálogo, el panel admin y la cuenta
// del vendedor; cada vista la carga al montarse y la reinicia al salir.
const initialState = {
  items: [],
  filtro: { nombre: '', idCategoria: '' }, // filtros aplicados a la lista actual
  cargado: false, // true cuando terminó la primera carga (éxito o error)
  error: null,
  requestId: null, // última carga pedida, para descartar respuestas viejas
}

export const cargarProductos = createAsyncThunk(
  'productos/cargar',
  conRechazo(async ({ nombre = '', idCategoria = '' } = {}) => ({
    items: await api.listarProductos({ nombre, idCategoria }),
    filtro: { nombre, idCategoria },
  }))
)

// Crear, actualizar y eliminar terminan recargando la lista con el filtro
// vigente: el servidor es la fuente de verdad (ids, vendedor y categoría).
const recargar = (getState) => api.listarProductos(getState().productos.filtro)

export const crearProducto = createAsyncThunk(
  'productos/crear',
  conRechazo(async (datos, { getState }) => {
    await api.crearProducto(datos)
    return recargar(getState)
  })
)

export const actualizarProducto = createAsyncThunk(
  'productos/actualizar',
  conRechazo(async ({ id, datos }, { getState }) => {
    await api.actualizarProducto(id, datos)
    return recargar(getState)
  })
)

export const eliminarProducto = createAsyncThunk(
  'productos/eliminar',
  conRechazo(async (id, { getState }) => {
    await api.eliminarProducto(id)
    return recargar(getState)
  })
)

const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    reiniciarProductos: () => initialState,
    limpiarErrorProductos: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarProductos.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarProductos.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // respuesta vieja
        state.items = action.payload.items
        state.filtro = action.payload.filtro
        state.cargado = true
      })
      .addCase(cargarProductos.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

    for (const thunk of [crearProducto, actualizarProducto, eliminarProducto]) {
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

export const { reiniciarProductos, limpiarErrorProductos } = productosSlice.actions
export default productosSlice.reducer

export const selectProductos = (state) => state.productos.items
export const selectFiltroProductos = (state) => state.productos.filtro
export const selectProductosCargando = (state) => !state.productos.cargado
export const selectProductosError = (state) => state.productos.error

// Productos de un vendedor (cuenta del vendedor)
export const selectProductosDeVendedor = createSelector(
  [selectProductos, (_state, idVendedor) => idVendedor],
  (items, idVendedor) => items.filter((p) => p.id_vendedor === idVendedor)
)
