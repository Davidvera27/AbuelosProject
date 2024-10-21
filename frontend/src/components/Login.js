// Archivo: Login.js
import React, { useState, useEffect } from 'react';
import './Login.css'; // Importar estilos

const Login = () => {
  const [isLoginActive, setLoginActive] = useState(true);

  // Estado para los campos de registro
  const [registerData, setRegisterData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    apellidos: '',
    email: '',
    password: ''
  });

  // Estado para controlar la activación del botón "Registrarse"
  const [isRegisterButtonDisabled, setRegisterButtonDisabled] = useState(true);

  // Estado para los errores de validación
  const [errors, setErrors] = useState({});

  // Función para cambiar entre Login y Registro
  const toggleLogin = () => {
    setLoginActive(true);
  };

  const toggleRegister = () => {
    setLoginActive(false);
  };

  // Validar los campos obligatorios y el formato del correo
  useEffect(() => {
    const validate = () => {
      let newErrors = {};
      
      if (!registerData.primer_nombre) {
        newErrors.primer_nombre = 'El primer nombre es obligatorio';
      }

      if (!registerData.apellidos) {
        newErrors.apellidos = 'Los apellidos son obligatorios';
      }

      if (!registerData.email) {
        newErrors.email = 'El correo electrónico es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
        newErrors.email = 'El formato del correo electrónico es inválido';
      }

      if (!registerData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      }

      setErrors(newErrors);

      // Verificar si todos los campos están completos y no hay errores
      if (Object.keys(newErrors).length === 0 &&
          registerData.primer_nombre && 
          registerData.apellidos && 
          registerData.email && 
          registerData.password) {
        setRegisterButtonDisabled(false); // Habilitar el botón
      } else {
        setRegisterButtonDisabled(true); // Deshabilitar el botón
      }
    };

    validate();
  }, [registerData]);

  // Manejar el cambio en los inputs de registro
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  // Enviar datos del formulario al backend y redirigir al segundo formulario
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = `/Registro?id=${result._id}`; // Redirigir al segundo formulario con el ID del usuario
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

        <div className="contenedor__login-register" style={{ left: isLoginActive ? "0px" : "410px" }}>
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
              <input 
                type="text" 
                name="primer_nombre" 
                placeholder="Primer nombre" 
                value={registerData.primer_nombre} 
                onChange={handleInputChange} 
              />
              {errors.primer_nombre && <span className="error-message">{errors.primer_nombre}</span>}
              
              <input 
                type="text" 
                name="segundo_nombre" 
                placeholder="Segundo nombre" 
                value={registerData.segundo_nombre} 
                onChange={handleInputChange} 
              />
              
              <input 
                type="text" 
                name="apellidos" 
                placeholder="Apellidos" 
                value={registerData.apellidos} 
                onChange={handleInputChange} 
              />
              {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}

              <input 
                type="text" 
                name="email" 
                placeholder="Correo Electrónico" 
                value={registerData.email} 
                onChange={handleInputChange} 
              />
              {errors.email && <span className="error-message">{errors.email}</span>}

              <input 
                type="password" 
                name="password" 
                placeholder="Contraseña" 
                value={registerData.password} 
                onChange={handleInputChange} 
              />
              {errors.password && <span className="error-message">{errors.password}</span>}

              <button 
                type="button" 
                onClick={handleRegister} 
                disabled={isRegisterButtonDisabled}
                className={isRegisterButtonDisabled ? 'inactive-button' : ''}
              >
                Registrarse
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
