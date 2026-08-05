/* ============================================================
   Escáner de vehículo
   MAQUETA: abre la cámara real y ejecuta la animación de
   escaneo, pero la identificación es simulada. Para producción
   se reemplaza `identificar()` por una llamada al servicio de
   visión (foto -> marca/línea/modelo).
   ============================================================ */

const Escaner = (() => {
  let stream = null;
  let temporizadores = [];
  let alConfirmar = null;

  const $ = (s) => document.querySelector(s);

  /* ---------- Plantilla del modal ---------- */
  function plantilla() {
    return `
    <div class="modal" id="modal-escaner">
      <div class="modal-caja" role="dialog" aria-label="Escanear vehículo">
        <div class="modal-cabeza">
          <div>
            <span class="micro">Identificador de vehículo</span>
            <h2 style="margin-top:4px">Escanea tu carro</h2>
          </div>
          <button class="icon-btn" data-cerrar-modal aria-label="Cerrar">${UI.icono('close', 18)}</button>
        </div>
        <div class="modal-cuerpo">

          <!-- 1. Inicio -->
          <div class="escaner-etapa activa" data-etapa="inicio">
            <div class="visor">
              <div class="visor-fallback">
                ${UI.icono('camera', 42)}
                Apunta la cámara al frente de tu carro,<br>a unos 2 metros de distancia.
              </div>
              <div class="marco"><i></i><i></i><i></i><i></i></div>
            </div>
            <div class="escaner-nota">
              Detectamos la marca, la línea y el modelo para mostrarte solo los
              repuestos que le sirven a tu carro.
            </div>
            <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
              <button class="btn btn--violeta" data-accion="camara" style="flex:1">
                ${UI.icono('camera', 18)} Activar cámara
              </button>
              <button class="btn btn--claro" data-accion="manual">Elegir manualmente</button>
            </div>
          </div>

          <!-- 2. Escaneando -->
          <div class="escaner-etapa" data-etapa="escaneando">
            <div class="visor">
              <video autoplay playsinline muted></video>
              <div class="visor-fallback" hidden>
                ${UI.icono('scan', 42)}
                Analizando imagen…
              </div>
              <div class="marco"><i></i><i></i><i></i><i></i></div>
              <div class="linea-scan"></div>
            </div>
            <div class="progreso">
              <div class="progreso-barra"><i></i></div>
              <div class="progreso-texto">Iniciando…</div>
            </div>
            <div style="margin-top:16px;text-align:center">
              <button class="btn btn--claro btn--sm" data-accion="cancelar">Cancelar</button>
            </div>
          </div>

          <!-- 3. Resultado -->
          <div class="escaner-etapa" data-etapa="resultado">
            <div class="resultado-auto">
              <div class="avatar">${UI.icono('scan', 34)}</div>
              <div>
                <span class="micro">Vehículo identificado</span>
                <h2 data-campo="titulo">—</h2>
                <p class="silencio" style="font-size:13px" data-campo="detalle">—</p>
                <div class="confianza">${UI.icono('check', 14)} Coincidencia <b data-campo="confianza">—</b></div>
              </div>
            </div>
            <div class="escaner-nota" data-campo="conteo">—</div>
            <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
              <button class="btn btn--violeta" data-accion="confirmar" style="flex:1">
                Ver repuestos compatibles ${UI.icono('arrow', 18)}
              </button>
              <button class="btn btn--claro" data-accion="manual">No es mi carro</button>
            </div>
          </div>

          <!-- 4. Manual -->
          <div class="escaner-etapa" data-etapa="manual">
            <div class="campo">
              <label>Marca</label>
              <select data-campo="marca">
                <option value="">Selecciona la marca</option>
                ${MARCAS_AUTO.map(m => `<option>${m}</option>`).join('')}
              </select>
            </div>
            <div class="campo">
              <label>Línea</label>
              <select data-campo="linea"><option value="">Primero elige la marca</option></select>
            </div>
            <div class="escaner-nota">
              En la versión final este listado sale del catálogo de vehículos del taller.
            </div>
            <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
              <button class="btn btn--violeta" data-accion="confirmar-manual" style="flex:1">Aplicar filtro</button>
              <button class="btn btn--claro" data-accion="reiniciar">Volver a escanear</button>
            </div>
          </div>

        </div>
      </div>
    </div>`;
  }

  /* ---------- Etapas ---------- */
  function etapa(nombre) {
    document.querySelectorAll('#modal-escaner .escaner-etapa').forEach(el => {
      el.classList.toggle('activa', el.dataset.etapa === nombre);
    });
  }

  function limpiar() {
    temporizadores.forEach(clearTimeout);
    temporizadores = [];
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  /* ---------- Cámara + escaneo simulado ---------- */
  async function iniciarCamara() {
    etapa('escaneando');
    const video = $('#modal-escaner video');
    const fallback = $('#modal-escaner [data-etapa="escaneando"] .visor-fallback');

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }, audio: false
      });
      video.srcObject = stream;
      video.hidden = false;
      fallback.hidden = true;
    } catch (e) {
      /* Sin permiso o sin cámara: el escaneo sigue en modo demo */
      video.hidden = true;
      fallback.hidden = false;
    }
    correrAnalisis();
  }

  function correrAnalisis() {
    const pasos = [
      { pct: 22, txt: 'Detectando carrocería…' },
      { pct: 48, txt: 'Comparando parrilla y faros…' },
      { pct: 74, txt: 'Identificando línea y modelo…' },
      { pct: 96, txt: 'Buscando repuestos compatibles…' },
    ];
    const barra = $('#modal-escaner .progreso-barra i');
    const texto = $('#modal-escaner .progreso-texto');

    pasos.forEach((p, i) => {
      temporizadores.push(setTimeout(() => {
        barra.style.width = p.pct + '%';
        texto.textContent = p.txt;
      }, 500 + i * 800));
    });

    temporizadores.push(setTimeout(() => {
      barra.style.width = '100%';
      mostrarResultado(identificar());
    }, 500 + pasos.length * 800));
  }

  /* Sustituir por el servicio real de reconocimiento */
  function identificar() {
    return VEHICULOS[Math.floor(Math.random() * VEHICULOS.length)];
  }

  function compatibles(vehiculo) {
    return DB.todos().filter(p =>
      p.compat.includes('universal') || p.compat.includes(vehiculo.id)
    ).length;
  }

  function mostrarResultado(v) {
    limpiar();
    etapa('resultado');
    const caja = $('#modal-escaner [data-etapa="resultado"]');
    caja.querySelector('[data-campo="titulo"]').textContent = `${v.marca} ${v.linea}`;
    caja.querySelector('[data-campo="detalle"]').textContent = `Modelo ${v.anio} · Motor ${v.motor} · ${v.color}`;
    caja.querySelector('[data-campo="confianza"]').textContent = (88 + Math.floor(Math.random() * 10)) + '%';
    caja.querySelector('[data-campo="conteo"]').textContent =
      `Tenemos ${compatibles(v)} productos que le sirven a este vehículo.`;
    caja.dataset.vehiculo = v.id;
  }

  /* ---------- Selección manual ---------- */
  function llenarLineas(marca) {
    const sel = $('#modal-escaner [data-campo="linea"]');
    const lineas = VEHICULOS.filter(v => v.marca === marca);
    if (!lineas.length) {
      sel.innerHTML = '<option value="">Sin líneas cargadas — se completa en la versión final</option>';
      return;
    }
    sel.innerHTML = '<option value="">Selecciona la línea</option>' +
      lineas.map(v => `<option value="${v.id}">${v.linea} ${v.anio}</option>`).join('');
  }

  /* ---------- Ciclo de vida ---------- */
  function montar(callback) {
    alConfirmar = callback;
    if (document.getElementById('modal-escaner')) return;
    document.body.insertAdjacentHTML('beforeend', plantilla());

    const modal = document.getElementById('modal-escaner');

    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-accion]');
      if (!btn) return;
      const accion = btn.dataset.accion;

      if (accion === 'camara') iniciarCamara();
      if (accion === 'manual') { limpiar(); etapa('manual'); }
      if (accion === 'reiniciar') { limpiar(); reset(); etapa('inicio'); }
      if (accion === 'cancelar') { limpiar(); reset(); etapa('inicio'); }

      if (accion === 'confirmar') {
        const id = modal.querySelector('[data-etapa="resultado"]').dataset.vehiculo;
        aplicar(VEHICULOS.find(v => v.id === id));
      }

      if (accion === 'confirmar-manual') {
        const id = modal.querySelector('[data-campo="linea"]').value;
        const marca = modal.querySelector('[data-campo="marca"]').value;
        if (!id) return UI.toast(marca ? 'Elige la línea del vehículo' : 'Elige la marca', 'error');
        aplicar(VEHICULOS.find(v => v.id === id));
      }
    });

    modal.querySelector('[data-campo="marca"]').addEventListener('change', (e) => {
      llenarLineas(e.target.value);
    });

    modal.addEventListener('transitionend', () => {}, false);
  }

  function reset() {
    const barra = $('#modal-escaner .progreso-barra i');
    if (barra) barra.style.width = '0';
  }

  function aplicar(vehiculo) {
    if (!vehiculo) return;
    limpiar();
    UI.cerrarModal('modal-escaner');
    reset(); etapa('inicio');
    if (alConfirmar) alConfirmar(vehiculo);
  }

  function abrir() {
    reset(); etapa('inicio');
    UI.abrirModal('modal-escaner');
  }

  /* Al cerrar el modal por fuera, apagar la cámara */
  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-escaner' || (e.target.closest && e.target.closest('#modal-escaner [data-cerrar-modal]'))) {
      limpiar(); reset(); etapa('inicio');
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { limpiar(); reset(); } });

  return { montar, abrir };
})();
