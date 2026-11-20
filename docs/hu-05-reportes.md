# HU-05 · Registrar un reporte de riesgo

Desde **Mi cuenta**, abre **Registrar un reporte de riesgo**. El formulario acepta la ubicación del dispositivo con permiso del navegador o coordenadas introducidas manualmente. El servidor valida la sesión y los campos. PostgreSQL asigna el autor desde `auth.uid()` y guarda el reporte como `pending`. RLS permite a un ciclista leer sus reportes y limita la escritura a los campos del formulario.

La migración `20261120060000_risk_reports.sql` debe aplicarse en el entorno de prueba antes de probar la persistencia. Vitest cubre el envío válido, la falta de sesión y las coordenadas vacías, y verifica que la acción descarta el autor y el estado enviados por el cliente.
