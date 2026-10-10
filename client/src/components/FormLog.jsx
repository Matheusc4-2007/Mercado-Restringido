import { useState } from 'react';

export function FormLog() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="Form-container">
      <form className="Form-login" onSubmit={(e) => e.preventDefault()}>
        
        <div className="Select-container">
          <button 
            type="button" 
            className={isLogin ? "Select-button active" : "Select-button"} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            className={!isLogin ? "Select-button active" : "Select-button"} 
            onClick={() => setIsLogin(false)}
          >
            Crear Usuario
          </button>
        </div>

        <h2 className="Form-title">
          {isLogin ? "¡Bienvenido!" : "Crea tu cuenta"}
        </h2>

        {!isLogin && (
          <>
            <input type="text" placeholder="Nombre" className="Form-input" />
            <input type="text" placeholder="Apellido" className="Form-input" />
          </>
        )}
        
        <input type="text" placeholder="Cédula" className="Form-input" />

        {!isLogin && (
          <>
            <input type="date" className="Form-input" title="Fecha de Nacimiento" />
            
            <div className="Checkbox-container">
              <input type="checkbox" id="es_vendedor" className="Form-checkbox" />
              <label htmlFor="es_vendedor">Soy Vendedor</label>
            </div>
          </>
        )}

        <button type="submit" className="Submit-button">
          {isLogin ? "Ingresar" : "Registrarse"}
        </button>

      </form>
    </section>
  );
}