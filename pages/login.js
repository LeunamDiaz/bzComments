// Importa el hook useState de React para manejar el estado local
import { useState } from 'react';
// Importa el hook useRouter de Next.js para la navegación del enrutador
import { useRouter } from 'next/router';
// Importa la función signInWithEmailAndPassword de Firebase Authentication para iniciar sesión
import { signInWithEmailAndPassword } from "firebase/auth";
// Importa el componente Link de Next.js para la navegación de enlaces
import Link from 'next/link';
// Importa la librería js-cookie para manejar cookies en el navegador
import Cookies from 'js-cookie';  // Importa la librería js-cookie
// Importa la configuración de Firebase
import { auth } from '../firebaseConfig'; // Importa la configuración de Firebase
// Importa el contexto de autenticación desde el archivo _app.js
import { useAuth } from '../pages/_app';  // Importa el contexto de autenticación

// Componente principal de la página de inicio de sesión
export default function Login() {
  const router = useRouter(); // Inicializa el enrutador
  const { setUser } = useAuth();  // Usa el contexto de autenticación
  const [formData, setFormData] = useState({
    email: '',
    password: ''  // Estado local para almacenar el correo electrónico y la contraseña
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Actualiza el estado local con los valores del formulario
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica que los campos de correo electrónico y contraseña no estén vacíos
    if (!formData.email || !formData.password) {
      alert("Por favor ingrese su correo electrónico y contraseña.");
      return;
    }

    try {
      // Intenta iniciar sesión con el correo electrónico y la contraseña proporcionados
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken(); // Obtén el token del usuario

      // Guarda el token en las cookies
      Cookies.set('token', token, { expires: 7 });

      // Actualiza el estado del usuario
      setUser({ email: user.email });

      alert("Inicio de sesión exitoso!");
      router.push('/'); // Redirige al usuario a la página de inicio
    } catch (error) {
      // Maneja los errores de autenticación
      if (error.code === 'auth/user-not-found') {
        alert("Correo electrónico no encontrado.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Contraseña incorrecta.");
      } else {
        console.error("Error during sign in: ", error);
        alert("Has cometido un error. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-amber-500 to-amber-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">Bee Zafe</h1>
          <p className="text-white text-xl mt-1">Mejora tu apicultura con un panal inteligente</p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex lg:w-1/2 md:w-1/2 h-screen max-h-screen justify-center py-10 items-center bg-white">
        <form className="bg-white" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Iniciar sesión</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Bienvenido de nuevo</p>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <input className="pl-2 outline-none border-none" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" style={{ color: 'black' }} />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <input className="pl-2 outline-none border-none" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" style={{ color: 'black' }} />
          </div>
          <button type="submit" className="block w-full bg-amber-500 hover:bg-amber-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Iniciar sesión</button>
          <span className="text-sm ml-2 hover:text-amber-500 cursor-pointer text-black"><Link href="/register">No tengo cuenta</Link></span>
        </form>
      </div>
    </div>
  );
}
