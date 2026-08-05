/* ============================================================
   Panel de inventario (admin.html)
   ============================================================ */

(() => {
  const estado = { q: '', filtro: 'todos' };
  let idPendienteBorrar = null;

  const $ = (s) => document.querySelector(s);

  const FILTROS = [
    { id: 'todos',     nombre: 'Todos' },
    { id: 'Repuestos', nombre: 'Repuestos' },
    { id: 'Lujos',     nombre: 'Lujos' },
    { id: 'bajo',      nombre: 'Bajo stock' },
    { id: 'agotado',   nombre: 'Agotados' },
    { id: 'destacado', nombre: 'Destacados' },
  ];

  const ICONOS_DISPONIBLES = [
    ['disc', 'Freno / disco'], ['filter', 'Filtro'], ['shock', 'Amortiguador'],
    ['battery', 'Batería'], ['sparkplug', 'Bujía'], ['belt', 'Correa'],
    ['radiator', 'Radiador'], ['alternator', 'Alternador'], ['headlight', 'Farola'],
    ['rim', 'Rin / llanta'], ['seat', 'Silla / forro'], ['mat', 'Tapete'],
    ['ledstrip', 'Barra LED'], ['foglight', 'Exploradora'], ['spoiler', 'Spoiler'],
    ['camera', 'Cámara'], ['speaker', 'Parlante'], ['screen', 'Pantalla'],
    ['tint', 'Polarizado'], ['freshener', 'Aromatizante'], ['wheelcover', 'Cubrevolante'],
  ];

  /* ---------- Montaje ---------- */
  function init() {
    $('#rail').innerHTML = UI.rail('inventario');

    $('#f-categoria').innerHTML = CATEGORIAS.filter(c => c.id !== 'todos')
      .map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    $('#f-icon').innerHTML = ICONOS_DISPONIBLES
      .map(([k, n]) => `<option value="${k}">${n}</option>`).join('');

    $('#filtros').innerHTML = FILTROS.map(f => `
      <button class="pill ${estado.filtro === f.id ? 'is-active' : ''}" data-filtro="${f.id}">${f.nombre}</button>
    `).join('');

    Escaner.montar(() => { window.location.href = 'index.html'; });
    eventos();
    render();
  }

  /* ---------- Render ---------- */
  function render() {
    pintarKpis();
    pintarTabla();
    pintarMovimientos();
    $('#filtros').querySelectorAll('[data-filtro]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.filtro === estado.filtro);
    });
  }

  function pintarKpis() {
    const r = DB.resumen();
    $('#kpis').innerHTML = `
      <div class="kpi">
        <span class="micro">Referencias</span>
        <div class="kpi-valor">${r.referencias}</div>
        <div class="kpi-nota">${r.unidades} unidades en bodega</div>
      </div>
      <div class="kpi">
        <span class="micro">Valor del inventario</span>
        <div class="kpi-valor">${UI.pesos(r.valor)}</div>
        <div class="kpi-nota">A precio de venta</div>
      </div>
      <div class="kpi ${r.bajos ? 'kpi--alerta' : ''}">
        <span class="micro">Bajo stock</span>
        <div class="kpi-valor">${r.bajos}</div>
        <div class="kpi-nota">Llegaron al mínimo definido</div>
      </div>
      <div class="kpi ${r.agotados ? 'kpi--error' : ''}">
        <span class="micro">Agotados</span>
        <div class="kpi-valor">${r.agotados}</div>
        <div class="kpi-nota">Hay que pedir a proveedor</div>
      </div>`;
  }

  function filtrar() {
    const q = UI.normalizar(estado.q);
    return DB.todos().filter(p => {
      const est = DB.estado(p);
      if (estado.filtro === 'Repuestos' && p.tipo !== 'Repuestos') return false;
      if (estado.filtro === 'Lujos' && p.tipo !== 'Lujos') return false;
      if (estado.filtro === 'bajo' && est !== 'bajo') return false;
      if (estado.filtro === 'agotado' && est !== 'agotado') return false;
      if (estado.filtro === 'destacado' && !p.destacado) return false;
      if (q) {
        const heno = UI.normalizar([p.nombre, p.marca, p.ref].join(' '));
        if (!heno.includes(q)) return false;
      }
      return true;
    });
  }

  function pintarTabla() {
    const lista = filtrar();
    $('#conteo').textContent = `${lista.length} ${lista.length === 1 ? 'referencia' : 'referencias'}`;

    if (!lista.length) {
      $('#tbody').innerHTML = `<tr><td colspan="7">
        <div class="vacio" style="background:none;padding:48px 0">
          <h3>Sin resultados</h3><p>Ajusta la búsqueda o el filtro.</p>
        </div></td></tr>`;
      return;
    }

    $('#tbody').innerHTML = lista.map(p => {
      const est = DB.estado(p);
      const badge = est === 'disponible'
        ? '<span class="badge badge--ok">Disponible</span>'
        : est === 'bajo'
          ? '<span class="badge badge--bajo">Bajo stock</span>'
          : '<span class="badge badge--agotado">Agotado</span>';

      return `
      <tr data-id="${p.id}">
        <td>
          <div class="td-prod">
            <span class="mini">${UI.arteProducto(p.icon)}</span>
            <span>
              <b>${UI.escape(p.nombre)}</b>
              <small>${UI.escape(p.marca)}${p.destacado ? ' · Destacado' : ''}</small>
            </span>
          </div>
        </td>
        <td class="silencio">${UI.escape(p.ref)}</td>
        <td>${UI.escape(p.tipo)}</td>
        <td>${UI.pesos(p.precio)}</td>
        <td>
          <span class="stepper">
            <button data-ajuste="-1" aria-label="Restar una unidad">${UI.icono('minus', 14)}</button>
            <b>${p.stock}</b>
            <button data-ajuste="1" aria-label="Sumar una unidad">${UI.icono('plus', 14)}</button>
          </span>
          <div class="silencio" style="font-size:11px;margin-top:2px">mín. ${p.stockMin}</div>
        </td>
        <td>${badge}</td>
        <td>
          <div class="td-acciones">
            <button class="icon-btn" data-editar aria-label="Editar">${UI.icono('edit', 16)}</button>
            <button class="icon-btn icon-btn--peligro" data-borrar aria-label="Eliminar">${UI.icono('trash', 16)}</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function pintarMovimientos() {
    const movs = DB.movimientos().slice(0, 12);
    if (!movs.length) {
      $('#movimientos').innerHTML = '<p class="silencio" style="padding:20px 0;font-size:14px">Todavía no hay movimientos registrados.</p>';
      return;
    }
    $('#movimientos').innerHTML = movs.map(m => {
      const p = DB.porId(m.productoId);
      const signo = m.cantidad > 0 ? '+' : '';
      return `
        <div class="mov-item">
          <span class="mov-delta ${m.cantidad > 0 ? 'pos' : 'neg'}">${signo}${m.cantidad}</span>
          <span><b style="font-weight:500">${UI.escape(p ? p.nombre : 'Producto eliminado')}</b>
            <span class="silencio"> · ${UI.escape(m.nota)}</span></span>
          <span class="silencio">${UI.fecha(m.fecha)}</span>
        </div>`;
    }).join('');
  }

  /* ---------- Formulario ---------- */
  function abrirFormulario(id) {
    const form = $('#form-producto');
    form.reset();
    if (id) {
      const p = DB.porId(id);
      if (!p) return;
      $('#form-titulo').textContent = 'Editar producto';
      form.id.value = p.id;
      form.nombre.value = p.nombre;
      form.marca.value = p.marca;
      form.ref.value = p.ref;
      form.tipo.value = p.tipo;
      form.categoria.value = p.categoria;
      form.precio.value = p.precio;
      form.stock.value = p.stock;
      form.stockMin.value = p.stockMin;
      form.icon.value = p.icon;
      form.descripcion.value = p.descripcion;
      form.destacado.checked = !!p.destacado;
    } else {
      $('#form-titulo').textContent = 'Nuevo producto';
      form.id.value = '';
      form.stockMin.value = 3;
    }
    UI.abrirModal('modal-form');
    setTimeout(() => $('#f-nombre').focus(), 60);
  }

  function guardar(e) {
    e.preventDefault();
    const form = e.target;
    const datos = {
      nombre: form.nombre.value.trim(),
      marca: form.marca.value.trim(),
      ref: form.ref.value.trim().toUpperCase(),
      tipo: form.tipo.value,
      categoria: form.categoria.value,
      precio: Number(form.precio.value) || 0,
      stock: Number(form.stock.value) || 0,
      stockMin: Number(form.stockMin.value) || 0,
      icon: form.icon.value,
      descripcion: form.descripcion.value.trim(),
      destacado: form.destacado.checked,
    };

    if (form.id.value) {
      DB.actualizar(form.id.value, datos);
      UI.toast('Producto actualizado');
    } else {
      DB.crear(datos);
      UI.toast('Producto agregado al inventario');
    }

    UI.cerrarModal('modal-form');
    render();
  }

  /* ---------- Eventos ---------- */
  function eventos() {
    let t;
    $('#q').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = e.target.value.trim(); pintarTabla(); }, 160);
    });

    $('#filtros').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filtro]');
      if (!b) return;
      estado.filtro = b.dataset.filtro;
      render();
    });

    $('#btn-nuevo').addEventListener('click', () => abrirFormulario(null));
    $('#form-producto').addEventListener('submit', guardar);

    $('#tbody').addEventListener('click', (e) => {
      const fila = e.target.closest('tr[data-id]');
      if (!fila) return;
      const id = fila.dataset.id;

      const ajuste = e.target.closest('[data-ajuste]');
      if (ajuste) {
        const delta = Number(ajuste.dataset.ajuste);
        const p = DB.porId(id);
        if (delta < 0 && p.stock === 0) return UI.toast('Ya está en cero', 'error');
        DB.ajustarStock(id, delta, delta > 0 ? 'Entrada rápida' : 'Salida rápida');
        render();
        return;
      }

      if (e.target.closest('[data-editar]')) return abrirFormulario(id);

      if (e.target.closest('[data-borrar]')) {
        const p = DB.porId(id);
        idPendienteBorrar = id;
        $('#borrar-nombre').textContent = `${p.nombre} · ${p.ref}`;
        UI.abrirModal('modal-borrar');
      }
    });

    $('#btn-borrar-ok').addEventListener('click', () => {
      if (idPendienteBorrar) {
        DB.eliminar(idPendienteBorrar);
        idPendienteBorrar = null;
        UI.toast('Producto eliminado');
      }
      UI.cerrarModal('modal-borrar');
      render();
    });

    $('#btn-restablecer').addEventListener('click', () => {
      DB.restablecer();
      UI.toast('Inventario restablecido a los datos de demo');
      render();
    });

    document.body.addEventListener('click', (e) => {
      const rail = e.target.closest('.rail-btn[data-accion="escanear"]');
      if (rail) { e.preventDefault(); Escaner.abrir(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
