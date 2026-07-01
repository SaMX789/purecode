// src/datosph.js

// Guardamos el token de Blynk de tu ESP32
const BLYNK_TOKEN = "VUgmE4MI2b-a29ObgCaOZtoGmlNRmMGQ";

/**
 * Función nueva para comprobar si el ESP32 está conectado a internet
 * Retorna true si está Online, false si está Offline
 */
export const obtenerEstadoDispositivo = async () => {
  try {
    const respuesta = await fetch(`https://blynk.cloud/external/api/isHardwareConnected?token=${BLYNK_TOKEN}`);
    if (!respuesta.ok) return false;
    const texto = await respuesta.text();
    return texto.trim() === "true"; // Blynk devuelve "true" si está en línea
  } catch (error) {
    return false;
  }
};

/**
 * Función para obtener el valor actual del pH (Pin Virtual V1)
 */
export const obtenerPh = async () => {
  try {
    // Primero validamos si el hardware está conectado
    const estaConectado = await obtenerEstadoDispositivo();
    if (!estaConectado) return 0.0; // 👈 Si está desconectado, fuerza el diseño base a 0.0

    const respuesta = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V1`);
    if (!respuesta.ok) throw new Error("Error al conectar con Blynk");
    
    const texto = await respuesta.text();
    return parseFloat(texto) || 0.0; 
  } catch (error) {
    console.error("Error en datosph al obtener pH:", error);
    return 0.0; 
  }
};

/**
 * Función para obtener el valor actual del TDS/Sólidos (Pin Virtual V2)
 */
export const obtenerTds = async () => {
  try {
    // Primero validamos si el hardware está conectado
    const estaConectado = await obtenerEstadoDispositivo();
    if (!estaConectado) return 0; // 👈 Si está desconectado, fuerza el diseño base a 0

    const respuesta = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V2`);
    if (!respuesta.ok) throw new Error("Error al conectar con Blynk");
    
    const texto = await respuesta.text();
    return parseInt(texto) || 0; 
  } catch (error) {
    console.error("Error en datosph al obtener TDS:", error);
    return 0;
  }
};