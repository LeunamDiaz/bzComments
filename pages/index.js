// Importa los componentes necesarios para la página
import Calltoaction from "@/components/Calltoaction";
import Video from "@/components/Video";
import Navbar from "@/components/Navbar";
import Sensor from "@/components/Sensor";
import Footer from "@/components/Footer";
import Image from "next/image"; // Importa el componente Image de Next.js
import { Inter } from "next/font/google"; // Importa la fuente Inter desde Google Fonts

// Función principal que exporta el componente Demo
export default function Demo() {

  return (
    <>
      {/* Renderiza el componente Navbar */}
      <Navbar />
      
      {/* Renderiza el componente Video */}
      <Video />
      
      {/* Sección de servicios con un componente Sensor */}
      <section id="servicios" className="md:p-8 dark:bg-black text-white">
        <Sensor />
      </section>

      {/* Renderiza el componente Calltoaction */}
      <Calltoaction />
      
      {/* Renderiza el componente Footer */}
      <Footer />
    </>
  );
}
