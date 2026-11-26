import { createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'

// La navegación, la búsqueda y la categoría del catálogo ya no viven aquí:
// ahora las maneja React Router (ver routes/AppRoutes.jsx y
// hooks/useBusquedaCatalogo.js). Este slice queda solo con el aviso (toast).
const initialState = {
  aviso: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    mostrarAviso: (state, action) => {
      state.aviso = { texto: action.payload }
    },
    limpiarAviso: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.aviso = null
    })
  },
})

export const { mostrarAviso, limpiarAviso } = uiSlice.actions
export default uiSlice.reducer

export const selectAviso = (state) => state.ui.aviso
