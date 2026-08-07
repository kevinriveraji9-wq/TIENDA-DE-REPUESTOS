# Persistencia

> La "base de datos" es `localStorage`. Sin ORM, sin migraciones, sin
> consultas. Todo el acceso está en `assets/js/db.js`.

---

## Claves

| Clave | Contenido |
|---|---|
| `ap_pitalito_inventario_v1` | Array de productos (JSON) |
| `ap_pitalito_movimientos_v1` | Array de movimientos de stock, máximo 200 |

El sufijo `_v1` es intencional: si cambia la forma de los datos, se sube a
`_v2` para que los navegadores con datos viejos siembren de nuevo en vez de
romperse.

---

## API de `DB`

```js
DB.todos()                              // Array de productos
DB.porId(id)                            // Producto | null
DB.crear(datos)                         // rellena defaults, agrega al inicio
DB.actualizar(id, datos)                // merge; registra movimiento si cambió stock
DB.eliminar(id)
DB.ajustarStock(id, delta, motivo)      // nunca baja de 0; registra movimiento
DB.restablecer()                        // vuelve a la semilla
DB.estado(p)                            // 'disponible' | 'bajo' | 'agotado'
DB.resumen()                            // { referencias, unidades, valor, bajos, agotados }
DB.movimientos()                        // kardex, más reciente primero
DB.registrarMovimiento(id, tipo, cantidad, nota)
```

**Al agregar una operación, agregarla aquí,** no en la página que la
necesita. Si `admin.js` empieza a manipular productos por su cuenta, la
tienda deja de reflejar los cambios.

---

## Reglas

**Toda escritura persiste de inmediato.** No hay caché en memoria: cada
mutación hace `guardar(productos)`. Es más lento y no importa a esta escala;
lo que gana es que nunca hay estado divergente entre pestañas.

**Toda lectura pasa por `leer()`,** que siembra si no encuentra nada o si lo
que encuentra no sirve. Por eso nunca hay que comprobar "¿ya hay datos?"
antes de llamar a `DB.todos()`.

**El stock nunca baja de cero:**

```js
p.stock = Math.max(0, p.stock + delta);
```

**Los ids se generan con `nuevoId()`** (timestamp base36 + aleatorio). Los
de la semilla son legibles a propósito (`p01`, `l07`) para poder rastrearlos
en las pruebas.

---

## Kardex

Cada cambio de stock deja registro con tipo (`alta`, `entrada`, `salida`,
`ajuste`), cantidad, nota y fecha ISO. Se recorta a 200 entradas para no
llenar `localStorage`.

Es la única bitácora del proyecto: aquí no se hace logging a consola, y este
registro es lo que el cliente ve en el panel.

---

## `logos.js` es generado

Sale de los SVG en `assets/logos/`. Para regenerarlo tras agregar o quitar
una marca, correr el script que lee los `<path>` y reescribe el archivo.
**No editar `logos.js` a mano**: se sobrescribe.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| `localStorage` fuera de `db.js` | Rompe la única fuente de verdad |
| Cachear productos en una variable de módulo | Se desincroniza con la otra pestaña |
| Cambiar la forma de los datos sin subir el sufijo de versión | Los navegadores con datos viejos fallan al leer |
| Guardar datos sensibles | `localStorage` es texto plano y visible para cualquiera con el equipo |
