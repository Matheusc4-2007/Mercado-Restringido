import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  iniciarSesion,
  registrarse,
  limpiarErrorAuth,
  selectAuthCargando,
  selectAuthError,
} from '../app/authSlice';

const FORM_INICIAL = {
  cedula: '',
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  es_vendedor: false,
}

export function FormLog() {
  const dispatch = useDispatch()
  const cargando = useSelector(selectAuthCargando)
  const error = useSelector(selectAuthError)

  const [isLogin, setIsLogin] = useState(true);
  const [datos, setDatos] = useState(FORM_INICIAL)

  // Al entrar al formulario no debe verse un error de un intento anterior
  useEffect(() => {
    dispatch(limpiarErrorAuth())
  }, [dispatch])

  const cambiarModo = (login) => {
    setIsLogin(login)
    dispatch(limpiarErrorAuth())
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Si sale bien, el store guarda al usuario y uiSlice cambia de página
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(isLogin ? iniciarSesion(datos.cedula) : registrarse(datos))
  }

  return (
    <section className="Form-container">
      <form className="Form-login" onSubmit={handleSubmit}>
        
        <div className="Select-container">
          <button 
            type="button" 
            className={isLogin ? "Select-button active" : "Select-button"} 
            onClick={() => cambiarModo(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            className={!isLogin ? "Select-button active" : "Select-button"} 
            onClick={() => cambiarModo(false)}
          >
            Crear Usuario
          </button>
        </div>

        <h2 className="Form-title">
          {isLogin ? "¡Bienvenido!" : "Crea tu cuenta"}
        </h2>

        {!isLogin && (
          <>
            <input 
              type="text" 
              name='nombre'
              placeholder="Nombre" 
              className="Form-input" 
              value={datos.nombre}
              onChange={handleChange}
              required
            />
            <input 
              type="text" 
              name='apellido'
              placeholder="Apellido"
              className="Form-input"
              value={datos.apellido}
              onChange={handleChange}
              required 
            />
          </>
        )}
        
        <input 
          type="text" 
          name='cedula'
          placeholder="Cédula" 
          className="Form-input" 
          inputMode='numeric'
          pattern='\d{5,15}'
          title='Entre 5 y 15 digitos'
          value={datos.cedula}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <input 
              type="date" 
              name='fecha_nacimiento'
              className="Form-input" 
              title="Fecha de Nacimiento"
              value={datos.fecha_nacimiento}
              onChange={handleChange}
              required
            />
            
            <div className="Checkbox-container">
              <input 
                type="checkbox" 
                id="es_vendedor" 
                name="es_vendedor"
                className="Form-checkbox" 
                checked = {datos.es_vendedor}
                onChange={handleChange}
              />
              <label htmlFor="es_vendedor">Soy Vendedor</label>
            </div>
          </>
        )}

        {error && (
          <div className='Form-error' role='alert'>
              <p>{error.message}</p>
              {error.detalles?.length > 0 && (
                  <ul>
                    {error.detalles.map((d)=> <li key={d}>{d}</li>)}
                  </ul>
              )}
          </div>
        )}

        <button type="submit" className="Submit-button" disabled={cargando}>
          {cargando ? "Procesando..." : isLogin ? 'Ingresar' : "Registrarse"}
        </button>

      </form>
    </section>
  );
}