# HU-03 · Filtrar ciclovías por distrito

En `/mapa`, el selector **Distrito** actualiza la lista y los trazados visibles. Cuando hay resultados, el mapa encuadra el catálogo filtrado. Si la ficha abierta queda fuera del filtro, se cierra. **Vista inicial** encuadra los trazados del filtro activo.

Miraflores sirve para comprobar el estado vacío del catálogo de demostración. El mensaje se refiere únicamente a ese catálogo. El mapa base sigue disponible y **Ver todos los distritos** restaura los tres trazados y devuelve el foco al selector.

## Prueba manual

1. Ejecuta `npm.cmd run dev` y abre `http://localhost:3000/mapa`.
2. Abre la ficha de **Tramo Centro** y elige **Pueblo Libre**. Debe quedar solo **Tramo Oeste**, tanto en la lista como en el mapa, y la ficha anterior debe cerrarse.
3. Elige **Miraflores** y comprueba que se informa la ausencia de datos de muestra y se quitan los trazados.
4. Pulsa **Ver todos los distritos** y comprueba que se restauran los tres trazados. Repite el recorrido en móvil.

## Verificación local

Pasaron lint, TypeScript, ocho pruebas de Vitest y el build. En Chrome, con teselas simuladas, se comprobó en escritorio y móvil que el filtro actualiza la lista, cierra una ficha fuera del distrito y retira los trazados en el estado vacío. La prueba también verificó que se redibujan los tres trazados al limpiar el filtro y que el foco vuelve al selector.
