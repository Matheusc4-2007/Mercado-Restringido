import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { esAdmin as comprobarAdmin } from '../utils/admin'
import {
  iniciarSesion,
  registrarse,
  logout,
  limpiarErrorAuth,
  selectUsuario,
  selectAuthCargando,
  selectAuthError,
} from '../app/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const usuario = useSelector(selectUsuario)
  const cargando = useSelector(selectAuthCargando)
  const error = useSelector(selectAuthError)

  const entrar = useCallback((cedula) => dispatch(iniciarSesion(cedula)), [dispatch])
  const registrar = useCallback((datos) => dispatch(registrarse(datos)), [dispatch])
  const cerrarSesion = useCallback(() => dispatch(logout()), [dispatch])
  const limpiarError = useCallback(() => dispatch(limpiarErrorAuth()), [dispatch])

  return {
    usuario,
    estaLogueado: Boolean(usuario),
    esAdmin: comprobarAdmin(usuario),
    esVendedor: Boolean(usuario?.es_vendedor),
    cargando,
    error,
    iniciarSesion: entrar,
    registrarse: registrar,
    cerrarSesion,
    limpiarError,
  }
}
