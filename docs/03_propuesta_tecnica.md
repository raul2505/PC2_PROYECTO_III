# BiciLima — Especificación técnica propuesta para Codex

> **Propuesta de solución**, no arquitectura constatada. Antes de implementarla inspecciona el repositorio y adapta sin reemplazar lo ya existente. El único requerimiento técnico explícito en las preguntas 1 y 2 compartidas es **Jira y documentación**. Next.js / Supabase / Vercel provienen del entorno de trabajo seleccionado por el estudiante y su skill.

## Producto y límites
- Producto propuesto: **BiciLima**, web responsive para consultar ciclovías, alertas de riesgos reportados, recorridos informativos y estacionamientos.
- Usuarios: visitante (lee datos publicados), ciclista autenticado (crea reportes), moderador (revisa y cambia estado de reportes).
- **No declarar una ruta «segura»** ni afirmar que los datos son oficiales/completos/actualizados si no se acredita su fuente. Mostrar avisos visibles de alcance y procedencia de datos.
- No mostrar públicamente información personal del denunciante. Alertas publicadas con ubicación aproximada y sin datos personales.

## Stack de trabajo, condicionado a inspección
- Next.js App Router + TypeScript; reutilizar la versión y convenciones existentes.
- Supabase Auth + PostgreSQL con Row Level Security (RLS).
- Despliegue Vercel vinculado a GitHub, si el estudiante ya lo autorizó.
- Vitest para reglas y pruebas unitarias, y pruebas manuales de los recorridos; ejecutar lint, tipos y build si están definidos.
- Mapa: primero inspeccionar librerías ya instaladas y licencias; elegir solución compatible con ejecución local y Vercel. Evitar claves privadas o servicios pagos si no son imprescindibles.

## Entidades mínimas propuestas
| Tabla | Datos principales | Operaciones y acceso |
|---|---|---|
| `profiles` | `id uuid` FK a `auth.users`, `display_name`, `role` (`cyclist`, `moderator`) | El usuario lee sus datos. El rol no se puede autoelevar mediante una actualización propia. |
| `cycle_lanes` | `id`, `name`, `district`, `description`, `condition_status` (nullable), `geometry_geojson`, `data_source`, `verified_at` | Solo lectura pública de registros publicados. Escritura administrativa/migración protegida. |
| `risk_reports` | `id`, `author_id`, `type`, `description`, `latitude`, `longitude`, `status` (`pending`, `approved`, `rejected`), `created_at`, `reviewed_at` | Autor puede crear y leer sus reportes; visitante solo ve versiones **aprobadas** con datos adecuados; moderador revisa. |
| `bike_parkings` | `id`, `name`, `district`, `latitude`, `longitude`, `access_info`, `schedule_info`, `security_info`, `data_source`, `verified_at` | Lectura pública de publicados; datos ausentes como «Por confirmar». |
| `route_options` | `id`, `name`, `origin_name`, `destination_name`, `geometry_geojson`, `notes`, `data_source` | Rutas de **demostración** cuando no exista proveedor de cálculo de ruta confiable. No inferir que son rutas oficialmente seguras. |

Estos campos son un punto de partida. Antes de crear SQL, valida normalización, índices, restricciones `CHECK`, tipos y relaciones con el stack real; registra las decisiones. Si el repositorio ya tiene tablas equivalentes, reutilízalas o migra sin pérdida de datos.

## Autorización y roles
- Visitante: consultar ciclovías, detalles, filtros, alertas aprobadas, recorridos sugeridos y estacionamientos publicados.
- Ciclista autenticado: todo lo anterior más crear reporte con estado inicial `pending`, ver reportes propios.
- Moderador: ver cola de reportes y aprobar/rechazar; acceso asignado solo por proceso administrativo confiable, nunca por parámetros enviados por el navegador.
- RLS habilitado sobre cada tabla expuesta por API. No utilizar `service_role` en el navegador ni en variables `NEXT_PUBLIC_*`.
- Validaciones del lado servidor o BD, además de la interfaz. El frontend no sustituye la autorización.

## Datos geográficos y rutas: decisión crítica
1. Buscar primero **fuentes verificables y autorizadas** si existen y el tiempo lo permite; registrar enlace, fecha y licencia.
2. Si no existen, usar un **dataset de demostración claramente rotulado**, con áreas/rutas ficticias o geometrías de prueba, sin presentar zonas de robos ni riesgos como hechos comprobados.
3. La HU-08 pide origen y destino: en el MVP se puede acotar la selección a puntos predefinidos presentes en los datos. Declarar la limitación en la interfaz y el README.
4. HU-09: sugerir solo opciones precargadas/derivadas de tramos disponibles; si no hay trayecto compatible, mostrar «No hay recorrido disponible» y no dibujar una línea recta como si fuera ruta real.
5. HU-10: relacionar alertas aprobadas con tramos de las rutas; si no hay registros, indicar «Sin alertas registradas» (NO «ruta segura»).

## Pantallas/recorridos propuestos
- `/`: presentación del caso, acceso al mapa y limitaciones de datos.
- `/mapa`: HU-01, HU-02, HU-03; visualizar trazados, detalle y filtro.
- `/acceso`: HU-04; login y procedimiento autorizado para cuentas de prueba.
- `/reportes/nuevo`: HU-05; formulario autenticado con ubicación, tipo y descripción.
- `/mapa` (capa alertas): HU-06; mostrar solo aprobados.
- `/moderacion`: HU-07; lista protegida y acciones de revisión.
- `/rutas`: HU-08, HU-09, HU-10; origen/destino, alternativas y avisos.
- `/estacionamientos`: HU-11, HU-12, HU-13; mapa, filtro y ficha.
Estas rutas son orientativas: conservar nombres y estructura que ya tenga el proyecto si son equivalentes.

## Decisiones explícitas pendientes de validación
- Qué proveedor de mapa y qué dataset se encuentran realmente disponibles.
- Si Supabase dispone de tablas/migraciones previas.
- Si el usuario necesita registro abierto o creará cuentas de demostración de forma administrada; HU-04 exige login, no exige un formulario de registro.
- Cómo asignar rol moderador de manera segura.
- Qué servicios están autorizados para desplegar y cómo se hará la verificación de `/api/health` si el caso requiere health checks.
