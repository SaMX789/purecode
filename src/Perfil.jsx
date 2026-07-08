import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import './Perfil.css';
import { 
  auth,
  actualizarNombreUsuario, 
  reautenticarUsuario, 
  actualizarContrasenia, 
  eliminarCuenta, 
  cerrarSesionUsuario,
  obtenerDatosUsuario 
} from './Registrar.js';

function Perfil() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const correoRecibido = location.state?.correoUsuario || ''; 

  // Estados
  const [nombre, setNombre] = useState(''); 
  const [emailReal, setEmailReal] = useState(correoRecibido);
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [identidadVerificada, setIdentidadVerificada] = useState(false);
  
  // NUEVO ESTADO: Controla la interfaz durante el proceso de eliminación
  const [eliminando, setEliminando] = useState(false);

  // NUEVO: Estados para la visualización de las contraseñas
  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  // NUEVO: Validaciones en tiempo real para la Nueva Contraseña
  const tieneLongitud = nuevaPassword.length >= 6;
  const tieneLetra = /[a-zA-Z]/.test(nuevaPassword);
  const tieneNumero = /\d/.test(nuevaPassword);
  const tieneSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(nuevaPassword);

  const nivelSeguridad = [tieneLongitud, tieneLetra, tieneNumero, tieneSimbolo].filter(Boolean).length;
  const passwordValida = nivelSeguridad === 4;
  // Sincronizar con los datos reales usando el observador y Firestore
  useEffect(() => {
    const cancelarObservador = onAuthStateChanged(auth, async (usuarioActual) => {
      if (usuarioActual) {
        setEmailReal(usuarioActual.email);
        
        const resultado = await obtenerDatosUsuario(usuarioActual.uid);
        
        if (resultado.exito && resultado.datos && resultado.datos.nombre) {
          setNombre(resultado.datos.nombre);
        } else {
          setNombre(usuarioActual.displayName || '');
        }
      }
    });

    return () => cancelarObservador();
  }, []);

  // --- HANDLERS ---

  const manejarGuardarPerfil = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    const resultado = await actualizarNombreUsuario(nombre);
    if (resultado.exito) {
      alert('Perfil actualizado correctamente');
    } else {
      alert('Error al actualizar el perfil');
    }
  };

  const verificarIdentidad = async () => {
    if (!passwordActual) return alert('Por favor, ingresa tu contraseña actual.');
    
    const resultado = await reautenticarUsuario(emailReal, passwordActual);
    if (resultado.exito) {
      setIdentidadVerificada(true);
      alert('Identidad verificada. Ya puedes ingresar tu nueva contraseña.');
    } else {
      alert('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const manejarActualizarPassword = async () => {
    if (nuevaPassword !== confirmarPassword) return alert('Las contraseñas nuevas no coinciden.');
    if (!passwordValida) return alert('La nueva contraseña no cumple con todos los requisitos de seguridad.'); // Validación actualizada

    const resultado = await actualizarContrasenia(nuevaPassword);
    if (resultado.exito) {
      alert('¡Contraseña actualizada con éxito!');
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
      setIdentidadVerificada(false);
    } else {
      alert('Hubo un error al actualizar la contraseña.');
    }
  };

  const manejarEliminarCuenta = async () => {
    // Texto de advertencia actualizado
    const confirmar = window.confirm("¿Estás completamente seguro? Esta acción eliminará tu cuenta y todo tu historial de mediciones de forma permanente.");
    
    if (confirmar) {
      setEliminando(true); // Bloquea el botón y cambia el texto

      const resultado = await eliminarCuenta();
      
      if (resultado.exito) {
        alert('Cuenta y registros eliminados. Lamentamos verte partir.');
        // No es necesario setEliminando(false) aquí porque redirigimos y el componente se desmonta
        navigate('/');
      } else {
        console.error("Fallo al eliminar:", resultado.error);
        alert('Por seguridad, necesitas cerrar sesión, volver a entrar e intentarlo de nuevo para eliminar tu cuenta.');
        setEliminando(false); // Restaura el botón si hubo un error
      }
    }
  };

  const manejarCerrarSesion = async () => {
    const resultado = await cerrarSesionUsuario();
    if (resultado.exito) {
      console.log('Sesión cerrada');
      navigate('/');
    }
  };

  return (
    <div className="perfil-layout">
      
      {/* Barra superior */}
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
        
        {/* Cabecera del Usuario Dinámica */}
        <section className="usuario-identidad">
          <div className="avatar-contenedor">
            <div className="avatar-circulo">{nombre ? nombre.charAt(0).toUpperCase() : '?'}</div>
            <button className="btn-editar-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
          <h1 className="usuario-nombre">{nombre || 'Usuario'}</h1>
          <p className="usuario-email">{emailReal}</p>
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
                  placeholder="Tu nombre completo o alias"
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
              <div className="perfil-contenedor-password">
                <input 
                  type={mostrarPasswordActual ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  disabled={identidadVerificada}
                />
                <button type="button" className="perfil-boton-ojito" disabled={identidadVerificada} onClick={() => setMostrarPasswordActual(!mostrarPasswordActual)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mostrarPasswordActual ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            {!identidadVerificada && (
              <button type="button" className="btn-verificar" onClick={verificarIdentidad}>
                Verificar Identidad
              </button>
            )}

            <hr className="linea-separadora" />

            <div className={`grupo-input-perfil ${!identidadVerificada ? 'bloqueado' : ''}`} style={{marginBottom: '8px'}}>
              <label>NUEVA CONTRASEÑA</label>
              <div className="perfil-contenedor-password">
                <input 
                  type={mostrarNuevaPassword ? "text" : "password"} 
                  disabled={!identidadVerificada}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder={identidadVerificada ? "••••••••" : ""}
                />
                <button type="button" className="perfil-boton-ojito" disabled={!identidadVerificada} onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mostrarNuevaPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* VALIDADOR DE SEGURIDAD (Se muestra solo tras verificar identidad) */}
            {identidadVerificada && (
              <div className="perfil-validador-password">
                <div className="indicador-fuerza-texto">
                  <span className="etiqueta-fija">Nivel de seguridad:</span>
                  <span className={`etiqueta-dinamica texto-nivel-${nivelSeguridad}`}>
                    {nivelSeguridad === 0 && "Muy débil"}
                    {nivelSeguridad === 1 && "Débil"}
                    {nivelSeguridad === 2 && "Regular"}
                    {nivelSeguridad === 3 && "Buena"}
                    {nivelSeguridad === 4 && "Fuerte"}
                  </span>
                </div>
                <div className="barra-seguridad-fondo">
                  <div className={`barra-seguridad-progreso nivel-${nivelSeguridad}`}></div>
                </div>
                <ul className="lista-requisitos">
                  <li className={tieneLongitud ? 'cumplido' : ''}>
                    {tieneLongitud ? <CheckIcon /> : <CircleIcon />} Mínimo 6 caracteres
                  </li>
                  <li className={tieneLetra ? 'cumplido' : ''}>
                    {tieneLetra ? <CheckIcon /> : <CircleIcon />} Al menos una letra
                  </li>
                  <li className={tieneNumero ? 'cumplido' : ''}>
                    {tieneNumero ? <CheckIcon /> : <CircleIcon />} Al menos un número
                  </li>
                  <li className={tieneSimbolo ? 'cumplido' : ''}>
                    {tieneSimbolo ? <CheckIcon /> : <CircleIcon />} Al menos un símbolo
                  </li>
                </ul>
              </div>
            )}

            <div className={`grupo-input-perfil ${!identidadVerificada ? 'bloqueado' : ''}`} style={{marginTop: '16px'}}>
              <label>CONFIRMAR CONTRASEÑA</label>
              <div className="perfil-contenedor-password">
                <input 
                  type={mostrarConfirmarPassword ? "text" : "password"} 
                  disabled={!identidadVerificada}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder={identidadVerificada ? "••••••••" : ""}
                />
                <button type="button" className="perfil-boton-ojito" disabled={!identidadVerificada} onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}>
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

            <button 
              type="button" 
              className={identidadVerificada ? "btn-guardar-cambios" : "btn-actualizar-bloqueado"} 
              disabled={!identidadVerificada}
              onClick={manejarActualizarPassword}
            >
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
            {/* NUEVO: Botón dinámico dependiente del estado 'eliminando' */}
            <button 
              type="button" 
              className="btn-eliminar-cuenta" 
              onClick={manejarEliminarCuenta}
              disabled={eliminando} 
              style={{ opacity: eliminando ? 0.7 : 1, cursor: eliminando ? 'not-allowed' : 'pointer' }}
            >
              {eliminando ? 'Eliminando datos...' : 'Eliminar Cuenta'}
            </button>
          </div>
        </section>

      </main>

      {/* Barra de Navegación Inferior */}
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
        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Perfil</span>
        </button>
      </nav>

    </div>
  );
}

// Componentes SVG de la lista de requisitos
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const CircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
);

export default Perfil;