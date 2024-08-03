// Import the functions you need from the SDKs you need
// Importa las funciones necesarias del SDK de Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase para la aplicación
const firebaseConfig = {
  apiKey: "AIzaSyDuEG-E1ayEwNFDpccoqd7m0IVDfeNYsJ8",
  authDomain: "beezafe-prb1.firebaseapp.com",
  databaseURL: "https://beezafe-prb1-default-rtdb.firebaseio.com",
  projectId: "beezafe-prb1",
  storageBucket: "beezafe-prb1.appspot.com",
  messagingSenderId: "637957817781",
  appId: "1:637957817781:web:9ef10b26ea4a395a6245fc",
  measurementId: "G-TQH7ZW3MXY"
};

// Initialize Firebase
// Inicializa Firebase solo si no hay ninguna aplicación inicializada, de lo contrario, usa la aplicación existente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app); // Inicializa Firestore con la aplicación de Firebase
const auth = getAuth(app); // Inicializa Auth con la aplicación de Firebase

// Initialize Analytics only in the client environment
// Inicializa Analytics solo en el entorno del cliente
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Exporta las instancias de db y auth para ser usadas en otras partes de la aplicación
export { db, auth };
