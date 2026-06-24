import { db, auth } from "./FireBase.js"; 
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


// EXPORTAMOS la función para poder llamarla desde otro archivo
export async function registrarUsuario(nombre, email, contrasenia) {
  try {
    // PASO 1: Crear la cuenta segura en Authentication
    // Firebase se encarga de la contraseña aquí, tú no tienes que guardarla
    const userCredential = await createUserWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;

    // PASO 2: Guardar el resto de los datos en Firestore (SIN la contraseña)
    // Usamos el 'uid' (User ID) generado por Auth como el ID del documento
    await setDoc(doc(db, "RegistrarUsuarios", usuario.uid), {
      nombre: nombre,
      email: email
    });
    
    console.log("¡Registro exitoso! ID del documento: ", usuario.uid);
    return true;
    
  } catch (error) {
    console.error("Error al registrar en la base de datos: ", error);
    return false;
  }
}

export async function iniciarSesion(email, contrasenia) {
  try {
    // Intentamos iniciar sesión en Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;
    
    console.log("¡Inicio de sesión exitoso!", usuario.email);
    return { exito: true, usuario: usuario }; // Retornamos éxito y los datos del usuario
    
  } catch (error) {
    // Si la contraseña es incorrecta o el usuario no existe, caerá aquí
    console.error("Error al iniciar sesión: ", error.code);
    return { exito: false, error: error.code }; // Retornamos fallo y el código de error
  }
}