// src/App.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Splash from './components/Splash'; // <-- Importamos tu pantalla de carga
import './App.css'; // Estilos
import { iniciarSesion } from './Registrar.js'; // <-- Ajusta la ruta si es diferente

function App() {
  // 1. Estado para controlar la pantalla de carga (arranca en true)
  const [cargando, setCargando] = useState(true);

  // 2. Estados para guardar lo que el usuario escribe y la UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  const [error, setError] = useState(''); // <-- Estado para manejar errores de login

  const [procesandoLogin, setProcesandoLogin] = useState(false);

  const navigate = useNavigate(); // <-- Inicializamos el hook de navegación

  // 3. Temporizador de 3 segundos para apagar el Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 3000);

    return () => clearTimeout(timer); // Limpieza del timer al desmontar
  }, []);

  // 4. Función que se ejecuta al presionar "Iniciar sesión"
  const manejarEnvio = async (e) => {
    e.preventDefault();

    setProcesandoLogin(true); // Mostramos "Cargando..." en el botón
    setError(''); // Limpiamos errores previos

    // NUEVO: Llamamos a Firebase para verificar al usuario
    const resultado = await iniciarSesion(email, password);

    if (resultado.exito) {
      console.log('Inicio de sesión exitoso. Redirigiendo...');
      navigate('/dashboard'); 
    } else {
      // CAMBIO: Personalizamos el error dependiendo de qué falló en Firebase
      if (resultado.error === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else if (resultado.error === 'auth/user-not-found') {
         setError('No existe una cuenta con este correo.');
      } else if (resultado.error === 'auth/too-many-requests') {
         setError('Cuenta temporalmente bloqueada por muchos intentos fallidos.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.');
      }
    }
    
    setProcesandoLogin(false);

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
            <label htmlFor="email">CORREO ELECTRÓNICO</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="grupo-input">
            <div className="cabecera-password">
              <label htmlFor="password">CONTRASEÑA</label>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mostrarPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
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