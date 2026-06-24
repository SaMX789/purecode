import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      
      {/* Barra superior */}
      <header className="dashboard-header">
        <div className="dashboard-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        <div className="dashboard-user-actions">
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
      <main className="dashboard-content">
        
        {/* Título y Estado */}
        <section className="overview-header">
          <h1>Resumen Ambiental</h1>
          <div className="status-indicator">
            <span className="dot pulse"></span>
            <p>Actualizando en vivo desde ESP32 Cluster #0421</p>
          </div>
        </section>

        {/* Botones de acción */}
        <section className="action-buttons">
          <button className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            FORZAR ACTUALIZACIÓN
          </button>
          <button className="btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            EXPORTAR CSV
          </button>
        </section>

        {/* Tarjetas de Datos */}
        <section className="cards-grid">
          
          {/* Tarjeta de pH */}
          <article className="data-card">
            <div className="card-header">
              <div className="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H15M10 3V14L4 21H20L14 14V3"></path>
                </svg>
                <span>NIVEL DE ACIDEZ (pH)</span>
              </div>
              <span className="badge badge-green">SALUDABLE</span>
            </div>
            
            <div className="card-body">
              <div className="main-metric">
                <span className="value">7.8</span>
                <span className="unit">pH</span>
              </div>
              <div className="sub-metric">
                <span className="label">RANGO DIARIO</span>
                <span className="range">6.8 — 7.5</span>
              </div>
            </div>

            <div className="chart-placeholder">
              {/* Simulación SVG de las ondas de datos */}
              <svg viewBox="0 0 400 80" className="wave-graphic" preserveAspectRatio="none">
                <path d="M0,60 C40,40 60,70 100,50 C140,30 160,80 200,40 C240,0 260,70 300,30 C340,-10 360,60 400,20 L400,80 L0,80 Z" fill="url(#grad1)"></path>
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#0073cc', stopOpacity:0.15}} />
                    <stop offset="100%" style={{stopColor:'#0073cc', stopOpacity:0.01}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="card-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Próxima calibración programada en 4 días.</span>
            </div>
          </article>

          {/* Tarjeta de Turbidez */}
          <article className="data-card">
            <div className="card-header">
              <div className="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
                </svg>
                <span>TURBIDEZ (NTU)</span>
              </div>
              <span className="badge badge-green">ÓPTIMO</span>
            </div>
            
            <div className="card-body">
              <div className="main-metric">
                <span className="value">5</span>
                <span className="unit">NTU</span>
              </div>
              <div className="sub-metric">
                <span className="label">NIVEL OBJETIVO</span>
                <span className="range">&lt; 5.0 NTU</span>
              </div>
            </div>

            <div className="chart-placeholder">
              <svg viewBox="0 0 400 80" className="wave-graphic" preserveAspectRatio="none">
                <path d="M0,50 C50,30 80,60 130,40 C180,20 220,70 270,50 C320,30 360,60 400,40 L400,80 L0,80 Z" fill="url(#grad2)"></path>
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#0073cc', stopOpacity:0.15}} />
                    <stop offset="100%" style={{stopColor:'#0073cc', stopOpacity:0.01}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="card-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Cumple con los estándares de la OMS para agua.</span>
            </div>
          </article>

          {/* Tarjeta Innovación: Índice PureCode */}
          <article className="data-card highlight-card">
            <div className="card-header">
              <div className="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>ÍNDICE PURECODE (SALUD HÍDRICA)</span>
              </div>
              <span className="badge badge-blue">ESTABLE</span>
            </div>
            <div className="index-body">
              <div className="progress-circle">
                <span className="percentage">98%</span>
              </div>
              <div className="index-info">
                <p>Las variables cruzadas no muestran riesgo de contaminación inminente.</p>
              </div>
            </div>
          </article>

        </section>
      </main>

      {/* Barra de Navegación Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item active">
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
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Perfil</span>
        </button>
      </nav>

    </div>
  );
}

export default Dashboard;