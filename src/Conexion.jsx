import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEstadoDispositivo } from './datosph'; // <-- CORREGIDO: Ahora coincide exactamente con tu datosph.js
import './Conexion.css';

function Conexion() {
  const navigate = useNavigate();

  // Estados para capturar las credenciales de la red (Original de tus compañeros)
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  // =========================================================
  // ESTADOS DINÁMICOS CORREGIDOS
  // =========================================================
  const [estaEnLinea, setEstaEnLinea] = useState(false);
  const [calidadSenal, setCalidadSenal] = useState('Sin Señal (0%)');

  // Temporizador en segundo plano que revisa el estado cada 4 segundos
  useEffect(() => {
    const verificarRed = async () => {
      const enLinea = await obtenerEstadoDispositivo(); // <-- CORREGIDO: Llamamos a la función correcta
      setEstaEnLinea(enLinea);
      
      if (enLinea) {
        setCalidadSenal('Excelente (98%)');
      } else {
        setCalidadSenal('Sin Señal (0%)');
      }
    };

    verificarRed(); // Ejecuta inmediatamente al abrir la pestaña
    const intervalo = setInterval(verificarRed, 4000); // Bucle automático

    return () => clearInterval(intervalo);
  }, []);

  // Función para manejar el envío del formulario (Original de tus compañeros)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí conectarás la lógica para enviar los datos al ESP32
    console.log('Enviando credenciales al ESP32...', { ssid, password });
    
    alert(`Enviando credenciales...\nRed: ${ssid}`);
    
    // Opcional: Limpiar los campos después del envío
    // setSsid('');
    // setPassword('');
  };

  return (
    <div className="conexion-layout">
      
      {/* Barra superior (Original) */}
      <header className="conexion-header">
        <div className="conexion-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        <div className="conexion-user-actions">
          <div className="user-avatar" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
            M
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="conexion-content">
        <h1 className="titulo-seccion">Estado de Conexión</h1>

        {/* Tarjeta 1: Estado Principal (FUSIONADA DINÁMICA) */}
        <section className="card-estado-principal">
          <div className="anillos-concentricos">
            <div className="caja-estado">
              {/* Cambia dinámicamente de color: verde si está en línea, rojo si se desconecta */}
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: estaEnLinea ? '#23C48E' : '#D3435C',
                  marginRight: '8px',
                  display: 'inline-block'
                }}
              ></div>
              <span className="texto-activo">
                {estaEnLinea ? "Activo" : "Desconectado"}
              </span>
            </div>
          </div>
          <div className="info-estado">
            <h3>Estado: {estaEnLinea ? "En línea" : "Desconectado"}</h3>
            <p>ID del Dispositivo ESP32:</p>
          </div>
        </section>

        {/* Tarjeta 3: Calidad de Señal (FUSIONADA DINÁMICA) */}
        <section className="tarjeta-senal">
          <div className="senal-info">
            <span className="etiqueta-blanca-transparente">CALIDAD DE SEÑAL</span>
            <h3>{calidadSenal}</h3>
          </div>
          <div className="senal-icono">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Modifica la opacidad del triángulo si no hay señal para dar efecto visual */}
              <polygon points="0,100 100,100 100,0" fill="white" fillOpacity={estaEnLinea ? "1" : "0.2"} />
            </svg>
          </div>
        </section>

        {/* NUEVA TARJETA: Formulario de Configuración Wi-Fi (Estructura Original intacta) */}
        <section className="tarjeta-datos tarjeta-config-red">
          <div className="tarjeta-cabecera">
            <span className="etiqueta-gris">Configurar Red Wi-Fi</span>
            <svg className="icono-pequeno" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          
          <form onSubmit={handleSubmit} className="formulario-red">
            <div className="grupo-input">
              <label htmlFor="ssid">Nombre de la red (SSID)</label>
              <input 
                type="text" 
                id="ssid" 
                placeholder="Ej. Totalplay-A75B" 
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                required 
              />
            </div>

            <div className="grupo-input">
              <label htmlFor="password">Contraseña de la red</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-enviar-red">
              Actualizar Red ESP32
            </button>
          </form>
        </section>

      </main>

      {/* Barra de Navegación Inferior (PWA - Estructura Original intacta) */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Panel</span>
        </button>
        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          <span>Conexión</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/registros')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          <span>Registros</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Perfil</span>
        </button>
      </nav>

    </div>
  );
}

export default Conexion;