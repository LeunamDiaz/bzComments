// Importa los hooks useState y useEffect de React
import { useState, useEffect } from "react";
// Importa el hook useRouter de Next.js para la navegación del enrutador
import { useRouter } from "next/router";
// Importa el componente Link de Next.js para la navegación de enlaces
import Link from "next/link";
// Importa el componente Image de Next.js para la gestión de imágenes
import Image from "next/image";
// Importa la librería js-cookie para manejar cookies en el navegador
import Cookies from 'js-cookie';
// Importa la función getAuth de Firebase para la autenticación
import { getAuth } from "firebase/auth";
// Importa las funciones de Firebase Database para manejar la base de datos en tiempo real
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";

// Componente principal de la página Demo
export default function Demo() {
  // Estado para el modo de edición
  const [editMode, setEditMode] = useState(false);
  // Estado para las colmenas
  const [colmenas, setColmenas] = useState([]);
  // Estado para las colmenas a eliminar
  const [colmenasAEliminar, setColmenasAEliminar] = useState([]);
  // Estado para el nombre de usuario
  const [userName, setUserName] = useState(""); 
  // Estado para el ID de usuario
  const [userId, setUserId] = useState(""); 
  const router = useRouter(); // Inicializa el enrutador

  // useEffect para verificar la autenticación y cargar las colmenas
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = Cookies.get('token');
        if (user && token) {
          setUserName(user.displayName);
          setUserId(user.uid);
          cargarColmenas(user.uid);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    };

    verificarAutenticacion();

    // Maneja los cambios de ruta
    const handleRouteChange = (url) => {
      if (url !== '/login') {
        const token = Cookies.get('token');
        if (!token) {
          router.replace("/login");
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Función para cargar las colmenas desde la base de datos
  const cargarColmenas = (uid) => {
    const db = getDatabase();
    const colmenasRef = ref(db, 'colmenas/' + uid);
    onValue(colmenasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const colmenasList = Object.keys(data).map((key, index) => ({
          id: key,
          number: index + 1,
          ...data[key]
        }));
        setColmenas(colmenasList);
      }
    });
  };

  // Función para añadir una nueva colmena a la base de datos
  const añadirColmena = () => {
    const db = getDatabase();
    const colmenasRef = ref(db, 'colmenas/' + userId);
    const newColmenaRef = push(colmenasRef);
    set(newColmenaRef, {
      humedad: "Humedad",
      temperatura: "Temperatura",
      nivelCO2: "Nivel de CO2",
      deteccionSonidos: "Sonido detectado",
    });
  };

  // Función para guardar los cambios en la base de datos
  const guardarCambios = () => {
    const db = getDatabase();
    const updates = {};
    colmenasAEliminar.forEach(id => {
      updates['colmenas/' + userId + '/' + id] = null;
    });
    update(ref(db), updates)
      .then(() => {
        setColmenasAEliminar([]);
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error al guardar cambios:', error);
      });
  };

  // Función para borrar una colmena de la lista de colmenas a eliminar
  const borrarColmena = (id) => {
    if (colmenasAEliminar.includes(id)) {
      setColmenasAEliminar(colmenasAEliminar.filter(colmenaId => colmenaId !== id));
    } else {
      setColmenasAEliminar([...colmenasAEliminar, id]);
    }
  };

  // Función para cancelar el modo de edición
  const cancelarEdicion = () => {
    setColmenasAEliminar([]);
    setEditMode(false);
  };

  // Función para activar el modo de edición
  const activarEdicion = () => {
    setEditMode(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      Cookies.remove('token');
      router.replace('/login');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <aside className="hidden sm:flex sm:flex-col"></aside>
      <div className="flex-grow text-gray-800">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
          <div className="relative w-full max-w-md sm:-ml-2"></div>
          <div className="flex flex-shrink-0 items-center ml-auto">
            <div className="inline-flex items-center p-2 focus:bg-gray-100 rounded-lg">
              <span className="sr-only">User Menu</span>
              <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
                <span className="font-semibold">{userName}</span>
                <span className="text-sm text-gray-600">Apicultor</span>
              </div>
              <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
                <Image
                  src="/apicultor.webp"
                  alt="user profile photo"
                  className="h-full w-full object-cover"
                  width="1024"
                  height="1024"
                  fetchpriority="high"
                />
              </span>
            </div>
            <div className="border-l pl-3 ml-3 space-x-1">
              <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full" onClick={handleLogout}>
                <span className="sr-only">Log out</span>
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
            <div className="border-l pl-3 ml-3 space-x-1">
              <Link href="/" legacyBehavior>
                <div className="text-sm text-gray-400 font-bold hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full px-4 py-2">
                  Inicio
                </div>
              </Link>
            </div>
          </div>
        </header>
        <main className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
            <div className="mr-6">
              <h1 className="text-4xl font-semibold mb-2">Panel de control</h1>
              <h2 className="text-gray-600 ml-0.5 text-2xl">
                Administra tus colmenas
              </h2>
            </div>
            <div className="flex flex-wrap items-start justify-end -mb-3">
              {!editMode && (
                <button
                  className="inline-flex px-5 py-3 text-amber-600 hover:text-amber-700 focus:text-amber-500 hover:bg-amber-100 focus:bg-amber-100 border border-amber-600 rounded-md mb-3"
                  onClick={activarEdicion}
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"


                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Editar colmenas
                </button>
              )}
              {editMode && (
                <>
                  <button
                    className="inline-flex px-5 py-3  text-blue-600 hover:text-blue-700 focus:text-blue-500 hover:bg-blue-100 focus:bg-blue-100 border border-blue-600 rounded-md mb-3"
                    onClick={guardarCambios}
                  >
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Guardar cambios
                  </button>
                  <button
                    className="inline-flex px-5 py-3 text-white bg-red-500 hover:bg-red-600 focus:bg-red-500 rounded-md ml-6 mb-3"
                    onClick={cancelarEdicion}
                  >
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                      />
                    </svg>
                    Cancelar
                  </button>
                </>
              )}
              <button
                className="inline-flex px-5 py-3 text-white bg-amber-500 hover:bg-amber-600 focus:bg-amber-500 rounded-md ml-6 mb-3"
                onClick={añadirColmena}
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Añadir colmena
              </button>
            </div>
          </div>
          {colmenas.map((colmena) => (
            <div
              key={colmena.id}
              className={`relative p-5 ${
                colmenasAEliminar.includes(colmena.id) ? "bg-red-300" : "bg-white"
              } shadow rounded-lg mb-3`}
            >
              {editMode && (
                <div className="absolute top-3 right-3 hidden md:block">
                  <button
                    className="text-white mt-3 font-bold rounded bg-red-500 hover:bg-red-600 hover:text-white shadow-md py-3 px-6 inline-flex items-center"
                    onClick={() => borrarColmena(colmena.id)}
                  >
                    <span className="mr-2">Borrar</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="text-center px-5 py-3 rounded-md mb-3">
                <h2 className="text-2xl font-bold text-black">
                  Colmena {colmena.number}
                </h2>
              </div>
              <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 32 32"
                      stroke="currentColor"
                      className="h-8 w-10"
                    >
                      <path d="M28,19c0,6.62-5.38,12-12,12S4,25.62,4,19C4,12.58,14.83,1.75,15.3,1.29c0.39-0.39,1.01-0.39,1.4,0C17.17,1.75,28,12.58,28,19z" fill="currentColor"/>
                      <path d="M14,26c-3.3086,0-6-2.6914-6-6c0-0.5527,0.4478-1,1-1s1,0.4473,1,1c0,2.2061,1.7944,4,4,4c0.5522,0,1,0.4473,1,1S14.5522,26,14,26z" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      {colmena.humedad}
                    </span>
                    <span className="block text-gray-500">
                      Humedad
                    </span>
                  </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-10 w-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 15.9998C7.44772 15.9998 7 16.4475 7 16.9998C7 17.5521 7.44772 17.9998 8 17.9998C8.55228 17.9998 9 17.5521 9 16.9998C9 16.4475 8.55228 15.9998 8 15.9998ZM8 15.9998L8.00707 12M8 16.9998L8.00707 17.0069M20 5C20 6.10457 19.1046 7 18 7C16.8954 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5ZM12 16.9998C12 19.209 10.2091 20.9998 8 20.9998C5.79086 20.9998 4 19.209 4 16.9998C4 15.9854 4.37764 15.0591 5 14.354L5 6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V14.354C11.6224 15.0591 12 15.9854 12 16.9998Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      {colmena.

temperatura}
                    </span>
                    <span className="block text-gray-500">Temperatura</span>
                  </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-12 w-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9.5V12.5M12 15.5H12.01M8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="inline-block text-2xl font-bold">
                      {colmena.nivelCO2}
                    </span>
                    <span className="block text-gray-500">Nivel de CO2</span>
                  </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-amber-500 bg-amber-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-10 w-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      {colmena.deteccionSonidos}
                    </span>
                    <span className="block text-gray-500">
                      Sonidos detectados
                    </span>
                  </div>
                </div>
              </section>
              {editMode && (
                <div className="mt-6 text-center md:hidden">
                  <button
                    className="text-white font-bold rounded bg-red-500 hover:bg-red-600 hover:text-white shadow-md py-3 px-6 inline-flex items-center"
                    onClick={() => borrarColmena(colmena.id)}
                  >
                    <span className="mr-2">Borrar</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}