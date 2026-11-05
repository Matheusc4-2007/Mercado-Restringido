import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export function useCargaLista(cargar, reiniciar, argumento) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(cargar(argumento))
    return () => {
      dispatch(reiniciar())
    }
  }, [dispatch, cargar, reiniciar, argumento])
}
