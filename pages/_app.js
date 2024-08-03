import '@/styles/globals.css'; // Importa los estilos globales
import { useEffect, useState, createContext, useContext } from 'react'; // Importa hooks y funciones de React
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import Cookies from 'js-cookie'; // Importa js-cookie para manejar cookies

// Crea un contexto de autenticación
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado para almacenar la información del usuario
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtiene el token de las cookies
    const token = Cookies.get('token');
    if (token) {
      // Si hay un token, hace una solicitud para obtener la información del usuario
      axios.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setUser(response.data.user)) // Establece el usuario en el estado
      .catch(() => setUser(null)); // Si hay un error, establece el usuario como null
    }
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  return (
    // Proveedor del contexto de autenticación
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

function MyApp({ Component, pageProps }) {
  return (
    // Envuelve la aplicación con el proveedor de autenticación
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp; // Exporta el componente MyApp como el componente predeterminado