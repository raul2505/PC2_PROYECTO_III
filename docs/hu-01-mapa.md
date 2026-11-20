# HU-01 · Visualizar ciclovías en el mapa

El ciclista visitante puede abrir `/mapa` sin iniciar sesión. La página principal redirige al mapa. Leaflet se inicializa en el navegador y dibuja el catálogo incluido en la app. Se puede desplazar, acercar, alejar y restablecer la vista a la extensión del catálogo.

## Origen de los datos

- Los tres trazados de `src/app/mapa/demo-lanes.ts` son geometrías ficticias. La leyenda del mapa explica su alcance y desaconseja usarlas para planificar un viaje.
- El mapa base usa teselas de OpenStreetMap solicitadas por el navegador para la vista activa. La atribución está visible en la interfaz. La disponibilidad de esas teselas depende de la conexión y del proveedor. [Política de teselas](https://operations.osmfoundation.org/policies/tiles/)
- Se identificó un catálogo municipal de ciclovías. Quedó pendiente verificar su recurso descargable, las condiciones de reutilización y la fecha de los trazados antes de usarlo en BiciLima. [Catálogo municipal](https://www.datosabiertos.gob.pe/dataset/ciclov%C3%ADas-existentes-en-lima-metropolitana-municipalidad-metropolitana-de-lima-mml)

## Prueba manual

1. Ejecuta `npm.cmd run dev` en PowerShell y abre `http://localhost:3000/mapa`.
2. Comprueba que se muestran tres trazados discontinuos y que la leyenda los identifica como datos de demostración.
3. Arrastra el mapa, cambia el zoom y pulsa **Vista inicial** para recuperar el encuadre. Revisa también la vista móvil.
4. Para comprobar el aviso de cartografía no disponible, bloquea las solicitudes a `tile.openstreetmap.org` con las herramientas del navegador y vuelve a cargar la página. Los trazados locales siguen disponibles.

| Criterio | Evidencia local |
| --- | --- |
| CA1 · Visualizar trazados disponibles | Prueba en Chrome con el mapa base simulado y comprobación del dibujo en canvas, zoom y vista inicial. |
| CA2 · Informar que el catálogo está vacío | Prueba Vitest que renderiza el componente con el catálogo vacío y comprueba el mensaje. |
| Carga y fallo del mapa base | Vitest comprobó el mensaje inicial. Chrome comprobó el aviso cuando se bloquearon las teselas. |
| App disponible | `/api/health` devolvió HTTP 200 en la compilación local. |

Comprobaciones del avance: lint, TypeScript, Vitest, build y auditoría de dependencias de producción. Las pruebas del navegador simulan el proveedor de teselas. Los resultados de infraestructura y capturas ya publicados antes de HU-01 pertenecen a la base del Sprint 0.
