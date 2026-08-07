# Manejo de errores

> No hay servidor que devuelva códigos de error. Los fallos posibles son
> tres: datos corruptos en `localStorage`, permisos de cámara negados, y
> entradas inválidas en el formulario del panel.

---

## Principio

**Degradar, no romper.** Esto es una maqueta que se le presenta a un
cliente: una pantalla en blanco es el peor resultado posible. Cuando algo
falla, la página sigue funcionando con menos.

---

## Datos corruptos

`leer()` en `db.js` nunca propaga la excepción: siembra de nuevo.

```js
function leer() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return sembrar();
    const datos = JSON.parse(raw);
    return Array.isArray(datos) && datos.length ? datos : sembrar();
  } catch (e) {
    return sembrar();
  }
}
```

Se valida `Array.isArray` además del `try`, porque un JSON válido puede no
tener la forma esperada.

---

## Cámara negada

`Escaner.iniciarCamara()` captura el fallo de `getUserMedia` y **continúa
con el análisis simulado**, mostrando un cuadro de respaldo en vez del vídeo:

```js
try {
  stream = await navigator.mediaDevices.getUserMedia({ video: {...} });
  video.srcObject = stream;
} catch (e) {
  video.hidden = true;
  fallback.hidden = false;
}
correrAnalisis();   // corre igual, con o sin cámara
```

Esto es deliberado: `getUserMedia` exige contexto seguro, así que al abrir
con `file://` siempre falla. El flujo tiene que poder demostrarse igual.

---

## Entradas inválidas

Primero el HTML (`required`, `type="number"`, `min="0"`), luego conversión
defensiva en JS (`Number(x) || 0`). Cuando la validación no alcanza, se
avisa con un toast y **no se ejecuta la acción**:

```js
if (delta < 0 && p.stock === 0) return UI.toast('Ya está en cero', 'error');
```

---

## Cómo se comunican los errores

`UI.toast(mensaje, 'error')` — franja roja, abajo y al centro, 2,6 segundos.
En español, en lenguaje de tienda, no de programador.

| Bien | Mal |
|---|---|
| `Elige la marca` | `marca is required` |
| `Ya está en cero` | `Error: stock underflow` |

Las acciones destructivas no se avisan: se confirman antes. Borrar un
producto abre `#modal-borrar` con el nombre y la referencia a la vista.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| `alert()` / `confirm()` | Rompen el diseño; hay toasts y modales del sistema |
| `try/catch` vacío que se traga el fallo sin degradar | Deja la interfaz muerta sin explicación |
| Mensajes técnicos al usuario | Quien mira es el dueño de la tienda, no un desarrollador |
| Dejar que un fallo de cámara corte el escáner | Sin cámara el flujo debe poder demostrarse igual |
