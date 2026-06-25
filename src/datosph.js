// src/datosph.js

// Guardamos el token de Blynk de tu ESP32
const BLYNK_TOKEN = "VUgmE4MI2b-a29ObgCaOZtoGmlNRmMGQ";

/**
 * Función para obtener el valor actual del pH (Pin Virtual V1)
 */
export const obtenerPh = async () => {
  try {
    const respuesta = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V1`);
    if (!respuesta.ok) throw new Error("Error al conectar con Blynk");
    
    const texto = await respuesta.text();
    return parseFloat(texto) || 0.0; // Convierte la respuesta en número decimal
  } catch (error) {
    console.error("Error en datosph al obtener pH:", error);
    return 0.0; // Evita que la app se caiga si falla el internet
  }
};

/**
 * Función para obtener el valor actual del TDS/Sólidos (Pin Virtual V2)
 */
export const obtenerTds = async () => {
  try {
    const respuesta = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V2`);
    if (!respuesta.ok) throw new Error("Error al conectar con Blynk");
    
    const texto = await respuesta.text();
    return parseInt(texto) || 0; // Convierte la respuesta en número entero
  } catch (error) {
    console.error("Error en datosph al obtener TDS:", error);
    return 0;
  }
};