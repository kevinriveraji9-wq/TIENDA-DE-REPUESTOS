# Tienda de repuestos y lujos — Pitalito, Huila

Maqueta de presentación para el catálogo web de una tienda de repuestos y lujos
para carros ubicada en Pitalito (Huila).

## Cómo abrirla

No requiere instalar nada ni levantar un servidor: se abre directamente en el navegador.

- `index.html` — la tienda (catálogo público)
- `admin.html` — panel interno de inventario

## Qué incluye

**Tienda (`index.html`)**
- Buscador en la barra superior con búsqueda por nombre, marca o referencia.
- **Botón "Escanear auto"** dentro del buscador: abre la cámara, corre la animación
  de escaneo e identifica el vehículo. Al confirmarlo, el catálogo queda filtrado
  solo con los productos compatibles.
- Filtros por tipo (Repuestos / Lujos) y por categoría.
- Ficha de producto con precio, disponibilidad, compatibilidad y botón de WhatsApp.
- Sección de servicios y ubicación.

**Inventario (`admin.html`)**
- KPIs: referencias, unidades, valor del inventario, bajo stock y agotados.
- Listado con búsqueda y filtros (Repuestos, Lujos, Bajo stock, Agotados, Destacados).
- Crear, editar y eliminar productos.
- Ajuste rápido de stock con los botones + / − .
- Kardex con los últimos movimientos.
- Botón para restablecer los datos de demostración.

La tienda y el inventario comparten los mismos datos: lo que se cambia en el panel
se refleja en el catálogo.

## Importante para la presentación

Esta es una **maqueta**. Dos cosas son de demostración:

1. **El escáner de auto** abre la cámara real y hace todo el flujo, pero la
   identificación del vehículo está simulada. Para producción se reemplaza la
   función `identificar()` en `assets/js/escaner.js` por una llamada a un
   servicio de visión por IA.
2. **Los datos** (productos, precios, stock) se guardan en el `localStorage` del
   navegador, no en un servidor. Al pasar a producción se conecta una base de datos
   real y el panel queda protegido con usuario y contraseña.

Los datos del negocio (nombre, dirección, teléfono, WhatsApp, horario) están al
final de `assets/js/data.js`, en la constante `NEGOCIO`, listos para reemplazar
por los reales del cliente.

## Estructura

```
index.html              Tienda / catálogo
admin.html              Panel de inventario
assets/css/app.css      Sistema de diseño completo
assets/js/data.js       Datos semilla: productos, vehículos, categorías, negocio
assets/js/db.js         Capa de datos (localStorage) y métricas de inventario
assets/js/ui.js         Iconos, formato de precios, toasts, modales, rail lateral
assets/js/escaner.js    Escáner de vehículo (cámara + flujo de identificación)
assets/js/tienda.js     Lógica del catálogo
assets/js/admin.js      Lógica del panel de inventario
```
