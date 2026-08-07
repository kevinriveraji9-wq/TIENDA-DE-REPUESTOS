# Estándares de calidad — interfaz

> No hay linter, no hay tests automatizados, no hay CI. La verificación es
> abrir las dos páginas en el navegador y probar los flujos.

---

## Sistema de diseño: Peloton (rojo sobre carbón)

Tomado de https://styles.refero.design/style/355e8465-df7d-486a-9d76-2ace37d076a2
Los valores viven como variables CSS en `:root` de `assets/css/app.css`.

| Token | Valor | Uso |
|---|---|---|
| `--rojo` | `#df1c2f` | Único acento. Solo CTAs, precios destacados y estados activos |
| `--carbon` | `#181a1d` | Bandas oscuras, barra superior |
| `--niebla` | `#f7f7f7` | Lienzo de las secciones claras |
| `--plata` | `#e4e6e7` | Bordes hairline de 1px |
| `--r-sm` | `6px` | Imágenes, etiquetas, inputs |
| `--r-card` | `24px` | Tarjetas |
| `--r-pill` | `28px` | Botones y píldoras |

**Usar siempre la variable, nunca el hex literal.** Si se necesita un color
que no está en `:root`, la pregunta correcta es si de verdad hace falta.

---

## Reglas no negociables del sistema

**Cero sombras.** El sistema prohíbe `box-shadow`. La profundidad sale del
contraste entre superficies y de los bordes de 1px. La única excepción viva
es el anillo de foco de los inputs. Verificable:

```js
[...document.querySelectorAll('*')].filter(e => getComputedStyle(e).boxShadow !== 'none')
```

**Ritmo de bandas.** Las secciones alternan oscuro (`.banda--oscura`) y
claro (`.banda--clara` o blanco), a sangre en todo el ancho. Es lo que le da
carácter al diseño; no romperlo metiendo todo en un contenedor blanco.

**Microetiquetas en mayúsculas.** 11px, peso 600, `letter-spacing: .025em`,
clase `.micro`. Los titulares grandes van en peso 300.

---

## Antes de dar algo por terminado

1. Abrir `index.html` y `admin.html` en el navegador.
2. En la tienda: buscar, filtrar por tipo y categoría, abrir una ficha,
   correr el escáner y confirmar que filtra por compatibilidad.
3. En el panel: crear, editar y borrar un producto; ajustar stock con
   `+` / `−`; confirmar que el kardex registra el movimiento.
4. Volver a la tienda y verificar que el cambio de stock se refleja.
5. Probar en ancho de celular (menos de 720px).

---

## Accesibilidad

Lo que ya se cumple y hay que mantener: `aria-label` en botones que solo
tienen icono, `alt`/`aria-label` en los SVG con significado, foco visible en
los inputs, y `prefers-reduced-motion` respetado en la cinta de marcas.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| Agregar `box-shadow` | Contradice la regla central del sistema de diseño |
| Escribir colores en hex dentro de las reglas | Rompe la posibilidad de recolorear el sitio desde `:root` |
| Nombrar clases por su apariencia (`.rojo-24`) | Las clases describen función: `.card`, `.badge--bajo`, `.banda--oscura` |
| Dejar clases con nombre desactualizado | Ya pasó con `btn--violeta` cuando el acento cambió a rojo; renombrar al cambiar |
