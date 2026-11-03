import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import * as api from '../services/usuarios.service'
import { conRechazo, errorDeAccion } from './utils'

// Lista de usuarios (panel admin y selector de vendedores en productos).
// Cada vista la carga al montarse y la reinicia al salir.
const initialState = {
  items: [],
  cargado: false,
  error: null,
  requestId: null,
}

export const cargarUsuarios = createAsyncThunk(
  'usuarios/cargar',
  conRechazo(() => api.listarUsuarios())
)

export const crearUsuario = createAsyncThunk(
  'usuarios/crear',
  conRechazo(async (datos) => {
    await api.crearUsuario(datos)
    return api.listarUsuarios()
  })
)

export const actualizarUsuario = createAsyncThunk(
  'usuarios/actualizar',
  conRechazo(async ({ id, datos }) => {
    await api.actualizarUsuario(id, datos)
    return api.listarUsuarios()
  })
)

export const eliminarUsuario = createAsyncThunk(
  'usuarios/eliminar',
  conRechazo(async (id) => {
    await api.eliminarUsuario(id)
    return api.listarUsuarios()
  })
)

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    reiniciarUsuarios: () => initialState,
    limpiarErrorUsuarios: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarUsuarios.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.error = null
      })
      .addCase(cargarUsuarios.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload
        state.cargado = true
      })
      .addCase(cargarUsuarios.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = errorDeAccion(action)
        state.cargado = true
      })

    for (const thunk of [crearUsuario, actualizarUsuario, eliminarUsuario]) {
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

export const { reiniciarUsuarios, limpiarErrorUsuarios } = usuariosSlice.actions
export default usuariosSlice.reducer

export const selectUsuarios = (state) => state.usuarios.items
export const selectUsuariosCargando = (state) => !state.usuarios.cargado
export const selectUsuariosError = (state) => state.usuarios.error

// Solo los usuarios marcados como vendedores
export const selectVendedores = createSelector([selectUsuarios], (items) =>
  items.filter((u) => u.es_vendedor)
)
