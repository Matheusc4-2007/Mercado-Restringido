import { useCallback, useRef, useState } from 'react'

/**
 * Maneja el estado de un formulario controlado.
 *
 * @param valoresIniciales  objeto con el valor inicial de cada campo
 * @param onSubmit          función (datos) que envía el formulario; puede ser
 *                          async y, si devuelve true, se considera un éxito
 * @param opciones.limpiarSiExito  vuelve a los valores iniciales cuando
 *                          onSubmit devuelve true (útil al crear registros)
 *
 * Devuelve: datos, handleChange (soporta inputs de texto y checkbox, usando
 * el atributo `name`), handleSubmit, enviando y resetear.
 */
export function useForm(valoresIniciales, onSubmit, { limpiarSiExito = false } = {}) {
  const [datos, setDatos] = useState(valoresIniciales)
  const [enviando, setEnviando] = useState(false)
  // Los valores iniciales se recuerdan para poder volver a ellos al resetear
  const iniciales = useRef(valoresIniciales)

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }, [])

  const resetear = useCallback(() => setDatos(iniciales.current), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const ok = await onSubmit(datos)
      if (ok === true && limpiarSiExito) resetear()
    } finally {
      setEnviando(false)
    }
  }

  return { datos, handleChange, handleSubmit, enviando, resetear }
}
