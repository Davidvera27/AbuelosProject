import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './Login.css'; // Import Login-specific styles

const Login = () => {
  const [isLoginActive, setLoginActive] = useState(true);

  const [registerData, setRegisterData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isRegisterButtonDisabled, setRegisterButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});

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

      // Permitir letras y hasta 10 palabras con espacios
      const textOnlyRegex = /^[A-Za-z\s]+$/;

      // Función para contar el número de palabras
      const countWords = (str) => {
        return str.trim().split(/\s+/).length;
      };

      if (!registerData.primer_nombre) {
        newErrors.primer_nombre = 'El primer nombre es obligatorio';
      } else if (!textOnlyRegex.test(registerData.primer_nombre)) {
        newErrors.primer_nombre = 'Solo se permiten letras en el primer nombre';
      } else if (countWords(registerData.primer_nombre) > 10) {
        newErrors.primer_nombre = 'Se permiten hasta 10 palabras en el primer nombre';
      }

      if (!registerData.apellidos) {
        newErrors.apellidos = 'Los apellidos son obligatorios';
      } else if (!textOnlyRegex.test(registerData.apellidos)) {
        newErrors.apellidos = 'Solo se permiten letras en los apellidos';
      } else if (countWords(registerData.apellidos) > 10) {
        newErrors.apellidos = 'Se permiten hasta 10 palabras en los apellidos';
      }

      if (!registerData.email) {
        newErrors.email = 'El correo electrónico es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
        newErrors.email = 'El formato del correo electrónico es inválido';
      }

      if (!registerData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      }

      if (registerData.password !== registerData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      setErrors(newErrors);

      // Validación para habilitar o deshabilitar el botón de registro
      if (Object.keys(newErrors).length === 0 &&
        registerData.primer_nombre &&
        registerData.apellidos &&
        registerData.email &&
        registerData.password &&
        registerData.confirmPassword) {
        setRegisterButtonDisabled(false);
      } else {
        setRegisterButtonDisabled(true);
      }
    };

    validate();
  }, [registerData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

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
        // Si el registro es exitoso, redirigir a la siguiente página
        Swal.fire('Registro exitoso', `¡Bienvenido ${registerData.primer_nombre}!`, 'success');
        window.location.href = `/Registro?id=${result._id}`;
      } else {
        // Si el correo ya está registrado, mostrar el error con SweetAlert2
        Swal.fire('Error', `El correo electrónico ya está registrado a nombre de ${result.nombre}.`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un error durante el registro. Inténtalo más tarde.', 'error');
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

              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirmar Contraseña" 
                value={registerData.confirmPassword} 
                onChange={handleInputChange} 
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

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
