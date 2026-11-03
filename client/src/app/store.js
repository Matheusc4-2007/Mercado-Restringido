import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import carritoReducer from './carritoSlice'
import productosReducer from './productosSlice'
import usuariosReducer from './usuariosSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    carrito: carritoReducer,
    productos: productosReducer,
    usuarios: usuariosReducer,
  },
})
