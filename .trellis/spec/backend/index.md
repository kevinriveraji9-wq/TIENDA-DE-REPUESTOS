# Guías de la capa de datos

> **Este proyecto no tiene backend.** No hay servidor, API, base de datos ni
> autenticación. Estas guías documentan lo que ocupa ese lugar: la capa de
> datos sobre `localStorage`, en `assets/js/db.js`.

---

## Contexto que hay que tener antes de tocar código

- **`localStorage` es la persistencia.** Dos claves: inventario y kardex.
- **`db.js` es el único archivo que la toca.** Todo lo demás usa la API de
  `DB`. Esa frontera es lo que mantiene sincronizados la tienda y el panel.
- **`data.js` son constantes puras:** semilla de productos, vehículos,
  categorías y los datos del negocio (`NEGOCIO`).
- **No hay logging.** El kardex es la única bitácora, y es de negocio.
- **Los fallos degradan, no rompen.** Es una maqueta para presentarle a un
  cliente: una pantalla en blanco es el peor resultado.

---

## Índice

| Guía | Contenido | Estado |
|---|---|---|
| [Directory Structure](./directory-structure.md) | Roles de `data.js` y `db.js`, y la frontera de acceso | Lleno |
| [Database Guidelines](./database-guidelines.md) | Claves, API de `DB`, versionado, kardex | Lleno |
| [Error Handling](./error-handling.md) | Datos corruptos, cámara negada, entradas inválidas, toasts | Lleno |
| [Logging Guidelines](./logging-guidelines.md) | Por qué no hay logging y qué se registra en su lugar | Lleno |
| [Quality Guidelines](./quality-guidelines.md) | Idioma del código, comentarios, verificación manual | Lleno |

---

## Las tres reglas que más se rompen

1. **Llamar a `localStorage` fuera de `db.js`.** Desincroniza tienda e
   inventario.
2. **Cambiar la firma de una función de `DB`.** La usan las dos páginas.
3. **Mover stock sin registrar el movimiento.** El kardex es lo que el
   cliente ve en el panel.

---

**Idioma**: esta documentación está en español, igual que el código. La
plantilla original de Trellis pedía inglés; se cambió a propósito para no
mezclar idiomas dentro del proyecto.
