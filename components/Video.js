import Link from 'next/link';

// Componente principal del botón
export default function Button({ children, onClick }) {
  return (
    <section
      // Sección principal con clases de estilo
      className="bg-black landing-section h-screen max-w-screen text-center relative overflow-hidden"
      data-header-color="black"
    >
      <div className="z-30 relative h-full flex flex-col">
        <header>
          {/* Título principal */}
          <h2 className="text-white text-4xl md:text-5xl xl:text-6xl pt-40">
            Disfrute de Bee Zafe
          </h2>
          {/* Subtítulo */}
          <p className="text-white text-xl mt-3">
            Conéctate con tus abejas como nunca antes
          </p>
        </header>
        <footer className="flex flex-col flex-grow flex-nowrap justify-end pb-20">
          <div>
            {/* Enlace para programar una instalación */}
            <Link href="#footer" legacyBehavior>
              <button className="text-white border-[2px] border-white rounded font-sm px-12 py-2 bg-white/5 backdrop-blur-sm inline-block hover:bg-white hover:text-black transition-colors">
                Programar una instalación
              </button>
            </Link>
          </div>
        </footer>
      </div>

      <div className="absolute top-0 bottom-0 h-full w-full z-10">
        {/* Superposición semitransparente */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Vídeo de fondo */}
        <video
          className="object-center object-cover h-full w-full"
          autoPlay
          muted
          loop
          src="video.webm"
        ></video>
      </div>
    </section>
  );
}