import { db, auth } from "./FireBase.js"; // Asegúrate de que la ruta interna de inicialización sea correcta
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
// CAMBIO: Se agregaron las herramientas para el perfil
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, 
  signOut, sendPasswordResetEmail, updateProfile, reauthenticateWithCredential, 
  EmailAuthProvider, updatePassword, deleteUser 
} from "firebase/auth";
export { auth };

export async function registrarUsuario(nombre, email, contrasenia) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;

    await sendEmailVerification(usuario);
    console.log("Correo de verificación enviado a:", email);

    await setDoc(doc(db, "RegistrarUsuarios", usuario.uid), {
      nombre: nombre,
      email: email
    });
    
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
    const userCredential = await signInWithEmailAndPassword(auth, email, contrasenia);
    const usuario = userCredential.user;
    
    if (!usuario.emailVerified) {
      console.warn("El usuario no ha verificado su correo electrónico.");
      await auth.signOut();
      return { exito: false, error: "auth/email-not-verified" };
    }

    console.log("¡Inicio de sesión exitoso!", usuario.email);
    return { exito: true, usuario: usuario }; 
    
  } catch (error) {
    console.error("Error al iniciar sesión: ", error.code);
    return { exito: false, error: error.code }; 
  }
}

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

// =========================================================
// FUNCIONES DE PERFIL
// =========================================================

// NUEVA FUNCIÓN: Obtener datos completos desde Firestore
export async function obtenerDatosUsuario(uid) {
  try {
    const docRef = doc(db, "RegistrarUsuarios", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { exito: true, datos: docSnap.data() };
    } else {
      return { exito: false, error: "No se encontró el documento" };
    }
  } catch (error) {
    console.error("Error al obtener datos de Firestore:", error);
    return { exito: false, error: error.code };
  }
}

// FUNCIÓN MODIFICADA: Guarda el nuevo nombre en Auth y en Firestore
export async function actualizarNombreUsuario(nombre) {
  try {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error("No hay usuario autenticado");

    // 1. Actualiza el perfil básico de Auth
    await updateProfile(usuario, { displayName: nombre });
    
    // 2. Actualiza la base de datos en Firestore
    const docRef = doc(db, "RegistrarUsuarios", usuario.uid);
    await updateDoc(docRef, { nombre: nombre });
    
    return { exito: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { exito: false, error: error.code };
  }
}

export async function reautenticarUsuario(email, passwordActual) {
  try {
    const credencial = EmailAuthProvider.credential(email, passwordActual);
    await reauthenticateWithCredential(auth.currentUser, credencial);
    return { exito: true };
  } catch (error) {
    console.error("Error al verificar identidad:", error);
    return { exito: false, error: error.code };
  }
}

export async function actualizarContrasenia(nuevaPassword) {
  try {
    await updatePassword(auth.currentUser, nuevaPassword);
    return { exito: true };
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return { exito: false, error: error.code };
  }
}

export async function eliminarCuenta() {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { exito: false, error: "No hay un usuario activo para eliminar." };
    }

    const uid = user.uid;
    const batch = writeBatch(db);
    const medicionesRef = collection(db, "RegistrarUsuarios", uid, "mediciones");
    const snapshotMediciones = await getDocs(medicionesRef);

    // 2. Agregar cada medición al lote de eliminación (Batch)
    snapshotMediciones.forEach((documento) => {
      batch.delete(documento.ref);
    });
    await batch.commit();

    // 3. Eliminar el documento padre en "RegistrarUsuarios"
    const userDocRef = doc(db, "RegistrarUsuarios", uid);
    await deleteDoc(userDocRef);
    
    await deleteUser(user);
    
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar la cuenta y sus mediciones:", error);
    return { exito: false, error: error.code || error.message };
  }
}

export async function cerrarSesionUsuario() {
  try {
    await signOut(auth);
    return { exito: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { exito: false, error: error.code };
  }
}