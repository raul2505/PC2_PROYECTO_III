# HU-07 · Moderar reportes de riesgo

El rol `moderator` se asigna administrativamente en `public.profiles` a un usuario existente de Supabase Auth. La app reconoce el rol al abrir **Mi cuenta**. Desde el panel de moderación se puede aprobar o rechazar un reporte pendiente.

La función `review_risk_report` vuelve a verificar el rol en PostgreSQL. Un ciclista regular mantiene acceso de solo lectura a sus propios reportes y puede crear reportes pendientes. La decisión solo modifica registros que todavía estén pendientes, lo que evita que dos revisiones simultáneas sobrescriban el resultado.

Para preparar una cuenta de demostración, un administrador compara el UUID con el usuario en Supabase Auth y registra su rol en la tabla `profiles`. Comparte credenciales de prueba mediante un canal privado.

En Supabase local se comprobaron las migraciones de HU-05 a HU-07 con cuentas temporales. La prueba confirmó el estado pendiente inicial, el aislamiento entre ciclistas, el rechazo de un intento de autoasignar el rol, la denegación de moderación a un ciclista, la aprobación y rechazo como moderador y la publicación exclusiva del reporte aprobado con coordenadas aproximadas.
