# HU-04 · Iniciar sesión

Desde **Mi cuenta** en el mapa, un visitante sin sesión llega a `/acceso`. El formulario envía el correo y la contraseña a una acción de servidor. Zod valida la entrada y Supabase Auth comprueba las credenciales. Una sesión válida permite abrir `/cuenta`. Las credenciales incorrectas muestran un mensaje genérico en el formulario.

La protección de `/cuenta` se comprueba en el servidor mediante los claims verificados de Supabase. El proxy de Next.js renueva la sesión cuando corresponde y sincroniza las cookies entre la solicitud y la respuesta. Las cookies de sesión son `HttpOnly` y `SameSite=Lax`, con `Secure` en producción. Las respuestas de cuenta se sirven sin caché compartida. **Cerrar sesión** termina la sesión de este navegador.

## Prueba manual

1. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `.env.local`. Usa una cuenta de prueba con correo confirmado en Supabase Auth.
2. Ejecuta `npm.cmd run dev` y abre `http://localhost:3000/cuenta` sin sesión. Debe redirigir a `/acceso`.
3. Prueba primero una contraseña incorrecta y comprueba el mensaje. Después inicia sesión con la contraseña correcta y comprueba que se abre **Mi cuenta**.
4. Recarga la página, cierra sesión y vuelve a abrir `/cuenta`. Comprueba que la sesión sobrevive a la recarga y que el acceso vuelve a pedir credenciales tras cerrar sesión.

## Evidencia local

Pasaron lint, TypeScript, 13 pruebas de Vitest y el build. En Chrome se probó una cuenta temporal en una instancia aislada de Supabase Auth. Se verificaron el rechazo de una contraseña incorrecta, el acceso correcto, los atributos de las cookies en un build de producción local, la persistencia tras recarga, el cierre de sesión y el bloqueo posterior de `/cuenta`.

Para habilitar el acceso en Vercel, el entorno Production requiere la URL y la clave publicable del proyecto Supabase. Las pruebas de este avance se ejecutaron contra la instancia local.
