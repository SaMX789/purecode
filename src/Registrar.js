import { db, auth } from "./FireBase.js"; 
import { doc, setDoc } from "firebase/firestore";
// CAMBIO: Se agregó sendEmailVerification a las importaciones de Firebase Auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail } from "firebase/auth";

// EXPORTAMOS la función para poder llamarla desde otro archivo
export async function registrarUsuario(nombre, email, contrasenia) {
  try {
    // PASO 1: Crear la cuenta segura en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;

    // CAMBIO: Enviar el correo de verificación inmediatamente después de crear el usuario
    await sendEmailVerification(usuario);
    console.log("Correo de verificación enviado a:", email);

    // PASO 2: Guardar el resto de los datos en Firestore (SIN la contraseña)
    await setDoc(doc(db, "RegistrarUsuarios", usuario.uid), {
      nombre: nombre,
      email: email
    });
    
    // CAMBIO: Forzar el cierre de sesión tras el registro. 
    await signOut(auth);

    console.log("¡Registro exitoso y correo enviado! ID del documento: ", usuario.uid);
    return { exito: true, verificado: false };
    
  } catch (error) {
    console.error("Error al registrar en la base de datos: ", error);
    return { exito: false, error: error.code };
  }
}

export async function iniciarSesion(email, contrasenia) {
  try {
    // Intentamos iniciar sesión en Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;
    
    // CAMBIO: Validar si el usuario ya confirmó su cuenta mediante el enlace de su correo
    if (!usuario.emailVerified) {
      console.warn("El usuario no ha verificado su correo electrónico.");
      
      // Cerramos la sesión para evitar que el cliente conserve un token activo sin verificar
      await auth.signOut();
      

      return { exito: false, error: "auth/email-not-verified" };
    }

    console.log("¡Inicio de sesión exitoso!", usuario.email);
    return { exito: true, usuario: usuario }; // Retornamos éxito y los datos del usuario
    
  } catch (error) {
    console.error("Error al iniciar sesión: ", error.code);
    return { exito: false, error: error.code }; // Retornamos fallo y el código de error
  }
}

// Función para enviar el correo de restablecimiento de contraseña
export async function restablecerContrasenia(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo de restablecimiento enviado a:", email);
    return { exito: true };
  } catch (error) {
    console.error("Error al enviar correo de restablecimiento: ", error.code);
    return { exito: false, error: error.code };
  }
}