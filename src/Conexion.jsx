import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Conexion.css';

function Conexion() {
  const navigate = useNavigate();

  return (
    <div className="conexion-layout">
      
      {/* Barra superior */}
      <header className="conexion-header">
        <div className="conexion-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        <div className="conexion-user-actions">
          <div className="user-avatar">M</div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="conexion-content">
        <h1 className="titulo-seccion">Estado de Conexión</h1>

        {/* Tarjeta 1: Estado Principal */}
        <section className="card-estado-principal">
          <div className="anillos-concentricos">
            <div className="caja-estado">
              <div className="punto-verde-pulso"></div>
              <span className="texto-activo">Activo</span>
            </div>
          </div>
          <div className="info-estado">
            <h3>Estado: En línea</h3>
            <p>ID del Dispositivo ESP32: #0421</p>
          </div>
        </section>

        {/* Tarjeta 2: Latido de Red (Heartbeat) */}
        <section className="tarjeta-datos">
          <div className="tarjeta-cabecera">
            <span className="etiqueta-gris">PULSO DE RED</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icono-pequeno">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="tarjeta-cuerpo latido-cuerpo">
            <div className="latido-texto">
              <span className="tiempo-destaque">0s</span> <span className="tiempo-sufijo">atrás</span>
            </div>
            <p className="subtexto-gris">Último dato recibido</p>
            
            {/* Gráfico de barras simulado */}
            <div className="grafico-barras">
              <div className="barra barra-baja"></div>
              <div className="barra barra-media"></div>
              <div className="barra barra-baja"></div>
              <div className="barra barra-alta"></div>
              <div className="barra barra-media"></div>
              <div className="barra barra-maxima"></div>
              <div className="barra barra-media"></div>
            </div>
          </div>
        </section>

        {/* Tarjeta 3: Calidad de Señal */}
        <section className="tarjeta-senal">
          <div className="senal-info">
            <span className="etiqueta-blanca-transparente">CALIDAD DE SEÑAL</span>
            <h3>Excelente (98%)</h3>
          </div>
          <div className="senal-icono">
            {/* Triángulo de señal SVG */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,100 100,0" fill="white" />
            </svg>
          </div>
        </section>

        {/* Tarjeta 4: Detalles de Transmisión */}
        <section className="tarjeta-detalles">
          <div className="detalles-cabecera">
            <span className="etiqueta-gris">DETALLES DE TRANSMISIÓN DE DATOS</span>
          </div>
          <div className="detalles-lista">
            <div className="detalle-item">
              <span className="detalle-label">Frecuencia</span>
              <span className="detalle-valor">Cada 5s</span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Protocolo</span>
              <span className="detalle-valor">WebSocket / JSON</span>
            </div>
            <div className="detalle-item sin-borde">
              <span className="detalle-label">Punto de enlace</span>
              <span className="detalle-valor enlace-azul">Firebase Realtime DB</span>
            </div>
          </div>
        </section>

      </main>

      {/* Barra de Navegación Inferior (PWA) */}
      <nav className="bottom-nav">
        {/* Usamos onClick para navegar al Dashboard real */}
        <button className="nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Panel</span>
        </button>
        {/* Este ítem ahora tiene la clase 'active' */}
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