# Guías de interfaz

> Maqueta de catálogo para una tienda de repuestos y lujos de carros en
> Pitalito, Huila. **HTML, CSS y JavaScript plano. Sin build, sin
> dependencias, sin framework.** Se abre con doble clic.

---

## Contexto que hay que tener antes de tocar código

- **No hay React, ni Vue, ni TypeScript, ni bundler.** Un "componente" es
  una función que devuelve un string de HTML.
- **Dos páginas:** `index.html` (tienda pública) y `admin.html` (panel de
  inventario). Comparten CSS y varios módulos JS.
- **Sistema de diseño Peloton:** rojo `#df1c2f` sobre carbón `#181a1d`,
  bandas alternadas, y **cero sombras**.
- **El idioma del código es el español**, incluidos nombres de función y
  comentarios.

---

## Índice

| Guía | Contenido | Estado |
|---|---|---|
| [Directory Structure](./directory-structure.md) | Mapa de archivos y orden de carga de scripts | Lleno |
| [Component Guidelines](./component-guidelines.md) | Patrón de render, escape de HTML, delegación de eventos, iconos | Lleno |
| [Hook Guidelines](./hook-guidelines.md) | No hay hooks: patrón de módulo IIFE, arranque y limpieza | Lleno |
| [State Management](./state-management.md) | Objeto `estado` por página y persistencia vía `DB` | Lleno |
| [Quality Guidelines](./quality-guidelines.md) | Tokens del sistema, reglas no negociables, verificación manual | Lleno |
| [Type Safety](./type-safety.md) | Sin TypeScript: formas de dato y validación defensiva | Lleno |

---

## Las tres reglas que más se rompen

1. **Interpolar sin `UI.escape()`.** Todo dato que entre a una plantilla va
   escapado.
2. **Agregar `box-shadow`.** El sistema de diseño lo prohíbe; la
   profundidad sale del contraste y de los bordes de 1px.
3. **Poner listeners en elementos que se repintan.** Se usa delegación
   sobre un contenedor estable.

---

**Idioma**: esta documentación está en español, igual que el código. La
plantilla original de Trellis pedía inglés; se cambió a propósito para no
mezclar idiomas dentro del proyecto.
