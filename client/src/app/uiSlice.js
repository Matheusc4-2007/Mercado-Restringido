import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { esAdmin } from '../utils/admin'
import { iniciarSesion, registrarse, logout } from './authSlice'

const initialState = {
  page: 'home',
  busqueda: '',
  categoria: '', // id de la categoría filtrada en el catálogo ('' = todas)
  aviso: null, 
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    irA: (state, action) => {
      if (action.payload === 'catalog') {
        state.busqueda = ''
        state.categoria = ''
      }
      state.page = action.payload
    },
    // Busca y lleva al catálogo. Si ya estás en el catálogo se conserva la
    // categoría elegida (buscar dentro de ella); si vienes de otra página, no.
    buscarEnCatalogo: (state, action) => {
      if (state.page !== 'catalog') state.categoria = ''
      state.busqueda = action.payload
      state.page = 'catalog'
    },
    // Filtra el catálogo por categoría ('' = todas)
    filtrarPorCategoria: (state, action) => {
      state.categoria = action.payload
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
      .addMatcher(
        isAnyOf(iniciarSesion.fulfilled, registrarse.fulfilled),
        (state, action) => {
          state.page = esAdmin(action.payload) ? 'admin' : 'home'
        }
      )
  },
})

export const { irA, buscarEnCatalogo, filtrarPorCategoria, mostrarAviso, limpiarAviso } = uiSlice.actions
export default uiSlice.reducer

export const selectPage = (state) => state.ui.page
export const selectBusqueda = (state) => state.ui.busqueda
export const selectCategoriaFiltro = (state) => state.ui.categoria
export const selectAviso = (state) => state.ui.aviso
