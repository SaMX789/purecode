import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { obtenerPh, obtenerTds } from './datosph'; 
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // =========================================================
  // ESTADOS EN VIVO: Inician con los valores de tus compañeros
  // =========================================================
  const [ph, setPh] = useState(7.5);
  const [tds, setTds] = useState(3);

  // 💾 LOCALSTORAGE: Estado inicial del Modo Oscuro
  const [modoOscuro, setModoOscuro] = useState(() => {
    const temaGuardado = localStorage.getItem('modo_oscuro');
    return temaGuardado !== null ? JSON.parse(temaGuardado) : false;
  });

  // 🌓 EFFECT PARA EL MODO OSCURO: Sincroniza la clase CSS global en el body
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [modoOscuro]);

  // Alternar el modo oscuro y guardarlo localmente
  const switchModoOscuro = () => {
    setModoOscuro((prev) => {
      const nuevoEstado = !prev;
      localStorage.setItem('modo_oscuro', JSON.stringify(nuevoEstado));
      return nuevoEstado;
    });
  };

  const irARegistros = () => {
    navigate('/Registros', { 
      state: { ph: ph, tds: tds } 
    });
  };

  // Historial para dibujar la ola (10 puntos de datos)
  const [historialPh, setHistorialPh] = useState(Array(10).fill(7.0));
  const [historialTds, setHistorialTds] = useState(Array(10).fill(5));

  // =========================================================
  // EFECTO DE CONEXIÓN: Consulta a datosph.js cada 5 segundos
  // =========================================================
  useEffect(() => {
    const actualizarLecturas = async () => {
      const valorPh = await obtenerPh();  
      const valorTds = await obtenerTds(); 
      
      setPh(valorPh); 
      setTds(valorTds);

      setHistorialPh(historialAnterior => {
        return [...historialAnterior.slice(1), valorPh];
      });
      setHistorialTds(historialAnterior => {
        return [...historialAnterior.slice(1), valorTds];
      });
    };

    actualizarLecturas(); 
    const intervalo = setInterval(actualizarLecturas, 5000); 

    return () => clearInterval(intervalo); 
  }, []);

  const phSaludable = ph >= 5.5 && ph <= 7.3 && tds < 1000;

  const generarCurvaSVG = (datos, minVal, maxVal) => {
    const rango = maxVal - minVal;
    let path = "M0,80 "; 
    
    datos.forEach((valor, index) => {
      const x = (index / (datos.length - 1)) * 400;
      const valorLimitado = Math.max(minVal, Math.min(maxVal, valor));
      const y = 80 - ((valorLimitado - minVal) / rango) * 80;
      
      if (index === 0) {
         path += `L${x},${y} `;
      } else {
         const prevX = ((index - 1) / (datos.length - 1)) * 400;
         const prevValorLimitado = Math.max(minVal, Math.min(maxVal, datos[index-1]));
         const prevY = 80 - ((prevValorLimitado - minVal) / rango) * 80;
         
         const controlX1 = prevX + (x - prevX) / 2;
         const controlY1 = prevY;
         const controlX2 = prevX + (x - prevX) / 2;
         const controlY2 = y;
         
         path += `C${controlX1},${controlY1} ${controlX2},${controlY2} ${x},${y} `;
      }
    });
    
    path += "L400,80 Z"; 
    return path;
  };

  return (
    <div className="dashboard-layout">
      
      {/* Barra superior */}
      {/* Barra superior */}
<header className="dashboard-header">
  <div className="dashboard-logo-group">
    <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
    </svg>
    <h2>PureCode</h2>
  </div>
  
  <div className="dashboard-user-actions">
    {/* 🌓 INTERRUPTOR DE MODO OSCURO CON SVG CORREGIDOS */}
    <button 
      className="btn-theme-toggle" 
      onClick={switchModoOscuro}
      title={modoOscuro ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {modoOscuro ? (
        /* Icono de Sol - Forzado a color blanco en modo oscuro */
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        /* Icono de Luna - Forzado al azul de tu paleta en modo claro */
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>

    <div className="user-avatar" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
      M
    </div>
  </div>
</header>

      {/* Contenido principal */}
      <main className="dashboard-content">
        <br />
        <section className="overview-header">
          <h1>Resumen Ambiental</h1>
          <div className="status-indicator">
            <span className="dot pulse"></span>
            <p>Actualizando en vivo desde ESP32</p>
          </div>
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
              <span className={`badge ${ph >= 5.5 && ph <= 7.3 ? 'badge-green' : 'badge-red'}`}>
                {ph >= 5.5 && ph <= 7.3 ? 'SALUDABLE' : 'ALERTA'}
              </span>
            </div>
            
            <div className="card-body">
              <div className="main-metric">
                <span className="value">{ph.toFixed(2)}</span>
                <span className="unit">pH</span>
              </div>
              <div className="sub-metric">
                <span className="label">RANGO DIARIO</span>
                <span className="range">6.8 — 7.5</span>
              </div>
            </div>

            <div className="chart-placeholder">
              <svg viewBox="0 0 400 80" className="wave-graphic" preserveAspectRatio="none">
                <path 
                  d={generarCurvaSVG(historialPh, 6.0, 8.0)} 
                  fill="url(#grad1)"
                  style={{ transition: 'd 1s ease-in-out' }} 
                ></path>
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
              <span>Dato modular procesado externamente en datosph.js</span>
            </div>
          </article>

          {/* Tarjeta de Turbidez */}
          <article className="data-card">
            <div className="card-header">
              <div className="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
                </svg>
                <span>TURBIDEZ (NTU / TDS)</span>
              </div>
              <span className={`badge ${tds < 1000 ? 'badge-green' : 'badge-red'}`}>
                {tds < 1000 ? 'ÓPTIMO' : 'ALTO RIESGO'}
              </span>
            </div>
            
            <div className="card-body">
              <div className="main-metric">
                <span className="value">{tds}</span>
                <span className="unit">ppm</span>
              </div>
              <div className="sub-metric">
                <span className="label">NIVEL OBJETIVO</span>
                <span className="range">&lt; 1000 ppm</span>
              </div>
            </div>

            <div className="chart-placeholder">
              <svg viewBox="0 0 400 80" className="wave-graphic" preserveAspectRatio="none">
                <path 
                  d={generarCurvaSVG(historialTds, 0, 1500)} 
                  fill="url(#grad2)"
                  style={{ transition: 'd 1s ease-in-out' }} 
                ></path>
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

          {/* Tarjeta Innovación */}
          <article className="data-card highlight-card">
            <div className="card-header">
              <div className="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>ÍNDICE PURECODE (SALUD HÍDRICA)</span>
              </div>
              <span className={`badge ${phSaludable ? 'badge-blue' : 'badge-red'}`}>
                {phSaludable ? 'ESTABLE' : 'PELIGRO'}
              </span>
            </div>
            <div className="index-body">
              <div className="progress-circle" style={{ borderColor: phSaludable ? '#0073cc' : '#D3435C' }}>
                <span className="percentage">{phSaludable ? '98%' : 'Alerta'}</span>
              </div>
              <div className="index-info">
                <p>
                  {phSaludable 
                    ? "Las variables cruzadas no muestran riesgo de contaminación inminente." 
                    : "¡ATENCIÓN! El pH o los valores de sólidos disueltos se encuentran fuera del rango seguro."
                  }
                </p>
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
        <button className="nav-item" onClick={irARegistros}>
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