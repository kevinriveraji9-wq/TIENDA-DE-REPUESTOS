# Estructura de directorios — capa de interfaz

> Proyecto de HTML, CSS y JavaScript plano. **No hay build, no hay bundler,
> no hay `package.json`, no hay dependencias.** Los archivos se abren
> directamente en el navegador con doble clic o se sirven como estáticos.

---

## Mapa real

```
index.html              Tienda pública (catálogo)
admin.html              Panel interno de inventario
AGENTS.md               Notas para agentes de IA
README.md               Documentación del proyecto

assets/css/app.css      TODO el CSS del proyecto, en un solo archivo
assets/js/data.js       Datos semilla: productos, vehículos, categorías, negocio
assets/js/logos.js      Trazados SVG de los logos de marcas (generado)
assets/js/db.js         Capa de datos sobre localStorage
assets/js/ui.js         Utilidades compartidas: iconos, formato, toasts, modales, barra
assets/js/escaner.js    Escáner de vehículo (cámara + flujo de identificación)
assets/js/tienda.js     Lógica de index.html
assets/js/admin.js      Lógica de admin.html
assets/logos/*.svg      SVG originales descargados (fuente de logos.js)
```

---

## Reglas de ubicación

**Un archivo JS por página, más los compartidos.** `tienda.js` solo lo carga
`index.html`; `admin.js` solo lo carga `admin.html`. Lo que ambas necesitan
vive en `ui.js` o `db.js`.

**Todo el CSS va en `app.css`.** No se crean hojas por página ni `<style>`
en el HTML. Las dos páginas comparten el mismo sistema de diseño, y partirlo
en archivos rompe esa consistencia.

**Los datos de ejemplo van en `data.js`,** nunca embebidos en la lógica.
Ahí están `PRODUCTOS_SEED`, `VEHICULOS`, `CATEGORIAS`, `MARCAS_AUTO` y
`NEGOCIO` (nombre, dirección, WhatsApp del cliente).

---

## Orden de carga de scripts

Es significativo: cada archivo depende de los anteriores. En ambos HTML:

```html
<script src="assets/js/data.js"></script>   <!-- constantes globales -->
<script src="assets/js/logos.js"></script>  <!-- solo index.html -->
<script src="assets/js/db.js"></script>     <!-- usa PRODUCTOS_SEED -->
<script src="assets/js/ui.js"></script>     <!-- usa NEGOCIO -->
<script src="assets/js/escaner.js"></script><!-- usa UI, DB, VEHICULOS -->
<script src="assets/js/tienda.js"></script> <!-- usa todo lo anterior -->
```

Al agregar un archivo, ubicarlo respetando esa cadena. No hay módulos ES ni
`import`: todo son globales declaradas con `const` en el ámbito del script.

---

## Antipatrones

| No hacer | Por qué |
|---|---|
| Agregar `npm install` o un bundler | El cliente abre los archivos sin instalar nada; ese es un requisito del proyecto |
| Crear una hoja de estilos por página | Rompe la unidad del sistema de diseño |
| Cargar librerías por CDN | La maqueta debe funcionar sin internet durante la presentación |
| Usar `import` / `export` | Los `<script>` clásicos no son módulos; fallaría al abrir con `file://` |
