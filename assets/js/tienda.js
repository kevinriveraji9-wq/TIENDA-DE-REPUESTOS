/* ============================================================
   Lógica del catálogo (index.html)
   ============================================================ */

(() => {
  const estado = {
    q: '',
    tipo: 'todos',
    categoria: 'todos',
    vehiculo: null,
  };

  const $ = (s) => document.querySelector(s);

  /* ---------- Montaje inicial ---------- */
  function init() {
    $('#rail').innerHTML = UI.rail('inicio');
    $('#hero-arte').innerHTML = UI.arteProducto('rim', 'art');

    $('#dir-linea').textContent = `${NEGOCIO.direccion} · ${NEGOCIO.ciudad}`;
    $('#horario-linea').textContent = `${NEGOCIO.horario} · ${NEGOCIO.telefono}`;
    $('#pie-negocio').textContent = `${NEGOCIO.nombre} — ${NEGOCIO.eslogan}`;
    $('#btn-wa-general').href = enlaceWhatsApp('Hola, los contacto desde la página web.');

    pintarFiltros();
    pintarDestacados();
    pintar();

    Escaner.montar(aplicarVehiculo);
    eventos();
  }

  function enlaceWhatsApp(texto) {
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  /* ---------- Filtros ---------- */
  function pintarFiltros() {
    const tipos = [
      { id: 'todos', nombre: 'Todo', icon: 'grid' },
      { id: 'Repuestos', nombre: 'Repuestos', icon: 'box' },
      { id: 'Lujos', nombre: 'Lujos', icon: 'tag' },
    ];
    $('#pills-tipo').innerHTML = tipos.map(t => `
      <button class="pill ${estado.tipo === t.id ? 'is-active' : ''}" data-tipo="${t.id}">
        ${UI.icono(t.icon, 17)} ${t.nombre}
      </button>`).join('');

    $('#pills-categoria').innerHTML = CATEGORIAS.map(c => `
      <button class="pill ${estado.categoria === c.id ? 'is-active' : ''}" data-categoria="${c.id}">
        ${UI.arteProducto(c.icon, 'art')} ${c.nombre}
      </button>`).join('');
  }

  function filtrar() {
    const q = UI.normalizar(estado.q);
    return DB.todos().filter(p => {
      if (estado.tipo !== 'todos' && p.tipo !== estado.tipo) return false;
      if (estado.categoria !== 'todos' && p.categoria !== estado.categoria) return false;
      if (estado.vehiculo && !p.compat.includes('universal') && !p.compat.includes(estado.vehiculo.id)) return false;
      if (q) {
        const heno = UI.normalizar([p.nombre, p.marca, p.ref, p.tipo, p.descripcion].join(' '));
        if (!heno.includes(q)) return false;
      }
      return true;
    });
  }

  /* ---------- Tarjetas ---------- */
  function tarjeta(p) {
    const est = DB.estado(p);
    const flag = est === 'agotado'
      ? '<span class="badge badge--agotado card-flag">Agotado</span>'
      : est === 'bajo'
        ? `<span class="badge badge--bajo card-flag">Últimas ${p.stock}</span>`
        : p.destacado ? '<span class="badge badge--rojo card-flag">Destacado</span>' : '';

    return `
      <button class="card" data-id="${p.id}">
        <span class="card-img">${UI.arteProducto(p.icon)}${flag}</span>
        <span class="card-cuerpo">
          <span class="card-marca">${UI.escape(p.marca)}</span>
          <span class="card-nombre">${UI.escape(p.nombre)}</span>
          <span class="card-pie">
            <span class="card-precio">${UI.pesos(p.precio)}</span>
            <span class="badge ${est === 'disponible' ? 'badge--ok' : est === 'bajo' ? 'badge--bajo' : 'badge--agotado'}">
              ${est === 'agotado' ? 'Sin stock' : p.stock + ' und'}
            </span>
          </span>
        </span>
      </button>`;
  }

  function pintarDestacados() {
    const destacados = DB.todos().filter(p => p.destacado).slice(0, 5);
    $('#grid-destacados').innerHTML = destacados.map(tarjeta).join('');
  }

  function pintar() {
    const lista = filtrar();
    const grid = $('#grid-catalogo');

    grid.innerHTML = lista.length
      ? lista.map(tarjeta).join('')
      : `<div class="vacio">
           <h3>No encontramos productos</h3>
           <p>Prueba con otra palabra, quita el filtro del vehículo o escríbenos por WhatsApp y lo conseguimos.</p>
         </div>`;

    $('#conteo-catalogo').textContent =
      `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}`;

    $('#titulo-catalogo').textContent = estado.vehiculo
      ? `Compatible con tu ${estado.vehiculo.marca} ${estado.vehiculo.linea}`
      : estado.categoria !== 'todos'
        ? (CATEGORIAS.find(c => c.id === estado.categoria) || {}).nombre
        : 'Todos los productos';
  }

  /* ---------- Detalle ---------- */
  function abrirDetalle(id) {
    const p = DB.porId(id);
    if (!p) return;
    const est = DB.estado(p);
    const compat = p.compat.includes('universal')
      ? ['<span class="badge badge--neutro">Universal — sirve para la mayoría de carros</span>']
      : p.compat.map(cid => {
          const v = VEHICULOS.find(x => x.id === cid);
          return v ? `<span class="badge badge--neutro">${v.marca} ${v.linea} ${v.anio}</span>` : '';
        });

    const mensaje = `Hola, me interesa: ${p.nombre} (${p.ref}) — ${UI.pesos(p.precio)}. ¿Está disponible?`;

    $('#detalle-cuerpo').innerHTML = `
      <div class="detalle">
        <div class="detalle-img">${UI.arteProducto(p.icon)}</div>
        <div>
          <span class="micro">${UI.escape(p.tipo)} · ${UI.escape(p.marca)}</span>
          <h2>${UI.escape(p.nombre)}</h2>
          <span class="badge ${est === 'disponible' ? 'badge--ok' : est === 'bajo' ? 'badge--bajo' : 'badge--agotado'}">
            ${est === 'agotado' ? 'Agotado — lo encargamos' : est === 'bajo' ? `Quedan ${p.stock} unidades` : `${p.stock} unidades disponibles`}
          </span>
          <div class="detalle-precio">${UI.pesos(p.precio)}</div>
          <p class="detalle-desc">${UI.escape(p.descripcion)}</p>

          <a class="btn btn--rojo btn--bloque" href="${enlaceWhatsApp(mensaje)}" target="_blank" rel="noopener">
            ${UI.icono('wa', 18)} Consultar por WhatsApp
          </a>

          <div class="detalle-datos">
            <div class="dato"><span>Referencia</span><span>${UI.escape(p.ref)}</span></div>
            <div class="dato"><span>Marca</span><span>${UI.escape(p.marca)}</span></div>
            <div class="dato"><span>Categoría</span><span>${UI.escape((CATEGORIAS.find(c => c.id === p.categoria) || {}).nombre || '—')}</span></div>
            <div class="dato"><span>Retiro en tienda</span><span>${UI.escape(NEGOCIO.ciudad)}</span></div>
          </div>

          <div style="margin-top:16px">
            <span class="micro">Compatible con</span>
            <div class="compat-lista">${compat.join('')}</div>
          </div>
        </div>
      </div>`;

    UI.abrirModal('modal-producto');
  }

  /* ---------- Vehículo escaneado ---------- */
  function aplicarVehiculo(v) {
    estado.vehiculo = v;
    const chip = $('#chip-auto');
    $('#chip-texto').textContent = `${v.marca} ${v.linea} ${v.anio}`;
    chip.classList.add('visible');
    UI.toast(`Filtrando para ${v.marca} ${v.linea}`);
    pintar();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function quitarVehiculo() {
    estado.vehiculo = null;
    $('#chip-auto').classList.remove('visible');
    pintar();
  }

  /* ---------- Eventos ---------- */
  function eventos() {
    $('#form-buscar').addEventListener('submit', (e) => {
      e.preventDefault();
      estado.q = $('#q').value.trim();
      pintar();
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    let t;
    $('#q').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = e.target.value.trim(); pintar(); }, 180);
    });

    $('#btn-escanear').addEventListener('click', Escaner.abrir);
    $('#hero-escanear').addEventListener('click', Escaner.abrir);
    $('#chip-quitar').addEventListener('click', quitarVehiculo);

    $('#pills-tipo').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tipo]');
      if (!b) return;
      estado.tipo = b.dataset.tipo;
      pintarFiltros();
      pintar();
    });

    $('#pills-categoria').addEventListener('click', (e) => {
      const b = e.target.closest('[data-categoria]');
      if (!b) return;
      estado.categoria = b.dataset.categoria;
      pintarFiltros();
      pintar();
    });

    document.body.addEventListener('click', (e) => {
      const card = e.target.closest('.card[data-id]');
      if (card) abrirDetalle(card.dataset.id);

      const rail = e.target.closest('.rail-btn[data-accion="escanear"]');
      if (rail) { e.preventDefault(); Escaner.abrir(); }
    });

    /* Si se edita el inventario en otra pestaña, el catálogo se refresca */
    window.addEventListener('storage', () => { pintarDestacados(); pintar(); });
    window.addEventListener('focus', () => { pintarDestacados(); pintar(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
