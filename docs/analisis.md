# Análisis de BiciLima

Quienes se desplazan en bicicleta en Lima tienen información fragmentada sobre ciclovías, continuidad de los recorridos, incidentes y estacionamientos. BiciLima reúne la información disponible con su procedencia y permite consultar sus limitaciones antes de planificar un viaje. El primer incremento aborda la consulta pública de ciclovías.

## Actores

| Actor | Necesidad |
| --- | --- |
| Ciclista visitante | Consultar cartografía, alertas publicadas, recorridos informativos y estacionamientos. |
| Ciclista registrado | Acceder con su cuenta y enviar reportes de riesgo para revisión. |
| Moderador | Aprobar o rechazar reportes mediante permisos comprobados del lado servidor. |

## Requisitos

| ID | Requisito | HU | MoSCoW |
| --- | --- | --- | --- |
| RF-01 | Visualizar trazados en un mapa público. | HU-01 | Must |
| RF-02 | Consultar el detalle y estado conocido de un tramo. | HU-02 | Must |
| RF-03 | Filtrar ciclovías por distrito. | HU-03 | Should |
| RF-04 | Iniciar sesión con credenciales válidas. | HU-04 | Must |
| RF-05 | Crear un reporte de riesgo pendiente de revisión. | HU-05 | Must |
| RF-06 | Consultar alertas aprobadas. | HU-06 | Must |
| RF-07 | Aprobar o rechazar reportes como moderador. | HU-07 | Should |
| RF-08 | Seleccionar origen y destino. | HU-08 | Must |
| RF-09 | Consultar recorridos disponibles según la cobertura. | HU-09 | Must |
| RF-10 | Consultar alertas relacionadas con un recorrido. | HU-10 | Should |
| RF-11 | Visualizar estacionamientos publicados. | HU-11 | Should |
| RF-12 | Filtrar estacionamientos por distrito. | HU-12 | Could |
| RF-13 | Consultar condiciones conocidas de estacionamiento. | HU-13 | Should |

- Seguridad y privacidad. Valida entradas y permisos en el servidor y aplica RLS cuando se introduzcan datos persistentes. Las alertas públicas omiten datos personales del denunciante y usan ubicación aproximada.
- Disponibilidad y rendimiento. Presenta estados de carga, vacío y error. El mapa base se carga en el navegador y el catálogo de prueba se sirve con la aplicación.
- Accesibilidad. Mantén controles operables con teclado, foco visible y texto legible en móvil y escritorio.
- Procedencia. Rotula los datos de demostración. Un trazado o la ausencia de alertas no acredita seguridad vial.

## Rúbrica y evidencia

| Criterio | Entregable | Evidencia | Estado |
| --- | --- | --- | --- |
| P1 · Épicas, historias, estimaciones y prioridad | [Backlog de referencia](02_backlog_y_sprints.md) | Cuatro épicas y trece historias, 58 SP únicos | Preparado en el kit |
| P1 · Evidencia de Jira | [Checklist](05_evidencias_y_defensa.md) | Capturas auténticas y enlace compartido con el docente | Pendiente de registro manual |
| P2 · Cuatro sprints, burndown, velocidad, Gantt y Kanban | [Planificación](02_backlog_y_sprints.md#pregunta-2-cuatro-sprints) | Valores y movimientos del escenario académico | Simulación del kit |
| P2 · Evidencia del flujo | [Checklist](05_evidencias_y_defensa.md) | Historial y capturas del tablero real | Pendiente de registro manual |

El [caso y la rúbrica](01_caso_y_rubrica.md) disponibles cubren las preguntas 1 y 2. El avance de código se limita a HU-01 según el [plan incremental](04_plan_de_ejecucion.md).
