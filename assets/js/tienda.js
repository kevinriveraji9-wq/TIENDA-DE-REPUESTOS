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
    $('#topbar').innerHTML = UI.barra('inicio');
    $('#bloque-arte').innerHTML = UI.arteProducto('rim', 'art');

    $('#dir-linea').textContent = `${NEGOCIO.direccion} · ${NEGOCIO.ciudad}`;
    $('#horario-linea').textContent = `${NEGOCIO.horario} · ${NEGOCIO.telefono}`;
    $('#pie-negocio').textContent = `${NEGOCIO.nombre} — ${NEGOCIO.eslogan}`;

    const saludo = 'Hola, los contacto desde la página web.';
    $('#btn-wa-general').href = enlaceWhatsApp(saludo);
    $('#btn-wa-mapa').href = enlaceWhatsApp(saludo);
    $('#btn-wa-taller').href = enlaceWhatsApp('Hola, quiero agendar una instalación.');

    pintarNota();
    pintarCinta();
    pintarFiltros();
    pintarVitrina();
    pintar();

    Escaner.montar(aplicarVehiculo);
    eventos();
  }

  function enlaceWhatsApp(texto) {
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  function pintarNota() {
    const r = DB.resumen();
    $('#hero-nota').textContent =
      `${r.referencias} referencias disponibles · ${r.unidades} unidades en bodega`;
  }

  /* La lista va duplicada: la animación corre media pista y reinicia sin salto */
  function pintarCinta() {
    const marcas = LOGOS_MARCAS.map(m => `
      <span class="cinta-item" title="${UI.escape(m.nombre)}">
        <svg class="cinta-logo" viewBox="0 0 24 24" fill="currentColor" role="img"
             aria-label="${UI.escape(m.nombre)}">
          ${m.paths.map(d => `<path d="${d}"/>`).join('')}
        </svg>
      </span>`).join('');
    $('#cinta-pista').innerHTML = marcas + marcas;
  }

  /* ---------- Filtros ---------- */

  /* Productos que pasan los filtros estructurales: tipo y vehículo. Es la
     base para contar. Deliberadamente ignora el buscador, para que las
     píldoras no bailen mientras se escribe. */
  function base(sinTipo) {
    return DB.todos().filter(p => {
      if (!sinTipo && estado.tipo !== 'todos' && p.tipo !== estado.tipo) return false;
      if (estado.vehiculo && !p.compat.includes('universal')
          && !p.compat.includes(estado.vehiculo.id)) return false;
      return true;
    });
  }

  function pintarFiltros() {
    /* --- Tipo, con su conteo --- */
    const universo = base(true);
    const tipos = [
      { id: 'todos', nombre: 'Todo', icon: 'grid', n: universo.length },
      { id: 'Repuestos', nombre: 'Repuestos', icon: 'box', n: universo.filter(p => p.tipo === 'Repuestos').length },
      { id: 'Lujos', nombre: 'Lujos', icon: 'tag', n: universo.filter(p => p.tipo === 'Lujos').length },
    ];
    $('#pills-tipo').innerHTML = tipos.map(t => `
      <button class="pill ${estado.tipo === t.id ? 'is-active' : ''}" data-tipo="${t.id}">
        ${UI.icono(t.icon, 16)} ${t.nombre} <span class="pill-n">${t.n}</span>
      </button>`).join('');

    /* --- Categorías: solo las que tienen algo bajo el tipo elegido --- */
    const disponibles = base(false);
    const cuenta = {};
    disponibles.forEach(p => { cuenta[p.categoria] = (cuenta[p.categoria] || 0) + 1; });

    /* Si la categoría activa se quedó sin productos al cambiar de tipo,
       se vuelve a "Todas" en vez de dejar la grilla vacía. */
    if (estado.categoria !== 'todos' && !cuenta[estado.categoria]) estado.categoria = 'todos';

    $('#pills-categoria').innerHTML = CATEGORIAS
      .filter(c => c.id === 'todos' || cuenta[c.id])
      .map(c => {
        const n = c.id === 'todos' ? disponibles.length : cuenta[c.id];
        return `
          <button class="pill ${estado.categoria === c.id ? 'is-active' : ''}" data-categoria="${c.id}">
            ${UI.arteProducto(c.icon, 'art')} ${c.nombre} <span class="pill-n">${n}</span>
          </button>`;
      }).join('');

    document.querySelectorAll('[data-tipo-nav]').forEach(a => {
      a.classList.toggle('is-active', a.dataset.tipoNav === estado.tipo);
    });
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

  /* Destacados sobre el escenario oscuro */
  function pintarVitrina() {
    const destacados = DB.todos().filter(p => p.destacado).slice(0, 4);
    $('#vitrina').innerHTML = destacados.map(p => `
      <button class="vitrina-item card" data-id="${p.id}">
        <span class="vitrina-img">${UI.arteProducto(p.icon)}</span>
        <span class="card-cuerpo" style="padding:0">
          <span class="card-marca">${UI.escape(p.marca)}</span>
          <span class="card-nombre">${UI.escape(p.nombre)}</span>
          <span class="card-pie">
            <span class="card-precio">${UI.pesos(p.precio)}</span>
            <span class="badge badge--rojo">Destacado</span>
          </span>
        </span>
      </button>`).join('');
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
        : estado.tipo !== 'todos' ? estado.tipo : 'Todos los productos';
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
    $('#chip-texto').textContent = `${v.marca} ${v.linea} ${v.anio}`;
    $('#chip-auto').classList.add('visible');
    UI.toast(`Filtrando para ${v.marca} ${v.linea}`);
    pintarFiltros();   // los conteos y las categorías dependen del vehículo
    pintar();
    irAlCatalogo();
  }

  function quitarVehiculo() {
    estado.vehiculo = null;
    $('#chip-auto').classList.remove('visible');
    pintarFiltros();
    pintar();
  }

  function irAlCatalogo() {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Buscadores (hero + catálogo, sincronizados) ---------- */
  function buscar(valor, saltar) {
    estado.q = valor.trim();
    $('#q').value = estado.q;
    $('#q2').value = estado.q;
    pintar();
    if (saltar) irAlCatalogo();
  }

  /* ---------- Eventos ---------- */
  function eventos() {
    [['#form-buscar', '#q'], ['#form-buscar-2', '#q2']].forEach(([form, input]) => {
      $(form).addEventListener('submit', (e) => {
        e.preventDefault();
        buscar($(input).value, true);
      });
      let t;
      $(input).addEventListener('input', (e) => {
        clearTimeout(t);
        const v = e.target.value;
        t = setTimeout(() => buscar(v, false), 180);
      });
    });

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
      /* Cualquier botón de escanear, esté donde esté */
      const escanear = e.target.closest('[data-accion="escanear"]');
      if (escanear && !e.target.closest('#modal-escaner')) {
        e.preventDefault();
        return Escaner.abrir();
      }

      /* Links "Repuestos" / "Lujos" de la barra superior */
      const nav = e.target.closest('[data-tipo-nav]');
      if (nav) {
        e.preventDefault();
        estado.tipo = nav.dataset.tipoNav;
        estado.categoria = 'todos';
        pintarFiltros();
        pintar();
        return irAlCatalogo();
      }

      const card = e.target.closest('.card[data-id]');
      if (card) abrirDetalle(card.dataset.id);
    });

    /* Si se edita el inventario en otra pestaña, el catálogo se refresca */
    const refrescar = () => { pintarNota(); pintarVitrina(); pintarFiltros(); pintar(); };
    window.addEventListener('storage', refrescar);
    window.addEventListener('focus', refrescar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
