# Registro

> **Este proyecto no hace logging.** No hay `console.log` en el código
> entregado, ni niveles, ni servicio de telemetría. No hay servidor donde
> escribir.

---

## Por qué

El código se le entrega a un cliente y corre en el navegador de sus
visitantes. Una consola llena de mensajes de depuración es ruido visible
para cualquiera que abra las herramientas de desarrollo.

`console.log` sirve mientras se depura. **Se quita antes de commitear.**

---

## Lo que sí se registra

**El kardex** (`assets/js/db.js`) es la única bitácora, y es de negocio, no
técnica: quién movió qué stock, cuánto y por qué.

```js
DB.registrarMovimiento(id, 'entrada', 5, 'Entrada rápida');
```

Se guarda tipo, cantidad, nota y fecha ISO; se muestra en el panel bajo
"Últimos movimientos"; se recorta a 200 entradas.

**Cada operación que cambie stock debe registrar su movimiento.** Si se
agrega una forma nueva de mover inventario (una venta, una devolución), va
con su `registrarMovimiento` y una nota que el dueño entienda.

---

## Notas de movimiento

Van en español y describen el hecho, no la implementación:

| Bien | Mal |
|---|---|
| `Entrada rápida` | `stepper +1` |
| `Edición manual` | `PUT /producto` |
| `Producto creado` | `DB.crear()` |

---

## Depuración

Mientras se trabaja: consola del navegador, `debugger`, e inspección directa
del estado desde la consola (`DB.todos()`, `DB.resumen()` están disponibles
como globales, lo cual es útil a propósito).

Nada de eso queda en el código commiteado.
