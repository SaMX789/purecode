import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDV029EaPhgMbIwGQlEmQUFCwpfj_H16IY",
  authDomain: "purecode-a0f6e.firebaseapp.com",
  projectId: "purecode-a0f6e",
  storageBucket: "purecode-a0f6e.firebasestorage.app",
  messagingSenderId: "785367676415",
  appId: "1:785367676415:web:8c35ab8887749969a8e3ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Inicializamos Firestore conectándolo a nuestra app
const db = getFirestore(app);
export const auth = getAuth(app);

// 4. Exportamos 'db' para poder usar la base de datos en tus componentes o vistas
export { app, db };