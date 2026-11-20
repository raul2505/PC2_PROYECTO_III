# BiciLima — Ejecución incremental para Codex

> Este documento transforma el backlog ya planificado en un plan de construcción. **No sustituye la prioridad del enunciado completo**, que el estudiante debe proporcionar si contiene más preguntas.

## Preparación y diagnóstico (sin modificaciones externas)
1. Leer `docs/01_caso_y_rubrica.md`, `docs/02_backlog_y_sprints.md` y `docs/03_propuesta_tecnica.md`.
2. Inspeccionar árbol de archivos, `package.json`, `.nvmrc`, `README.md`, `src/` o `app/`, migraciones, `.gitignore`, scripts de test, Git y configuración de CI existente. No copiar valores de `.env*`.
3. Identificar funcionalidades existentes y confirmar la versión real del stack. Comprobar acceso a servicios **sin operaciones de escritura**. Detallar qué está disponible y qué requiere permiso.
4. Identificar un dataset de prueba lícito. No afirmar disponibilidad de geodatos reales sin verificar.
5. Mostrar un diagnóstico muy breve (qué hay, qué falta, riesgos, comandos existentes) y comenzar HU-01 solo si el repositorio y su estado permiten hacerlo sin destruir cambios previos.

## Orden de implementación recomendado

### Bloque A — Sprint 1 (HU-01, HU-02, HU-03; 13 SP)
- HU-01: mapa con trazados de ciclovías publicados o de prueba, estados loading/empty/error.
- HU-02: detalle del tramo con origen/estado de datos indicado.
- HU-03: filtro por distrito y resultado vacío.
- Checkpoint: verificación funcional en navegador + pruebas de filtro/detalle + captura para informe.

### Bloque B — Sprint 2 (HU-04, HU-05, HU-07, HU-06; 16 SP)
- HU-04: autenticación, acceso a reportes, errores de login y sesión.
- HU-05: crear reportes `pending`, validar datos y autoría.
- HU-07: moderar aprobar/rechazar con control real de permisos (conviene antes que mostrar alertas públicas).
- HU-06: mostrar solo alertas `approved`; nunca enseñar pendientes como verificadas.
- Checkpoint: prueba autorización usuario regular vs moderador, persistencia y RLS.

### Bloque C — Sprint 3 (HU-08, HU-09; 13 SP completos en simulación)
- HU-08: selección de origen/destino limitada a puntos disponibles, error cuando falten o no existan.
- HU-09: cálculo/selección de opciones según dataset disponible, representación en mapa y ausencia de opciones.
- HU-10 queda **pendiente en la simulación académica** del Sprint 3 (3 SP); no simular su ejecución real.

### Bloque D — Sprint 4 (HU-11, HU-12, HU-13, HU-10; 16 SP comprometidos)
- HU-11: mapa de estacionamientos.
- HU-12: filtro por distrito.
- HU-13: ficha con condiciones no verificadas etiquetadas.
- HU-10: mostrar alertas validadas asociadas a rutas, sin prometer seguridad.

## Consideraciones sobre el examen y Jira
- Las cifras de Sprint 1..4 son **simulación académica**, no ciclos cronológicos de ejecución de Codex.
- Historial y capturas del tablero los genera el estudiante en Jira; **Codex no debe conectarse a Jira ni crear/modificar/mover tickets**, salvo nueva indicación explícita.
- El tiempo real del examen puede requerir terminar primero todas las historias Must y simplificar Should/Could. No cambiar retrospectivamente el Product Backlog existente sin documentarlo.

## Verificación por avance
Entregar por cada HU: archivos afectados, funcionalidad, pasos de prueba, comandos ejecutados con sus resultados, escenarios válido/inválido/denegado, evidencia y limitaciones.

### Suite mínima sugerida
- HU-01: muestra datos existentes; se informa ausencia si no hay registros.
- HU-03: filtra distritos sin inventar coincidencias.
- HU-04: credenciales válidas/erróneas y sesión expirada.
- HU-05: creación con sesión, rechazo sin sesión y campos inválidos.
- HU-06: `pending/rejected` nunca visibles en el feed público de alertas verificadas.
- HU-07: solo moderador puede aprobar/rechazar; ciclista no cambia roles.
- HU-08: requiere ambos puntos.
- HU-09: caso con recorrido precargado y caso sin resultado; no inventar conectividad.
- HU-10: advertencias aprobadas vinculadas correctamente o mensaje de ausencia de registros.
- HU-11..13: mapa, filtro y ficha con datos desconocidos correctamente indicados.

## Git / CI / despliegue
- Versionar sin exponer secretos. Revisar estado Git y cambios existentes antes de tocar archivos.
- Realizar commits descriptivos por avance **solo si el usuario lo autoriza** y la configuración lo permite.
- Si el enunciado completo exige pipeline: usar GitHub Actions con `npm ci`, lint, typecheck, test y build según scripts reales; incorporar controles de seguridad disponibles. No desactivar verificaciones para tener verde.
- Desplegar en Vercel con credenciales configuradas por el usuario; **pedir autorización antes de modificar infraestructura externa o publicar a producción**.
- Nunca prometer capturas de Jira, resultado de pipeline, URL real o prueba aprobada si no existen.
