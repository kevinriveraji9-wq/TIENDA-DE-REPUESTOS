# Estándares de calidad — capa de datos

> Sin tests automatizados. La verificación es manual, desde la consola del
> navegador y usando el panel de inventario.

---

## Idioma del código

**Todo en español**: nombres de función, variables, comentarios y mensajes.
`pintarTabla`, `ajustarStock`, `nuevoId`, `estado`, `lista`, `heno`.

Las únicas excepciones son las palabras de JavaScript y las APIs del
navegador (`localStorage`, `addEventListener`, `getUserMedia`). Es la
convención del proyecto y hay que mantenerla — código mitad en inglés y
mitad en español es peor que cualquiera de los dos.

---

## Comentarios

Explican **por qué**, no qué. Los que hay en el código son buenos ejemplos:

```js
/* quita tildes para que "farola" encuentre "faróla" y viceversa */
/* La lista va duplicada: la animación corre media pista y reinicia sin salto */
/* Sin permiso o sin cámara: el escaneo sigue en modo demo */
```

Las secciones se separan con banderas de bloque:

```js
/* ---------- CRUD ---------- */
```

---

## Verificación manual

Desde la consola, con la página abierta:

```js
DB.resumen()                    // { referencias: 22, unidades: 356, ... }
DB.todos().length               // 22 con la semilla
DB.movimientos().length         // crece con cada ajuste
DB.estado(DB.porId('p07'))      // 'bajo' — batería con stock 3 y mínimo 5
```

Después de tocar `db.js`, la prueba mínima:

1. `DB.restablecer()` y confirmar que vuelven las 22 referencias.
2. Ajustar stock con `+` / `−` en el panel y ver el movimiento en el kardex.
3. Bajar un producto a 0 y confirmar que la tienda lo muestra "Agotado".
4. Crear, editar y borrar un producto.
5. Abrir tienda y panel en dos pestañas y comprobar que se sincronizan.

---

## Antes de commitear

- Sin `console.log` ni `debugger`.
- Sin dependencias nuevas ni etiquetas `<script>` a CDN.
- Los datos del cliente siguen en `NEGOCIO`, no dispersos en el código.
- Las dos páginas abren sin errores en consola.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| Nombrar en inglés | Rompe la convención del proyecto |
| Comentar lo obvio (`// suma uno`) | Ruido; el comentario explica la razón, no la línea |
| Cambiar la firma de una función de `DB` | La usan tienda y panel; se rompen los dos |
| Dar algo por bueno sin abrir el navegador | No hay tests que lo respalden |
