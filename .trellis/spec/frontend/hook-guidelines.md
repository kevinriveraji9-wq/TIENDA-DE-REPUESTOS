# Módulos y ciclo de vida

> **Este proyecto no tiene hooks.** No hay React. El archivo conserva el
> nombre que genera Trellis, pero documenta lo que ocupa ese lugar aquí:
> cómo se organiza un módulo y cuándo arranca.

---

## Patrón de módulo

Dos formas, según si expone API o no.

**Módulo con API pública** — IIFE que devuelve un objeto (`DB`, `UI`, `Escaner`):

```js
const DB = (() => {
  const KEY = 'ap_pitalito_inventario_v1';   // privado
  function leer() { /* ... */ }              // privada

  const api = {
    todos: () => leer(),
    crear(datos) { /* ... */ },
  };
  return api;
})();
```

**Módulo de página** — IIFE que no devuelve nada (`tienda.js`, `admin.js`).
Todo queda encapsulado; al DOM solo se llega por los manejadores.

---

## Arranque

Ambas páginas terminan igual, y esto **no es opcional**:

```js
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
```

Los `<script>` van al final del `<body>`, así que normalmente el DOM ya está
listo. La guarda cubre el caso en que el script se evalúe después de que
`DOMContentLoaded` ya disparó — pasó con visores que inyectan los scripts, y
sin la guarda la página quedaba en blanco.

---

## Orden dentro de `init()`

1. Pintar la barra superior (`UI.barra(...)`) — **primero**, porque crea
   nodos que los pasos siguientes buscan (`#chip-auto`, `#btn-wa-general`).
2. Rellenar textos fijos desde `NEGOCIO`.
3. Pintar las secciones dinámicas.
4. Montar el escáner (`Escaner.montar(callback)`).
5. Enganchar eventos (`eventos()`) — **al final**, cuando todo existe.

Saltarse el orden produce `null` al buscar elementos que aún no se han
creado.

---

## Limpieza

El escáner es el único módulo con recursos que hay que liberar: la cámara
(`MediaStream`) y los temporizadores del análisis. Ambos se sueltan en
`limpiar()`, que se invoca al cerrar el modal, al cancelar y con `Escape`.

Cualquier módulo nuevo que abra cámara, temporizadores o listeners globales
debe exponer su propio `limpiar()` y llamarlo en los mismos tres puntos.
