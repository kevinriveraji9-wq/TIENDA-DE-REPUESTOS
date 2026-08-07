/* ============================================================
   Utilidades compartidas: iconos, formato, toasts, modales
   ============================================================ */

const UI = (() => {

  /* ---------- Iconos de producto (line art) ---------- */
  const ART = {
    disc: '<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="7"/><path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M46 46l-4-4M46 18l-4 4M18 46l4-4"/>',
    filter: '<path d="M22 14h20v8l-6 7v19l-8-4V29l-6-7z"/><path d="M26 18h12"/>',
    shock: '<path d="M32 10v10"/><path d="M26 20h12v8H26z"/><path d="M28 28l8 5-8 5 8 5-8 5"/><path d="M26 50h12v4H26z"/>',
    battery: '<rect x="12" y="22" width="40" height="24" rx="4"/><path d="M20 22v-4h6v4M38 22v-4h6v4"/><path d="M24 34h6M36 31v6M33 34h6"/>',
    sparkplug: '<path d="M28 10h8v10h-8z"/><path d="M27 20h10l-2 8h-6z"/><path d="M28 28h8v10h-8z"/><path d="M30 38h4v12"/>',
    belt: '<ellipse cx="32" cy="32" rx="22" ry="14"/><circle cx="20" cy="32" r="5"/><circle cx="44" cy="32" r="5"/>',
    radiator: '<rect x="12" y="16" width="40" height="32" rx="4"/><path d="M22 16v32M32 16v32M42 16v32"/>',
    alternator: '<circle cx="30" cy="32" r="16"/><circle cx="30" cy="32" r="5"/><path d="M46 26h8v12h-8"/>',
    headlight: '<path d="M14 22h20a14 14 0 0 1 0 20H14z" /><path d="M42 26h10M42 32h12M42 38h10"/>',
    rim: '<circle cx="32" cy="32" r="21"/><circle cx="32" cy="32" r="8"/><path d="M32 11v13M32 40v13M11 32h13M40 32h13"/>',
    seat: '<path d="M22 12h14a4 4 0 0 1 4 4v20H22z"/><path d="M18 36h26v8a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M24 48v6M42 48v6"/>',
    mat: '<path d="M14 16h28l8 12v20H14z"/><path d="M14 28h36"/>',
    ledstrip: '<rect x="8" y="26" width="48" height="12" rx="4"/><path d="M18 30v4M26 30v4M34 30v4M42 30v4M50 30v4"/>',
    foglight: '<circle cx="26" cy="32" r="15"/><circle cx="26" cy="32" r="7"/><path d="M46 24l8-4M46 32h9M46 40l8 4"/>',
    spoiler: '<path d="M10 26h44v6H10z"/><path d="M18 32v10M46 32v10"/><path d="M14 44h10M40 44h10"/>',
    camera: '<rect x="12" y="22" width="40" height="24" rx="6"/><circle cx="32" cy="34" r="8"/><path d="M22 22l4-6h12l4 6"/>',
    speaker: '<rect x="16" y="10" width="32" height="44" rx="6"/><circle cx="32" cy="38" r="9"/><circle cx="32" cy="20" r="4"/>',
    screen: '<rect x="8" y="14" width="48" height="32" rx="5"/><path d="M24 52h16M32 46v6"/><path d="M16 22h14M16 28h10"/>',
    tint: '<path d="M12 20h40l-4 24H16z"/><path d="M20 20l-2 24M32 20v24M44 20l2 24"/>',
    freshener: '<path d="M32 10l16 26H16z"/><path d="M28 36h8v10h-8z"/><path d="M32 10v-4"/>',
    wheelcover: '<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="12"/><path d="M32 12v8M14 36l10-3M50 36l-10-3"/>',
    grid: '<rect x="12" y="12" width="16" height="16" rx="4"/><rect x="36" y="12" width="16" height="16" rx="4"/><rect x="12" y="36" width="16" height="16" rx="4"/><rect x="36" y="36" width="16" height="16" rx="4"/>',
  };

  function arteProducto(key, clase) {
    const d = ART[key] || ART.filter;
    return `<svg class="${clase || 'art'}" viewBox="0 0 64 64" fill="none" stroke="currentColor"
      stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }

  /* ---------- Iconos de interfaz ---------- */
  const ICO = {
    home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/>',
    catalog: '<rect x="3" y="4" width="7" height="7" rx="2"/><rect x="14" y="4" width="7" height="7" rx="2"/><rect x="3" y="13" width="7" height="7" rx="2"/><rect x="14" y="13" width="7" height="7" rx="2"/>',
    scan: '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/>',
    box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2v.2"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    wa: '<path d="M3.5 20.5l1.3-4.6A8.2 8.2 0 1 1 8.4 19l-4.9 1.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.5-.8-1 .8a4.6 4.6 0 0 1-2.3-2.3l.8-1L10.7 9c-.5 0-1 .3-1.7.5z"/>',
    tag: '<path d="M3 12V4h8l9 9-8 8-9-9z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  };

  function icono(key, size) {
    const d = ICO[key] || ICO.box;
    const s = size || 20;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }

  /* ---------- Formato ---------- */
  const pesos = (n) => '$' + Number(n || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });

  const fecha = (iso) => new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const escape = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* quita tildes para que "farola" encuentre "faróla" y viceversa */
  const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');
  const normalizar = (s) => String(s || '').toLowerCase()
    .normalize('NFD').replace(DIACRITICOS, '');

  /* ---------- Barra superior horizontal ----------
     Wordmark a la izquierda, links al centro, acciones a la
     derecha. A todo el ancho y siempre en carbón. */
  function barra(activo) {
    const links = [
      { id: 'destacados', label: 'Destacados', href: 'index.html#destacados' },
      { id: 'catalogo',   label: 'Catálogo',   href: 'index.html#catalogo' },
      { id: 'repuestos',  label: 'Repuestos',  href: 'index.html#catalogo', tipo: 'Repuestos' },
      { id: 'lujos',      label: 'Lujos',      href: 'index.html#catalogo', tipo: 'Lujos' },
      { id: 'ubicacion',  label: 'Ubicación',  href: 'index.html#ubicacion' },
    ];

    const link = (it) => `
      <a class="navlink ${activo === it.id ? 'is-active' : ''}" href="${it.href}"
         ${it.tipo ? `data-tipo-nav="${it.tipo}"` : ''}>${it.label}</a>`;

    return `
      <div class="topbar-in">
        <a class="marca" href="index.html" aria-label="${NEGOCIO.nombre}">
          <b>Autopartes</b><i></i>
        </a>

        <nav class="navlinks" aria-label="Navegación principal">
          ${links.map(link).join('')}
        </nav>

        <div class="topbar-acciones">
          <span class="chip-auto" id="chip-auto">
            <span id="chip-texto"></span>
            <button id="chip-quitar" aria-label="Quitar filtro de vehículo">${icono('close', 13)}</button>
          </span>
          <button class="icon-oscuro" data-accion="escanear" aria-label="Escanear auto" title="Escanear auto">
            ${icono('scan', 19)}
          </button>
          <a class="icon-oscuro ${activo === 'inventario' ? 'is-active' : ''}" href="admin.html"
             aria-label="Inventario" title="Inventario">${icono('box', 19)}</a>
          <a class="btn btn--rojo btn--sm" id="btn-wa-general" href="#" target="_blank" rel="noopener">
            ${icono('wa', 15)} <span>WhatsApp</span>
          </a>
        </div>
      </div>`;
  }

  /* ---------- Toast ---------- */
  function toast(mensaje, tipo) {
    let cont = document.querySelector('.toasts');
    if (!cont) {
      cont = document.createElement('div');
      cont.className = 'toasts';
      document.body.appendChild(cont);
    }
    const el = document.createElement('div');
    el.className = 'toast toast--' + (tipo || 'ok');
    el.innerHTML = `${icono(tipo === 'error' ? 'alert' : 'check', 16)}<span>${escape(mensaje)}</span>`;
    cont.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 2600);
  }

  /* ---------- Modal ---------- */
  function abrirModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function cerrarModal(id) {
    const m = id ? document.getElementById(id) : document.querySelector('.modal.is-open');
    if (!m) return;
    m.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal')) cerrarModal();
    const cerrar = e.target.closest && e.target.closest('[data-cerrar-modal]');
    if (cerrar) cerrarModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

  return { arteProducto, icono, pesos, fecha, escape, normalizar, barra, toast, abrirModal, cerrarModal };
})();
