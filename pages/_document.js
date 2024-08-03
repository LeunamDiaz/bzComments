import { Html, Head, Main, NextScript } from "next/document"; // Importa componentes necesarios de Next.js

// Componente personalizado de documento
export default function Document() {
  return (
    // Define la estructura HTML del documento
    <Html lang="en"> {/* Establece el idioma del documento */}
      <Head /> {/* Componente para incluir elementos en el <head> del documento */}
      <body>
        <Main /> {/* Renderiza la aplicación principal */}
        <NextScript /> {/* Incluye los scripts necesarios de Next.js */}
      </body>
    </Html>
  );
}