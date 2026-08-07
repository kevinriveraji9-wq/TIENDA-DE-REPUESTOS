# Tipografía del hero y cursor personalizado

Dos mejoras visuales sobre la maqueta de la tienda, pedidas por el cliente
interno (el desarrollador que presentará la página).

---

## Contexto

El sitio usa el sistema de diseño Peloton (ver
`.trellis/spec/frontend/quality-guidelines.md`): rojo `#df1c2f` sobre carbón
`#181a1d`, bandas alternadas, cero sombras.

El titular del hero está en `index.html` dentro de `.banda--oscura`, con
estilos en `assets/css/app.css`:

```css
h1 { font-size: 48px; font-weight: 300; line-height: 1.06; letter-spacing: -.008em; }
.hero h1 { font-size: 60px; max-width: 16ch; margin: 0 auto; }
```

---

## Problema 1: la tipografía se ve genérica

El CSS declara `font-family: Inter, ...` pero **Inter no está instalada en
el sistema**, así que cae a Segoe UI en Windows y a Helvetica en Mac. El
resultado es un titular de trazo blando, con espaciado suelto y distinto en
cada computador donde se presente.

### Requisitos

1. Servir Inter desde el proyecto (`assets/fonts/`), no desde un CDN. El
   spec exige que la maqueta funcione sin internet.
2. Usar la versión variable (un solo archivo cubre pesos 100–900).
3. `font-display: swap` para que el texto sea legible mientras carga.
4. Afinar el tratamiento del titular: tracking negativo real a tamaño
   display, escala fluida con `clamp()` en vez de saltos por breakpoint, y
   quiebre de línea equilibrado.
5. La reserva del sistema debe seguir declarada por si el woff2 falla.

### Criterios de aceptación

- `document.fonts.check('300 60px Inter')` devuelve `true` con la página
  cargada.
- El titular escala de forma continua entre 320px y 1280px de ancho, sin
  saltos bruscos.
- El `letter-spacing` a tamaño display es más cerrado que el actual
  (`-.008em`), que es demasiado suelto para 60px.
- Sin peticiones de red externas: verificable en la pestaña Network.

---

## Problema 2: el cursor no tiene diseño

El puntero es el del sistema. Se pide un cursor propio, acorde al sistema de
diseño.

### Requisitos

1. Punto sólido en rojo que sigue al mouse con precisión, más un anillo que
   lo persigue con retraso suave.
2. Sobre elementos interactivos (`a`, `button`, `.card`, `input`) el anillo
   crece y cambia de estado.
3. **Solo en dispositivos con puntero fino**: activar bajo
   `@media (hover: hover) and (pointer: fine)`. En celular y tablet no debe
   existir ni consumir nada.
4. Respetar `prefers-reduced-motion`: sin persecución suavizada.
5. En campos de texto debe verse el cursor de texto del sistema (I-beam);
   no romper la usabilidad del formulario del panel.
6. El seguimiento va con `requestAnimationFrame`, no con un handler que
   escriba estilos en cada evento `mousemove`.

### Criterios de aceptación

- En escritorio el cursor propio aparece y sigue al mouse sin salto ni
  retraso perceptible en el punto.
- En ancho de móvil (menos de 720px) o con `pointer: coarse`, los elementos
  del cursor no se muestran.
- Los inputs del panel siguen mostrando el I-beam y son usables.
- Con "reducir movimiento" activo, el anillo no interpola.
- Aplica en las dos páginas: `index.html` y `admin.html`.

---

## Fuera de alcance

- Cambiar la paleta, los radios o la regla de cero sombras.
- Tocar la estructura del hero o del catálogo.
- Animaciones de scroll o transiciones entre páginas.

---

## Verificación

No hay tests automatizados (ver
`.trellis/spec/frontend/quality-guidelines.md`). Se abren `index.html` y
`admin.html` en el navegador y se recorre la lista de criterios de arriba,
incluyendo el ancho de móvil.
