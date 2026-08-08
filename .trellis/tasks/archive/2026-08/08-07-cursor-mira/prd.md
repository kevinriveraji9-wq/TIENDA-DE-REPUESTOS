# Rediseño del cursor: mira de escáner

Reemplaza el cursor propio entregado en `08-07-tipografia-cursor`. El
anterior (punto rojo + anillo que persigue con retraso) fue rechazado por el
desarrollador: se sentía de adorno y el retraso del anillo daba sensación de
lentitud.

---

## Dirección elegida

Una **mira de encuadre**: cuatro esquinas en rojo que enmarcan el puntero,
con un punto central. Es el mismo motivo visual que ya usa el visor del
escáner (`.marco` en `assets/css/app.css`), así que el cursor pasa a formar
parte del lenguaje de la función estrella del sitio en vez de ser un efecto
suelto.

---

## Requisitos

1. **Cuatro esquinas** de borde rojo (`--rojo`) formando un encuadre
   alrededor del puntero, más un punto central pequeño.
2. **Sin retraso ni interpolación.** El encuadre sigue la posición exacta
   del mouse. Esa era la queja principal del diseño anterior.
3. **Sobre elementos accionables el encuadre se cierra**: el marco se
   reduce y las esquinas se alargan, como una mira que fija el objetivo.
4. Reutilizar el patrón visual de `.marco` del escáner (esquinas con dos
   bordes, sin `border-radius` grande) para que se lean como la misma cosa.
5. Se mantienen todas las salvaguardas del cursor anterior:
   - Solo bajo `@media (hover: hover) and (pointer: fine)`.
   - En táctil no se muestra ni consume nada.
   - Cede al I-beam del sistema sobre campos de texto.
   - Respeta `prefers-reduced-motion` (sin transición de tamaño).
   - La clase que oculta el puntero del sistema la pone el JS después de
     crear los elementos, para que un fallo no deje la página sin cursor.
   - El seguimiento va en `requestAnimationFrame`.
6. Aplica en `index.html` y `admin.html`.

---

## Criterios de aceptación

- El encuadre sigue al mouse sin retraso perceptible.
- Sobre un botón o una tarjeta, el marco se cierra; al salir, vuelve.
- Sobre un `input` de texto, el cursor propio se oculta y aparece el I-beam.
- Con ancho de móvil o `pointer: coarse`, los elementos no se muestran
  (`display: none`).
- Sigue habiendo **cero `box-shadow`** en el proyecto.
- Sin peticiones de red externas.

---

## Fuera de alcance

- Tocar la tipografía, que quedó aprobada en la tarea anterior.
- Cambiar la paleta, los radios o la estructura de las páginas.
- Animaciones de clic o rastro (trail).

---

## Verificación

Manual, en navegador, según
`.trellis/spec/frontend/quality-guidelines.md`: abrir las dos páginas,
recorrer los criterios de arriba y comprobar el ancho de móvil.
