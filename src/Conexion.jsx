import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEstadoDispositivo } from './datosph';
import './Conexion.css';

function Conexion() {
  const navigate = useNavigate();

  // =========================================================
  // ESTADOS DEL COMPONENTE
  // =========================================================
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [estaEnLinea, setEstaEnLinea] = useState(false);
  const [calidadSenal, setCalidadSenal] = useState('Sin Señal (0%)');

  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
  const [buscandoBluetooth, setBuscandoBluetooth] = useState(false);
  const [enviandoDatos, setEnviandoDatos] = useState(false); // Nuevo: Para saber si está transmitiendo
  const [errorBluetooth, setErrorBluetooth] = useState('');

  // =========================================================
  // LOGICA DE MONITOREO POR LA NUBE (BLYNK)
  // =========================================================
  useEffect(() => {
    const verificarRed = async () => {
      const enLinea = await obtenerEstadoDispositivo();
      setEstaEnLinea(enLinea);
      
      if (enLinea) {
        setCalidadSenal('Excelente (98%)');
      } else {
        setCalidadSenal('Sin Señal (0%)');
      }
    };

    verificarRed();
    const intervalo = setInterval(verificarRed, 4000);

    return () => clearInterval(intervalo);
  }, []);

  // =========================================================
  // FUNCIÓN PARA BUSCAR EL ESP32 POR BLUETOOTH
  // =========================================================
  const encenderYBuscarBluetooth = async () => {
    setBuscandoBluetooth(true);
    setErrorBluetooth('');
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'Blynk' },
          { namePrefix: 'PureCode' }
        ],
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] 
      });

      setDispositivoSeleccionado(device);
      console.log('Conectado visualmente a:', device.name);
      
    } catch (error) {
      console.error('Error de Bluetooth:', error);
      setErrorBluetooth('No se seleccionó ningún dispositivo o el navegador no soporta BLE.');
    } finally {
      setBuscandoBluetooth(false);
    }
  };

  // =========================================================
  // FUNCIÓN PARA ENVIAR LAS CREDENCIALES POR BLUETOOTH
  // =========================================================
  const enviarCredencialesPorBLE = async (e) => {
  e.preventDefault();
  if (!dispositivoSeleccionado) return;

  setEnviandoDatos(true);

  try {
    // 1. Conectar al servidor GATT del ESP32
    console.log("Conectando al servidor GATT...");
    const server = await dispositivoSeleccionado.gatt.connect();
    
    // 2. Obtener el servicio principal
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
    
    // 3. Obtener la característica de escritura
    const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

    // 4. Convertir texto a bytes
    const datosAEnviar = `${ssid},${password}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(datosAEnviar);

    // 5. Inyectar los datos
    console.log("Escribiendo datos:", datosAEnviar);
    await characteristic.writeValue(dataBuffer);
    
    alert('¡Datos enviados! El ESP32 ha apagado su Bluetooth y está validando tu Wi-Fi. Espera 6 segundos...');

    // 6. Esperar 6 segundos para verificar el resultado
    setTimeout(async () => {
      const enLinea = await obtenerEstadoDispositivo(); // Verifica si Blynk lo ve activo
      
      if (enLinea) {
        // --- CASO ÉXITO ---
        alert('¡Sincronización Exitosa! El ESP32 se ha conectado a internet.');
        setDispositivoSeleccionado(null); // Cierra el flujo limpiamente
        setSsid('');
        setPassword('');
      } else {
        // --- CASO ERROR (Tu estrategia) ---
        alert('ERROR: El ESP32 no logró conectarse a la red. El hardware ha reiniciado su Bluetooth. Por favor, vuelve a escanear y vincularte.');
        
        // FORZAMOS A VINCULARSE OTRA VEZ:
        setDispositivoSeleccionado(null); // Esto borra el vínculo viejo en React, oculta el formulario y muestra el botón de Buscar.
        setSsid('');                      // Limpiamos los campos para el siguiente intento
        setPassword('');
      }
      setEnviandoDatos(false);
    }, 6000);

  } catch (error) {
    console.error('Error crítico al enviar por BLE:', error);
    alert('Hubo un problema al transmitir los datos. Intenta reconectar el Bluetooth.');
    setDispositivoSeleccionado(null); // Si falla la transmisión física, también reiniciamos el botón
    setEnviandoDatos(false);
  }
};

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
          <div className="user-avatar" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
            M
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="conexion-content">
        <h1 className="titulo-seccion">Estado de Conexión</h1>

        {/* Tarjeta 1: Estado Principal */}
        <section className="card-estado-principal">
          <div className="anillos-concentricos">
            <div className="caja-estado">
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
            <p>ID del Dispositivo ESP32: {dispositivoSeleccionado ? dispositivoSeleccionado.name : 'No seleccionado'}</p>
          </div>
        </section>

        {/* Tarjeta 2: Calidad de Señal */}
        <section className="tarjeta-senal">
          <div className="senal-info">
            <span className="etiqueta-blanca-transparente">CALIDAD DE SEÑAL</span>
            <h3>{calidadSenal}</h3>
          </div>
          <div className="senal-icono">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,100 100,0" fill="white" fillOpacity={estaEnLinea ? "1" : "0.2"} />
            </svg>
          </div>
        </section>

        {/* Panel de Sincronización Bluetooth */}
        <section className="tarjeta-datos tarjeta-config-red">
          <div className="tarjeta-cabecera">
            <span className="etiqueta-gris">Vinculación Local por Bluetooth</span>
            <svg className="icono-pequeno" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 7l14 10-9 7V2l9 7L5 17"></path>
            </svg>
          </div>
          
          <div className="panel-bluetooth">
            <p className="descripcion-ble">
              Para sincronizar el dispositivo a un nuevo módem sin perder internet, presiona el botón para escanear los equipos PureCode cercanos.
            </p>

            {/* Si NO hay dispositivo seleccionado */}
            {!dispositivoSeleccionado && (
              <button onClick={encenderYBuscarBluetooth} className="btn-enviar-red" disabled={buscandoBluetooth}>
                {buscandoBluetooth ? 'Buscando dispositivos...' : 'Encender y Buscar ESP32'}
              </button>
            )}

            {/* Si SÍ hay dispositivo seleccionado */}
            {dispositivoSeleccionado && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="dispositivo-vinculado">
                  <div className="icono-check">✓</div>
                  <div>
                    <h4>Vinculado con éxito</h4>
                    <p>{dispositivoSeleccionado.name}</p>
                  </div>
                </div>

                <form onSubmit={enviarCredencialesPorBLE} className="formulario-red">
                  <div className="grupo-input">
                    <label htmlFor="ssid">Nombre de la nueva red (SSID)</label>
                    <input 
                      type="text" id="ssid" placeholder="Ej. Totalplay-A75B" 
                      value={ssid} onChange={(e) => setSsid(e.target.value)} required 
                      disabled={enviandoDatos}
                    />
                  </div>
                  <div className="grupo-input">
                    <label htmlFor="password">Contraseña de la red</label>
                    <input 
                      type="password" id="password" placeholder="••••••••••••" 
                      value={password} onChange={(e) => setPassword(e.target.value)} required 
                      disabled={enviandoDatos}
                    />
                  </div>
                  <button type="submit" className="btn-enviar-red" style={{ backgroundColor: enviandoDatos ? '#64748b' : '#005bb5' }} disabled={enviandoDatos}>
                    {enviandoDatos ? 'Transmitiendo al hardware...' : 'Enviar Wi-Fi por Bluetooth'}
                  </button>
                </form>
              </div>
            )}

            {errorBluetooth && <p className="error-mensaje-ble">{errorBluetooth}</p>}
          </div>
        </section>

      </main>

      {/* Barra de Navegación Inferior */}
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