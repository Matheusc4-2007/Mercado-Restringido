import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/categorias.service'
import { conRechazo, errorDeAccion } from './utils'

// Lista de categorías (panel admin y selectores de los formularios de producto
// y del catálogo). Cada vista la carga al montarse y la reinicia al salir.
const initialState = {
  items: [],
  cargado: false,
  error: null,
  requestId: null,
}

export const cargarCategorias = createAsyncThunk(
  'categorias/cargar',
  conRechazo(() => api.listarCategorias())
)

// Crear, actualizar y eliminar terminan recargando la lista: así
// total_productos siempre viene al día desde el servidor.
export const crearCategoria = createAsyncThunk(
  'categorias/crear',
  conRechazo(async (datos) => {
    await api.crearCategoria(datos)
    return api.listarCategorias()
  })
)

export const actualizarCategoria = createAsyncThunk(
  'categorias/actualizar',
  conRechazo(async ({ id, datos }) => {
    await api.actualizarCategoria(id, datos)
    return api.listarCategorias()
  })
)

export const eliminarCategoria = createAsyncThunk(
  'categorias/eliminar',
  conRechazo(async (id) => {
    await api.eliminarCategoria(id)
    return api.listarCategorias()
  })
)

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    reiniciarCategorias: () => initialState,
    limpiarErrorCategorias: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarCategorias.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarCategorias.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // respuesta vieja
        state.items = action.payload
        state.cargado = true
      })
      .addCase(cargarCategorias.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

    for (const thunk of [crearCategoria, actualizarCategoria, eliminarCategoria]) {
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

export const { reiniciarCategorias, limpiarErrorCategorias } = categoriasSlice.actions
export default categoriasSlice.reducer

export const selectCategorias = (state) => state.categorias.items
export const selectCategoriasCargando = (state) => !state.categorias.cargado
export const selectCategoriasError = (state) => state.categorias.error
