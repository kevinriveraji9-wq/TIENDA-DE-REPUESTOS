# Tipos y validación

> **No hay TypeScript.** JavaScript plano sin anotaciones ni JSDoc de tipos.
> Sin build no hay dónde compilar, y agregarlo contradice el requisito de
> que el proyecto se abra con doble clic.

Lo que sustituye a los tipos: formas de dato documentadas y validación
defensiva en los bordes.

---

## Forma de un producto

Definida por `PRODUCTOS_SEED` en `assets/js/data.js` y por los valores por
defecto de `DB.crear()`. Todo producto tiene:

```js
{
  id: 'p01',            // string único
  nombre: 'Pastillas de freno delanteras',
  marca: 'Brembo',
  ref: 'BR-P4521',      // en mayúsculas
  tipo: 'Repuestos',    // 'Repuestos' | 'Lujos'
  categoria: 'frenos',  // id existente en CATEGORIAS
  icon: 'disc',         // clave existente en ART (ui.js)
  precio: 128000,       // número, pesos sin decimales
  stock: 24,            // número >= 0
  stockMin: 6,          // umbral de "bajo stock"
  compat: ['spark-gt'], // ids de VEHICULOS, o ['universal']
  destacado: true,
  descripcion: '...'
}
```

**`DB.crear()` rellena los faltantes**, así que nunca hay que pasar el
objeto completo — pero los campos que sí se pasen deben respetar el tipo.

---

## Validación en los bordes

**Los `<input type="number">` devuelven string.** Convertir siempre:

```js
precio: Number(form.precio.value) || 0,
stock: Number(form.stock.value) || 0,
```

El `|| 0` cubre el campo vacío, que da `NaN`.

**Lectura de `localStorage`** siempre en `try/catch` con reserva a semilla,
porque el contenido puede estar corrupto o no ser un array:

```js
try {
  const datos = JSON.parse(raw);
  return Array.isArray(datos) && datos.length ? datos : sembrar();
} catch (e) {
  return sembrar();
}
```

**Búsquedas que pueden fallar** devuelven `null` y se comprueba:

```js
const p = DB.porId(id);
if (!p) return;
```

**Acceso a propiedades de un resultado opcional** con objeto vacío de
respaldo:

```js
(CATEGORIAS.find(c => c.id === p.categoria) || {}).nombre || '—'
```

---

## Claves que deben existir

Estos valores son referencias cruzadas; un valor inválido rompe el render
en silencio (icono en blanco, filtro que no encuentra nada):

- `producto.categoria` → un `id` de `CATEGORIAS` (`data.js`)
- `producto.icon` → una clave de `ART` (`ui.js`)
- `producto.compat[]` → un `id` de `VEHICULOS`, o el literal `'universal'`

Al agregar una categoría o un icono nuevo, agregarlo también en su fuente.
