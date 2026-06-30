import { useState } from 'react';
import './Registro.css'; // Importación del CSS exclusivo del módulo
import { Link, useNavigate} from 'react-router-dom';
import { registrarUsuario } from './Registrar.js';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  const navigate = useNavigate();

  const manejarRegistro =async (e) => {
    e.preventDefault();
    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const resultado = await registrarUsuario(nombre, email, password);
    // 2. Evaluamos la propiedad 'exito' dentro de ese objeto
    if (resultado.exito) {
      alert("Verifique su correo electronico para activar la cuenta");
      navigate("/");
    } else {
      // 3. (Opcional pero recomendado) Puedes manejar errores específicos de Firebase
      if (resultado.error === 'auth/email-already-in-use') {
        alert("Error: Este correo electrónico ya está registrado.");
      } else if (resultado.error === 'auth/weak-password') {
        alert("Error: La contraseña es demasiado débil (mínimo 6 caracteres).");
      } else {
        alert("Error: No se pudo realizar el registro. Código: " + resultado.error);
      }
    }
  };

  return (
    <div className="registro-layout">
      
      {/* Barra de navegación superior */}
      <header className="registro-navbar">
        <div className="registro-navbar-contenido">
          <svg className="registro-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6c.6 0 1.2-.2 1.8-.6L5.5 4a4 4 0 0 1 5 0l1.7 1.4a4 4 0 0 0 5 0L18.9 4a4 4 0 0 1 5 0"></path>
            <path d="M2 12c.6 0 1.2-.2 1.8-.6L5.5 10a4 4 0 0 1 5 0l1.7 1.4a4 4 0 0 0 5 0l1.7-1.4a4 4 0 0 1 5 0"></path>
            <path d="M2 18c.6 0 1.2-.2 1.8-.6L5.5 16a4 4 0 0 1 5 0l1.7 1.4a4 4 0 0 0 5 0l1.7-1.4a4 4 0 0 1 5 0"></path>
          </svg>
          <h1 className="registro-titulo-marca">PureCode</h1>
        </div>
      </header>

      {/* Contenedor centralizado */}
      <div className="registro-contenedor">
        <main className="registro-tarjeta">
          <h2 className="registro-bienvenida">Crea tu cuenta</h2>
          <p className="registro-subtitulo">Ingresa tus datos para comenzar a monitorear.</p>

          <form onSubmit={manejarRegistro}>
            
            {/* Nombre Completo */}
            <div className="registro-grupo-input">
              <label htmlFor="nombre">NOMBRE COMPLETO</label>
              <input
                type="text"
                id="nombre"
                placeholder="Ingresa tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="registro-grupo-input">
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

            {/* Password */}
            <div className="registro-grupo-input">
              <label htmlFor="password">CONTRASEÑA</label>
              <div className="registro-contenedor-password">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="registro-boton-ojito" onClick={() => setMostrarPassword(!mostrarPassword)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mostrarPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
            <div className="registro-grupo-input">
              <label htmlFor="confirmarPassword">CONFIRMAR CONTRASEÑA</label>
              <div className="registro-contenedor-password">
                <input
                  type={mostrarConfirmarPassword ? "text" : "password"}
                  id="confirmarPassword"
                  placeholder="••••••••"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                />
                <button type="button" className="registro-boton-ojito" onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mostrarConfirmarPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Banner de Firebase Auth */}
            <div className="registro-banner-firebase">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
              <span>BACKEND DE FIREBASE AUTH</span>
            </div>

            <button type="submit" className="registro-boton-enviar">
              Registrarse 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            
          </form>

          {/* Enlace dentro de la tarjeta */}
          <div className="registro-enlace-login">
            ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
          </div>

        </main>
      </div>

      {/* Footer de la página */}
      <footer className="registro-footer">
        <p>© 2026 PureCode Environmental. Todos los derechos reservados.</p>
        <div className="registro-footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Documentación Técnica</a>
        </div>
      </footer>
    </div>
  );
}

export default Registro;