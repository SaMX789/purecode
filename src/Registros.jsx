import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Registros.css';

function Registros() {
  const navigate = useNavigate();

  return (
    <div className="registros-layout">
      
      {/* Barra superior */}
      <header className="registros-header">
        <div className="registros-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        <div className="registros-user-actions">
          <button className="btn-bell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div className="user-avatar">M</div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="registros-content">
        
        {/* Cabecera de la sección */}
        <section className="registros-titulo-seccion">
          <h1>Historial de Datos</h1>
          <p>Registros ambientales archivados</p>
        </section>

        {/* Controles de filtro y vista */}
        <section className="registros-controles">
          <button className="btn-filtro-fecha">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Últimos 7 Días
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <div className="toggle-vista">
            <button className="btn-vista activo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Gráfico
            </button>
            <button className="btn-vista">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              Tabla
            </button>
          </div>
        </section>

        {/* Tarjetas de Resumen Promedio */}
        <section className="registros-resumen-grid">
          <div className="tarjeta-resumen">
            <span className="resumen-label">Promedio pH</span>
            <div className="resumen-valor">
              <span className="numero azul">7.42</span>
              <span className="estado">Óptimo</span>
            </div>
          </div>
          <div className="tarjeta-resumen">
            <span className="resumen-label">Max Turbidez</span>
            <div className="resumen-valor">
              <span className="numero cafe">5.8</span>
              <span className="estado">NTU</span>
            </div>
          </div>
        </section>

        {/* Gráfico de Series de Tiempo */}
        <section className="tarjeta-grafico-principal">
          <div className="grafico-cabecera">
            <h3>Tendencias Históricas</h3>
            <div className="grafico-leyenda">
              <div className="leyenda-item">
                <span className="punto-leyenda azul"></span> Nivel pH
              </div>
              <div className="leyenda-item">
                <span className="punto-leyenda cafe"></span> Turbidez (NTU)
              </div>
            </div>
          </div>

          <div className="grafico-contenedor">
            {/* Gráfico Simulado en SVG */}
            <svg viewBox="0 0 500 150" className="svg-grafico" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-azul" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0073cc', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#0073cc', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              
              {/* Área del pH */}
              <polygon points="0,50 60,45 120,55 180,48 240,52 300,45 360,52 420,48 480,52 500,50 500,150 0,150" fill="url(#grad-azul)" />
              {/* Línea del pH */}
              <polyline points="0,50 60,45 120,55 180,48 240,52 300,45 360,52 420,48 480,52 500,50" fill="none" stroke="#0073cc" strokeWidth="2" />
              
              {/* Línea de Turbidez */}
              <polyline points="0,100 60,105 120,100 180,108 240,100 300,95 360,105 420,108 480,102 500,100" fill="none" stroke="#b46324" strokeWidth="2" />
              
              {/* Línea base horizontal */}
              <line x1="0" y1="148" x2="500" y2="148" stroke="#e2e8f0" strokeWidth="1" />
            </svg>
            
            {/* Eje X (Días) */}
            <div className="eje-x">
              <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
            </div>
          </div>
        </section>

        {/* Análisis de Correlación */}
        <section className="tarjeta-analisis">
          <div className="icono-analisis-contenedor">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="8" y2="16"></line>
              <line x1="16" y1="10" x2="16" y2="16"></line>
            </svg>
          </div>
          <div className="texto-analisis">
            <h3>Análisis de Correlación</h3>
            {/* Texto ajustado a la realidad técnica del hardware */}
            <p>Hemos detectado una correlación de -0.12 entre los niveles de turbidez y pH. Esto sugiere un equilibrio químico extremadamente estable a través del rango actual.</p>
          </div>
        </section>

        {/* Índice de Fiabilidad */}
        <section className="tarjeta-fiabilidad">
          <span className="etiqueta-fiabilidad">ÍNDICE DE FIABILIDAD</span>
          <h2 className="porcentaje-fiabilidad">99.9%</h2>
          <p className="subtexto-fiabilidad">Tiempo de actividad del sensor</p>
        </section>

      </main>

      {/* Barra de Navegación Inferior unificada */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Panel</span>
        </button>

        <button className="nav-item" onClick={() => navigate('/conexion')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          <span>Conexión</span>
        </button>

        <button className="nav-item active">
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

export default Registros;