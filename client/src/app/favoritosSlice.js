import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/favoritos.service'
import { logout } from './authSlice'
import { conRechazo, errorDeAccion } from './utils'

// Favoritos del usuario con sesión iniciada. Los usan el catálogo (para marcar
// el corazón de cada producto) y la página "Favoritos"; cada vista la carga al
// montarse y la reinicia al salir.
const initialState = {
  items: [],
  filtro: { idUsuario: '' }, // usuario dueño de la lista actual
  cargado: false,
  error: null,
  requestId: null,
}

export const cargarFavoritos = createAsyncThunk(
  'favoritos/cargar',
  conRechazo(async ({ idUsuario = '' } = {}) => ({
    // sin usuario (sesión cerrada) no hay nada que pedir
    items: idUsuario ? await api.listarFavoritos(idUsuario) : [],
    filtro: { idUsuario },
  }))
)

// Agregar y quitar terminan recargando la lista del usuario
export const agregarFavorito = createAsyncThunk(
  'favoritos/agregar',
  conRechazo(async (datos) => {
    await api.agregarFavorito(datos)
    return api.listarFavoritos(datos.id_usuario)
  })
)

export const quitarFavorito = createAsyncThunk(
  'favoritos/quitar',
  conRechazo(async (id, { getState }) => {
    await api.quitarFavorito(id)
    return api.listarFavoritos(getState().favoritos.filtro.idUsuario)
  })
)

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {
    reiniciarFavoritos: () => initialState,
    limpiarErrorFavoritos: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(cargarFavoritos.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarFavoritos.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return // respuesta vieja
        state.items = action.payload.items
        state.filtro = action.payload.filtro
        state.cargado = true
      })
      .addCase(cargarFavoritos.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

    for (const thunk of [agregarFavorito, quitarFavorito]) {
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

export const { reiniciarFavoritos, limpiarErrorFavoritos } = favoritosSlice.actions
export default favoritosSlice.reducer

export const selectFavoritos = (state) => state.favoritos.items
export const selectFavoritosCargando = (state) => !state.favoritos.cargado
export const selectFavoritosError = (state) => state.favoritos.error
