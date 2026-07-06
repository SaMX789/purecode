import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Registros.css';
// Herramientas de Firestore que usaremos para guardar y leer
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from "./FireBase";

function Registros() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extraemos el ph y tds reales que vienen del Dashboard.
  const phReal = location.state?.ph ?? 0;
  const tdsReal = location.state?.tds ?? 0;

  const [listaRegistros, setListaRegistros] = useState([]);

  // Estados para controlar el flujo de la nueva medición
  const [pasoFlujo, setPasoFlujo] = useState('IDLE'); // 'IDLE', 'INPUT_NAME', 'COUNTDOWN', 'SHOW_RESULTS'
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [contador, setContador] = useState(15);
  const [usuarioId, setUsuarioId] = useState(null);

  // 💾 LOCALSTORAGE: Estado inicial de las notificaciones leyendo el disco local
  const [notificacionesActivas, setNotificacionesActivas] = useState(() => {
    const guardado = localStorage.getItem('notificaciones_activas');
    // Si no existe un registro previo, por defecto las dejamos activadas ('true')
    return guardado !== null ? JSON.parse(guardado) : true;
  });

  // 🔔 ESTADO PARA LA NOTIFICACIÓN ESTILO TELÉFONO (TOP TOAST)
  const [notificacionPush, setNotificacionPush] = useState({
    mostrar: false,
    titulo: '',
    mensaje: ''
  });

  // =========================================================
  // 🌓 SINCRONIZAR MODO OSCURO GLOBAL
  // =========================================================
  useEffect(() => {
    const temaGuardado = localStorage.getItem('modo_oscuro');
    if (temaGuardado !== null && JSON.parse(temaGuardado)) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []); // Se ejecuta únicamente al entrar a la pantalla

  useEffect(() => {
    // Al cargar la pantalla, Firebase nos dice qué usuario tiene la sesión activa
    const desuscribir = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioId(user.uid); 
      } else {
        setUsuarioId(null);
        alert('Debes iniciar sesión para ver tus registros.');
        navigate('/login'); 
      }
    });

    return () => desuscribir();
  }, [navigate]);

  // LEER REGISTROS DESDE FIREBASE
  useEffect(() => {
    if (!usuarioId) return;

    const obtenerMediciones = async () => {
      try {
        const q = query(
          collection(db, "RegistrarUsuarios", usuarioId, "mediciones"),
          orderBy("fecha", "desc")
        );

        const querySnapshot = await getDocs(q);
        const registrosFirebase = [];

        querySnapshot.forEach((doc) => {
          const datos = doc.data();
          
          const fechaFormateada = datos.fecha 
            ? datos.fecha.toDate().toLocaleDateString('es-MX') 
            : new Date().toLocaleDateString('es-MX');

          registrosFirebase.push({
            id: doc.id,
            nombre: datos.nombre,
            ph: datos.ph,
            turbidez: datos.tds, 
            fecha: fechaFormateada
          });
        });

        setListaRegistros(registrosFirebase);

      } catch (error) {
        console.error("Error al obtener las mediciones de Firebase:", error);
      }
    };

    obtenerMediciones();
  }, [usuarioId, pasoFlujo]); 

  // Manejo del temporizador de 15 segundos
  useEffect(() => {
    let temporizador;
    if (pasoFlujo === 'COUNTDOWN' && contador > 0) {
      temporizador = setInterval(() => {
        setContador((prev) => prev - 1);
      }, 1000);
    } else if (contador === 0 && pasoFlujo === 'COUNTDOWN') {
      setPasoFlujo('SHOW_RESULTS');
    }

    return () => clearInterval(temporizador);
  }, [pasoFlujo, contador]);

  // Alternar el estado de las notificaciones y guardarlo en el almacenamiento local
  const switchNotificaciones = () => {
    setNotificacionesActivas((prev) => {
      const nuevoEstado = !prev;
      localStorage.setItem('notificaciones_activas', JSON.stringify(nuevoEstado));
      return nuevoEstado;
    });
  };

  // Funciones de control del flujo
  const iniciarFlujo = () => {
    setNombreRegistro('');
    setContador(15); 
    setPasoFlujo('INPUT_NAME');
  };

  const confirmarNombre = () => {
    if (nombreRegistro.trim() === '') {
      alert('Por favor, introduce un nombre para identificar este registro.');
      return;
    }
    setPasoFlujo('COUNTDOWN');
  };

  const guardarEnHistorial = async () => {
    if (!usuarioId) {
      alert('Error: No se encontró un usuario activo para guardar el registro.');
      return;
    }

    if (nombreRegistro.trim() === '') {
      alert('Por favor, introduce un nombre para identificar este registro.');
      return;
    }

    try {
      const subcoleccionRef = collection(db, "RegistrarUsuarios", usuarioId, "mediciones");

      await addDoc(subcoleccionRef, {
        nombre: nombreRegistro,
        ph: parseFloat(phReal),
        tds: parseFloat(tdsReal), 
        fecha: serverTimestamp()  
      });

      setPasoFlujo('IDLE');
      
      // 🚀 EVALUACIÓN DE REGLA LOCALSTORAGE: Solo dispara la notificación si el usuario las tiene activas
      if (notificacionesActivas) {
        setNotificacionPush({
          mostrar: true,
          titulo: 'PureCode • Sistema',
          mensaje: `Se ha guardado el registro "${nombreRegistro}". Da click aquí para verlo.`
        });

        // Auto ocultar tras 5 segundos
        setTimeout(() => {
          setNotificacionPush(prev => ({ ...prev, mostrar: false }));
        }, 5000);
      }

      setNombreRegistro('');

    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("Hubo un problema al guardar los datos en la base de datos.");
    }
  };

  const manejarClickNotificacion = () => {
    setNotificacionPush({ mostrar: false, titulo: '', mensaje: '' });
    const seccionTabla = document.querySelector('.seccion-tabla-historial');
    if (seccionTabla) {
      seccionTabla.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cerrarFlujo = () => {
    setPasoFlujo('IDLE');
  };

  return (
    <div className="registros-layout">
      
      {/* 📱 NOTIFICACIÓN DE TELÉFONO */}
      <div 
        className={`notificacion-push-superior ${notificacionPush.mostrar ? 'activa' : ''}`}
        onClick={manejarClickNotificacion}
      >
        <div className="push-linea-arrastrar"></div>
        <div className="push-contenido">
          <div className="push-icono-app">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
            </svg>
          </div>
          <div className="push-texto">
            <h4 className="push-titulo">{notificacionPush.titulo}</h4>
            <p className="push-mensaje">{notificacionPush.mensaje}</p>
          </div>
        </div>
      </div>

      {/* Barra superior */}
      <header className="registros-header">
        <div className="registros-logo-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0073cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
          </svg>
          <h2>PureCode</h2>
        </div>
        
        <div className="registros-user-actions">
          {/* 🔔 BOTÓN DE NOTIFICACIONES MODIFICADO CON LÓGICA LOCALSTORAGE */}
          <button 
            className={`btn-bell ${!notificacionesActivas ? 'desactivado' : ''}`} 
            onClick={switchNotificaciones}
            title={notificacionesActivas ? "Desactivar Notificaciones" : "Activar Notificaciones"}
          >
            {notificacionesActivas ? (
              /* Icono Campana Activa */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            ) : (
              /* Icono Campana Silenciada / Desactivada (Bell Off) */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
                <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
                <path d="M18 8a6 6 0 0 0-9.33-5"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
          
          <div className="user-avatar" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
            M
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="registros-content">
        <section className="registros-titulo-seccion">
          <h1>Historial de Datos</h1>
          <p>Registros ambientales archivados</p>
        </section>

        {/* Tarjetas de Resumen Promedio */}
        <section className="registros-resumen-grid">
          <div className="tarjeta-resumen">
            <span className="resumen-label">pH</span>
            <div className="resumen-valor">
              <span className="numero azul">0</span>
            </div>
          </div>
          <div className="tarjeta-resumen">
            <span className="resumen-label">Turbidez</span>
            <div className="resumen-valor">
              <span className="numero cafe">0</span>
              <span className="estado">PPM</span>
            </div>
          </div>
        </section>

        {/* Botón Disparador */}
        <section className="registros-acciones">
          <button className="btn-registro-disparar" onClick={iniciarFlujo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icono">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            INICIAR NUEVO REGISTRO
          </button>
        </section>

        {/* TABLA DE HISTORIAL DE DATOS REINCORPORADA */}
        <section className="seccion-tabla-historial">
          <h3>Registros Recientes</h3>
          <div className="tabla-contenedor">
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Nombre/Ubicación</th>
                  <th>pH</th>
                  <th>Turbidez</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {listaRegistros.map((registro, index) => (
                  <tr key={index}>
                    <td className="celda-nombre">{registro.nombre}</td>
                    <td className="celda-ph">{registro.ph}</td>
                    <td className="celda-turbidez">{registro.turbidez} NTU</td>
                    <td className="celda-fecha">{registro.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <h2>Consejos para una Medición Precisa</h2>
            <h3>Espera la estabilización (15-30 segundos):</h3>
            <p>Cuando sumerjas los sensores in el agua, no guardes el primer dato que veas. El electrodo de vidrio del sensor de pH necesita entre 15 y 30 segundos para reaccionar químicamente y adaptarse al nuevo entorno. Espera a que los números dejen de fluctuar en la pantalla antes de registrar tu medición diaria.</p>
            <h3>La regla de las 2 horas:</h3>
            <p>Si vas a tomar una muestra de agua en un contenedor para medirla después, asegúrate de hacer la medición dentro de las primeras 2 horas. Pasado este tiempo, el dióxido de carbono (Co2) del aire exterior comenzará a disolverse en el agua, alterando su acidez real y cambiando por completo el valor del pH. ¡Mide fresco para medir bien!</p>
          </div>
        </section>

      </main>

      {/* Interfaz dinámica del flujo de registro (Overlay) */}
      {pasoFlujo !== 'IDLE' && (
        <div className="modal-overlay">
          
          {/* PASO 1: Pedir Nombre */}
          {pasoFlujo === 'INPUT_NAME' && (
            <div className="modal-tarjeta">
              <h2>Identificar Medición</h2>
              <p>Ingresa el nombre del registro que vas a medir para guardarlo en el historial.</p>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Ej. Tanque Principal, Muestra Beta..." 
                value={nombreRegistro}
                onChange={(e) => setNombreRegistro(e.target.value)}
                autoFocus
              />
              <div className="modal-botones">
                <button className="btn-modal-cancelar" onClick={cerrarFlujo}>Cancelar</button>
                <button className="btn-modal-ok" onClick={confirmarNombre}>OK</button>
              </div>
            </div>
          )}

          {/* PASO 2: Cuenta Regresiva de Estabilización */}
          {pasoFlujo === 'COUNTDOWN' && (
            <div className="contenedor-conteo">
              <div className="circulo-conteo">
                {contador}
              </div>
              <p className="texto-instruccion">
                Manten el agua que no se mueva para tener una mejor lectura
              </p>
            </div>
          )}

          {/* PASO 3: Cuadro de Resultados */}
          {pasoFlujo === 'SHOW_RESULTS' && (
            <div className="modal-tarjeta modal-resultado-exito">
              <div className="modal-icono-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2>Datos Registrados</h2>
              <p className="modal-nombre-registro-final">{nombreRegistro}</p>
              
              <div className="modal-tabla-resumen-datos">
                <div className="modal-fila-dato">
                  <span className="modal-dato-label">Promedio pH:</span>
                  <span className="modal-dato-valor valor-ph">{phReal} pH</span>
                </div>
                <div className="modal-fila-dato">
                  <span className="modal-dato-label">Turbidez Máx:</span>
                  <span className="modal-dato-valor valor-turbidez">{tdsReal} NTU</span>
                </div>
              </div>

              <button className="btn-modal-ok btn-bloque" onClick={guardarEnHistorial}>
                Guardar en Historial
              </button>
            </div>
          )}

        </div>
      )}

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