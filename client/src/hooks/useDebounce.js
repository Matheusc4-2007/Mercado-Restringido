import { useEffect, useState } from 'react'

export function useDebounce(valor, delay = 500) {
  const [valorEspera, setValorEspera] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setValorEspera(valor), delay)
    return () => clearTimeout(temporizador)
  }, [valor, delay])

  return valorEspera
}
