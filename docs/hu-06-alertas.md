# HU-06 · Consultar alertas de riesgo

El mapa consulta `list_public_risk_reports` con la clave publicable. PostgreSQL devuelve los cien reportes aprobados más recientes. La función expone el tipo, la fecha y coordenadas redondeadas a tres decimales. El autor, la descripción privada y las coordenadas originales quedan fuera de la respuesta pública.

Los marcadores muestran tipo, ubicación aproximada y fecha. La interfaz distingue un catálogo sin alertas de un servicio indisponible. HU-07 aporta la pantalla para moderar los reportes y publicar los aprobados.
