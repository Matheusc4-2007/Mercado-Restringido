import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import carritoReducer from './carritoSlice'
import productosReducer from './productosSlice'
import usuariosReducer from './usuariosSlice'
import categoriasReducer from './categoriasSlice'
import pedidosReducer from './pedidosSlice'
import resenasReducer from './resenasSlice'
import favoritosReducer from './favoritosSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    carrito: carritoReducer,
    productos: productosReducer,
    usuarios: usuariosReducer,
    categorias: categoriasReducer,
    pedidos: pedidosReducer,
    resenas: resenasReducer,
    favoritos: favoritosReducer,
  },
})
