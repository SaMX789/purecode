// src/App.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Splash from './components/Splash'; // <-- Importamos tu pantalla de carga
import './App.css'; // Estilos

function App() {
  // 1. Estado para controlar la pantalla de carga (arranca en true)
  const [cargando, setCargando] = useState(true);

  // 2. Estados para guardar lo que el usuario escribe y la UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  const [error, setError] = useState(''); // <-- Estado para manejar errores de login
  const navigate = useNavigate(); // <-- Inicializamos el hook de navegación

  // 3. Temporizador de 3 segundos para apagar el Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 3000);

    return () => clearTimeout(timer); // Limpieza del timer al desmontar
  }, []);

  // 4. Función que se ejecuta al presionar "Iniciar sesión"
  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Creamos nuestros datos de prueba (Mock Data)
    const credencialesSimuladas = {
      email: 'magdiel@purecode.com',
      password: 'admin'
    };

    // Validamos las credenciales ingresadas contra las simuladas
    if (email === credencialesSimuladas.email && password === credencialesSimuladas.password) {
      // Si las credenciales son correctas
      setError(''); // Limpiamos errores
      console.log('Inicio de sesión exitoso. Redirigiendo...');
      navigate('/dashboard'); // Redirigimos al dashboard
    } else  {
      // Si no coinciden, mostramos un error
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  // 5. Condición inicial: Si está cargando, mostramos la gotita y detenemos el renderizado del resto
  if (cargando) {
    return <Splash />;
  }

  // 6. Si ya pasaron los 3 segundos, se muestra el Login con su lógica
  return (
    <div className="contenedor-principal">
      
      {/* Encabezado (Logo y Título de la app) */}
      <header className="encabezado-marca">
        <img src="/icono.png" alt="Logo PureCode" className="logo" />
        <h1 className="titulo-marca">PureCode</h1>
      </header>

      {/* Tarjeta blanca del formulario */}
      <main className="tarjeta-login">
        <h2 className="titulo-bienvenida">Bienvenido</h2>
        <p className="subtitulo">Inicia sesión para monitorear tus redes de sensores.</p>

        <form onSubmit={manejarEnvio}>
          
          {/* Campo de Email */}
          <div className="grupo-input">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@purecode.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="grupo-input">
            <div className="cabecera-password">
              <label htmlFor="password">PASSWORD</label>
              <a href="#" className="link-olvido">¿Olvidaste tu contraseña?</a>
            </div>
            
            <div className="contenedor-password">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="boton-ojito"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Mensaje de error visible en pantalla */}
          {error && <p className="mensaje-error" style={{color: 'red', fontSize: '14px'}}>{error}</p>}

          {/* Botón de Enviar */}
          <button type="submit" className="boton-enviar">
            Iniciar sesión <span>➔</span>
          </button>
          
        </form>

        <hr className="linea-divisora" />
      </main>

      {/* Enlace de Registro (Fuera de la tarjeta) */}
      <div className="enlace-registro">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </div>

    </div>
  );

  
}

export default App;