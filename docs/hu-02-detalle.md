# HU-02 · Consultar detalle de un tramo

En `/mapa`, el visitante puede pulsar un trazado o seleccionar su nombre en la lista de tramos. Ambas acciones abren la misma ficha y resaltan la línea seleccionada sin restablecer el encuadre del mapa. La lista permite abrir la ficha con teclado incluso cuando el mapa base falla.

La ficha incluye el distrito de referencia, una descripción y el estado reportado. Los distritos son referencias del catálogo ficticio. El estado de Tramo Centro está marcado como simulado. Las fichas sin estado registrado muestran «Sin información verificada».

## Prueba manual

1. Inicia `npm.cmd run dev` y abre `http://localhost:3000/mapa`.
2. Pulsa **Tramo Centro**. Comprueba que la ficha muestra el distrito, la descripción y «Pavimento regular (simulado)».
3. Selecciona **Tramo Oeste** o **Tramo Sur**. Comprueba que se resalta el nuevo tramo y que la ficha muestra «Sin información verificada».
4. Selecciona una línea en el mapa y comprueba que se activa su botón en la lista. En móvil, comprueba que la ficha se lleva a la vista.

| Criterio | Evidencia |
| --- | --- |
| CA1 · Ver distrito, descripción y estado reportado. | Prueba Vitest con la ficha de Tramo Centro. |
| CA2 · Mostrar «Sin información verificada» cuando no hay estado. | Prueba Vitest con una ficha sin estado reportado. |

Pasaron lint, TypeScript, las cinco pruebas de Vitest y el build. En Chrome se comprobó el clic sobre un trazado y su resaltado en escritorio. En móvil se bloqueó la carga de teselas y se comprobó que la ficha seguía accesible. También se verificó la selección por teclado y la ausencia de desbordamiento horizontal en ambos tamaños.
