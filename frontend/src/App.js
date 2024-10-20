import React, { useState } from 'react';
import './assets/css/App.css'; // El CSS que controla los estilos

function App() {
  const [isLoginActive, setLoginActive] = useState(true); // Maneja el estado entre Login y Registro

  const toggleLogin = () => {
    setLoginActive(true);  // Activa el formulario de Login
  };

  const toggleRegister = () => {
    setLoginActive(false); // Activa el formulario de Registro
  };

  return (
    <main>
      <div className="contenedor__todo">
        <div className="caja__trasera">
          <div className="caja__trasera-login">
            <h3>¿Ya tienes una cuenta?</h3>
            <p>Inicia sesión para entrar en la página</p>
            <button onClick={toggleLogin}>Iniciar Sesión</button>
          </div>
          <div className="caja__trasera-register">
            <h3>¿Aún no tienes una cuenta?</h3>
            <p>Regístrate para que puedas iniciar sesión</p>
            <button onClick={toggleRegister}>Registrarse</button>
          </div>
        </div>

        <div 
          className="contenedor__login-register"
          style={{ left: isLoginActive ? "0px" : "410px" }} // Ajustamos la posición
        >
          {isLoginActive ? (
            <form className="formulario__login">
              <h2>Iniciar Sesión</h2>
              <input type="text" placeholder="Correo Electrónico" />
              <input type="password" placeholder="Contraseña" />
              <button>Entrar</button>
            </form>
          ) : (
            <form className="formulario__register">
              <h2>Registrarse</h2>
              <input type="text" placeholder="Nombre completo" />
              <input type="text" placeholder="Correo Electrónico" />
              <input type="text" placeholder="Usuario" />
              <input type="password" placeholder="Contraseña" />
              <button>Registrarse</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;