import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { buscarPorCedula, crearUsuario } from '../services/usuarios.service'
import { conRechazo, errorDeAccion } from './utils'

// Iniciar sesión = buscar al usuario por su cédula
export const iniciarSesion = createAsyncThunk(
  'auth/iniciarSesion',
  conRechazo((cedula) => buscarPorCedula(cedula))
)

// Registrar devuelve el usuario creado, así que entra directo
export const registrarse = createAsyncThunk(
  'auth/registrarse',
  conRechazo((datos) => crearUsuario(datos))
)

const initialState = {
  usuario: null,
  cargando: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    limpiarErrorAuth: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(iniciarSesion.pending, registrarse.pending), (state) => {
        state.cargando = true
        state.error = null
      })
      .addMatcher(
        isAnyOf(iniciarSesion.fulfilled, registrarse.fulfilled),
        (state, action) => {
          state.cargando = false
          state.usuario = action.payload
        }
      )
      .addMatcher(
        isAnyOf(iniciarSesion.rejected, registrarse.rejected),
        (state, action) => {
          state.cargando = false
          state.error = errorDeAccion(action)
        }
      )
  },
})

export const { logout, limpiarErrorAuth } = authSlice.actions
export default authSlice.reducer

export const selectUsuario = (state) => state.auth.usuario
export const selectAuthCargando = (state) => state.auth.cargando
export const selectAuthError = (state) => state.auth.error
