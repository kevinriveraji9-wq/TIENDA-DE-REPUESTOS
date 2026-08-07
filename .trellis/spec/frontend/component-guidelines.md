# Componentes

> Aquí no hay React ni componentes de framework. Un "componente" es una
> **función que recibe datos y devuelve un string de HTML**, que luego se
> asigna a `innerHTML` de un contenedor.

---

## El patrón

```js
/* assets/js/tienda.js */
function tarjeta(p) {
  const est = DB.estado(p);
  return `
    <button class="card" data-id="${p.id}">
      <span class="card-img">${UI.arteProducto(p.icon)}</span>
      <span class="card-cuerpo">
        <span class="card-marca">${UI.escape(p.marca)}</span>
        <span class="card-nombre">${UI.escape(p.nombre)}</span>
      </span>
    </button>`;
}

// Se pinta la lista completa de una sola pasada
grid.innerHTML = lista.map(tarjeta).join('');
```

Ejemplos reales: `tarjeta()` y `pintarVitrina()` en `assets/js/tienda.js`,
`pintarTabla()` y `pintarKpis()` en `assets/js/admin.js`.

---

## Reglas

**Toda interpolación de datos pasa por `UI.escape()`.** Es la única defensa
contra HTML roto o inyectado, porque estamos concatenando strings. Los
nombres de producto los escribe el usuario en el panel de inventario.

```js
${UI.escape(p.nombre)}     // correcto
${p.nombre}                // nunca
```

Excepción: el HTML que genera `UI.arteProducto()` y `UI.icono()`, que son
SVG construidos por nosotros, no datos de usuario.

**Las funciones que pintan se llaman `pintarX()`** y no devuelven nada:
escriben directo en el DOM. Las que solo arman markup son sustantivos
(`tarjeta`, `plantilla`). Respetar esa distinción.

**Repintado completo, no mutación puntual.** Cuando cambia el estado se
vuelve a generar la lista entera. Con catálogos de este tamaño es más simple
y no se desincroniza. No introducir diffing ni actualizaciones quirúrgicas.

---

## Eventos: delegación, no listeners por elemento

Como el HTML se regenera, los listeners individuales se perderían. Todo se
engancha una sola vez en un contenedor estable:

```js
document.body.addEventListener('click', (e) => {
  const card = e.target.closest('.card[data-id]');
  if (card) abrirDetalle(card.dataset.id);
});
```

Los datos que necesita el manejador viajan en `data-*`: `data-id`,
`data-tipo`, `data-categoria`, `data-accion`, `data-ajuste`.

---

## Iconografía

Todos los iconos son SVG en línea, definidos como trazados en `ui.js`
(`ART` para productos, `ICO` para interfaz) y servidos por
`UI.arteProducto(clave)` y `UI.icono(clave, tamaño)`.

Van con `stroke="currentColor"` o `fill="currentColor"` para heredar el
color del contexto — así el mismo icono sirve en gris sobre la banda oscura
y en negro sobre fondo claro. **No usar `<img>` para iconos**: impide
recolorearlos por CSS.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| `element.innerHTML +=` dentro de un bucle | Reparsea todo el contenedor en cada vuelta; armar el string y asignar una vez |
| Listeners sobre elementos que se repintan | Se pierden en el siguiente render |
| Interpolar datos sin `UI.escape()` | Rompe el HTML y abre la puerta a inyección |
| Crear un sistema de plantillas o un mini-framework | El proyecto es una maqueta; la simplicidad es el punto |
