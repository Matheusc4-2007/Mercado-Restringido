import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { esAdmin } from '../utils/admin'
import { iniciarSesion, registrarse, logout } from './authSlice'

// Navegación (la app no usa react router) y aviso global tipo "toast"
const initialState = {
  page: 'home',
  busqueda: '',
  aviso: null, // { texto }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Cambia de página; al entrar al catálogo desde fuera se limpia la búsqueda
    irA: (state, action) => {
      if (action.payload === 'catalog') state.busqueda = ''
      state.page = action.payload
    },
    // Busca y lleva al catálogo
    buscarEnCatalogo: (state, action) => {
      state.busqueda = action.payload
      state.page = 'catalog'
    },
    mostrarAviso: (state, action) => {
      state.aviso = { texto: action.payload }
    },
    limpiarAviso: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.page = 'home'
        state.aviso = null
      })
      // Tras entrar: el admin va a su panel y el resto al inicio
      .addMatcher(
        isAnyOf(iniciarSesion.fulfilled, registrarse.fulfilled),
        (state, action) => {
          state.page = esAdmin(action.payload) ? 'admin' : 'home'
        }
      )
  },
})

export const { irA, buscarEnCatalogo, mostrarAviso, limpiarAviso } = uiSlice.actions
export default uiSlice.reducer

export const selectPage = (state) => state.ui.page
export const selectBusqueda = (state) => state.ui.busqueda
export const selectAviso = (state) => state.ui.aviso
