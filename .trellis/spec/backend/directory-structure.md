# Estructura — capa de datos

> **Este proyecto no tiene backend.** No hay servidor, ni API, ni base de
> datos, ni build. Los archivos de este directorio documentan lo que ocupa
> ese lugar: la capa de datos sobre `localStorage`.

---

## Los dos archivos

| Archivo | Rol |
|---|---|
| `assets/js/data.js` | **Semilla y configuración.** Constantes puras, sin lógica: `PRODUCTOS_SEED`, `VEHICULOS`, `CATEGORIAS`, `MARCAS_AUTO`, `NEGOCIO` |
| `assets/js/db.js` | **Acceso y persistencia.** El módulo `DB`: CRUD, ajustes de stock, kardex y métricas |

`assets/js/logos.js` es generado, no se edita a mano: sale de los SVG de
`assets/logos/` (ver `database-guidelines.md`).

---

## Frontera

`db.js` es el **único** archivo que toca `localStorage`. Todo lo demás pasa
por la API de `DB`. Esa frontera es lo que permite que la tienda y el panel
de inventario no se desincronicen, y lo que haría posible cambiar a un
servidor real tocando un solo archivo.

```
tienda.js ─┐
           ├─→ DB ──→ localStorage
admin.js  ─┘
```

---

## Datos del negocio

`NEGOCIO`, al final de `data.js`, tiene los datos reales del cliente:
nombre, eslogan, ciudad, dirección, teléfono, WhatsApp y horario. De ahí
salen los enlaces `wa.me` y los textos del pie y el mapa.

**Nunca escribir esos valores directo en el HTML o en la lógica.** Cambiar
de cliente o corregir un teléfono debe ser editar un solo objeto.

---

## Si el proyecto crece a servidor real

El camino previsto, en orden: reemplazar el cuerpo de las funciones de `DB`
por llamadas HTTP manteniendo la misma firma; mover `PRODUCTOS_SEED` a una
migración; y proteger `admin.html` con autenticación. La forma de la API de
`DB` ya está pensada para ese cambio — no romperla.
