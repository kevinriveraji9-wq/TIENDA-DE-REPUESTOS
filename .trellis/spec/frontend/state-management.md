# Manejo de estado

> Dos niveles: **estado de vista** (efímero, en memoria) y **estado
> persistente** (productos e inventario, en `localStorage` vía `DB`).
> No hay librería de estado.

---

## Estado de vista

Un único objeto `estado` en el ámbito del IIFE de cada página. No es global:
vive dentro de `(() => { ... })()`.

```js
/* assets/js/tienda.js */
const estado = {
  q: '',            // texto del buscador
  tipo: 'todos',    // 'todos' | 'Repuestos' | 'Lujos'
  categoria: 'todos',
  vehiculo: null,   // objeto de VEHICULOS tras escanear
};
```

```js
/* assets/js/admin.js */
const estado = { q: '', filtro: 'todos' };
```

**El ciclo es siempre el mismo:** un evento muta `estado`, luego se llama a
la función `pintar*` correspondiente. Nunca se toca el DOM directamente
desde el manejador saltándose el estado.

```js
estado.categoria = b.dataset.categoria;
pintarFiltros();
pintar();
```

---

## Estado persistente

Todo lo que sobrevive a un refresco pasa por `DB` (`assets/js/db.js`).
**Ningún archivo llama a `localStorage` directamente** — esa es la regla
que mantiene el inventario coherente entre la tienda y el panel.

```js
DB.todos()                          // lee
DB.actualizar(id, { stock: 12 })    // escribe
DB.ajustarStock(id, -1, 'Venta')    // escribe + registra movimiento
```

---

## Sincronización entre páginas

La tienda y el panel comparten los mismos datos. `tienda.js` se resuscribe
para reflejar cambios hechos en la otra pestaña:

```js
const refrescar = () => { pintarNota(); pintarVitrina(); pintar(); };
window.addEventListener('storage', refrescar);  // otra pestaña escribió
window.addEventListener('focus', refrescar);    // se vuelve a esta pestaña
```

Al agregar vistas que muestren inventario, engancharlas a ese mismo
`refrescar`.

---

## Entradas duplicadas

El buscador existe dos veces en la tienda (hero y cabecera del catálogo).
Se mantienen sincronizadas por una sola función, no por listeners cruzados:

```js
function buscar(valor, saltar) {
  estado.q = valor.trim();
  $('#q').value = estado.q;
  $('#q2').value = estado.q;
  pintar();
  if (saltar) irAlCatalogo();
}
```

Si se agrega un tercer punto de entrada, se suma ahí, no en otro lado.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| `localStorage.getItem` fuera de `db.js` | Rompe la única fuente de verdad y desincroniza tienda e inventario |
| Guardar estado de vista en `localStorage` | Los filtros son efímeros a propósito; cada visita empieza limpia |
| Variables sueltas en `window` | El estado va dentro del IIFE de cada página |
| Mutar el DOM sin pasar por `estado` | El siguiente repintado revierte el cambio |
