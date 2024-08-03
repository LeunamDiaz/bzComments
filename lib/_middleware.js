// lib/_middleware.js
import { NextResponse } from 'next/server';

// Función middleware para manejar las solicitudes
export function middleware(req) {
  // Obtener el token de las cookies
  const token = req.cookies.get('token');
  // Clonar la URL de la solicitud
  const url = req.nextUrl.clone();

  // Si no hay token y la ruta no es '/register', redirigir a '/register'
  if (!token && url.pathname !== '/register') {
    url.pathname = '/register';
    return NextResponse.redirect(url);
  }

  // Continuar con la siguiente respuesta
  return NextResponse.next();
}

// Configuración del middleware
export const config = {
  // Definir las rutas que serán protegidas por el middleware
  matcher: ['/protected-path/:path*'], // Ajusta las rutas protegidas según sea necesario
};