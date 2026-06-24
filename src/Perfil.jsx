import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('Magdiel');
  const [passwordActual, setPasswordActual] = useState('');

  const manejarGuardarPerfil = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', nombre);
  };

  const manejarCerrarSesion = () => {
    // Aquí iría la lógica de Firebase para cerrar sesión
    console.log('Cerrando sesión...');
    navigate('/');
  };

  return (
    <div className="perfil-layout">
      
      {/* Barra superior con botón de Cerrar Sesión */}
      <header className="perfil-header">
        <div className="perfil-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        <button className="btn-cerrar-sesion" onClick={manejarCerrarSesion}>
          <span>Salir</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </header>

      {/* Contenido principal */}
      <main className="perfil-content">
        
        {/* Cabecera del Usuario (Minimalista) */}
        <section className="usuario-identidad">
          <div className="avatar-contenedor">
            <div className="avatar-circulo">M</div>
            <button className="btn-editar-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
          <h1 className="usuario-nombre">Magdiel</h1>
          <p className="usuario-email">magdiel@purecode.com</p>
        </section>

        {/* Formulario de Información Personal */}
        <section className="tarjeta-configuracion">
          <div className="tarjeta-cabecera-gris">
            <span>INFORMACIÓN PERSONAL</span>
          </div>
          <div className="tarjeta-cuerpo">
            <form onSubmit={manejarGuardarPerfil}>
              <div className="grupo-input-perfil">
                <label>NOMBRE PARA MOSTRAR</label>
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn-guardar-cambios">
                Guardar Cambios
              </button>
            </form>
          </div>
        </section>

        {/* Formulario de Seguridad */}
        <section className="tarjeta-configuracion">
          <div className="tarjeta-cabecera-gris">
            <span>SEGURIDAD</span>
          </div>
          <div className="tarjeta-cuerpo">
            <h3 className="titulo-interno">Cambio de Contraseña</h3>
            
            <div className="grupo-input-perfil">
              <label>CONTRASEÑA ACTUAL</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />
            </div>
            
            <button type="button" className="btn-verificar">
              Verificar Identidad
            </button>

            <hr className="linea-separadora" />

            {/* Campos bloqueados hasta verificar identidad (Simulación visual) */}
            <div className="grupo-input-perfil bloqueado">
              <label>NUEVA CONTRASEÑA</label>
              <input type="password" disabled />
            </div>
            <div className="grupo-input-perfil bloqueado">
              <label>CONFIRMAR CONTRASEÑA</label>
              <input type="password" disabled />
            </div>

            <button type="button" className="btn-actualizar-bloqueado" disabled>
              Actualizar Contraseña
            </button>
          </div>
        </section>

        {/* Zona de Riesgo */}
        <section className="tarjeta-configuracion zona-riesgo">
          <div className="tarjeta-cuerpo riesgo-cuerpo">
            <div className="riesgo-texto">
              <h3>Zona de Riesgo</h3>
              <p>Eliminar permanentemente todos los registros y la cuenta.</p>
            </div>
            <button type="button" className="btn-eliminar-cuenta">
              Eliminar Cuenta
            </button>
          </div>
        </section>

      </main>

      {/* Barra de Navegación Inferior Unificada */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Panel</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/conexion')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          <span>Conexión</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/registros')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          <span>Registros</span>
        </button>
        {/* Ítem Activo */}
        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Perfil</span>
        </button>
      </nav>

    </div>
  );
}

export default Perfil;