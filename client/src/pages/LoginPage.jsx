import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { esAdmin } from '../utils/admin';

const FORM_INICIAL = {
  cedula: '',
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  es_vendedor: false,
}

export function LoginPage() {
  const { cargando, error, iniciarSesion, registrarse, limpiarError } = useAuth()
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()

  // Si sale bien, el store guarda al usuario y se navega: el admin entra a
  // /admin y los demás a la página de inicio.
  const { datos, handleChange, handleSubmit } = useForm(FORM_INICIAL, async (datos) => {
    const res = await (isLogin ? iniciarSesion(datos.cedula) : registrarse(datos))
    if (res.meta.requestStatus !== 'fulfilled') return false
    navigate(esAdmin(res.payload) ? '/admin' : '/')
    return true
  })

  
  useEffect(() => {
    limpiarError()
  }, [limpiarError])

  const cambiarModo = (login) => {
    setIsLogin(login)
    limpiarError()
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