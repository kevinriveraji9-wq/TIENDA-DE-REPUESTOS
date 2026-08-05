/* ============================================================
   Capa de datos — se guarda en localStorage para que el
   inventario y el catálogo compartan la misma información.
   ============================================================ */

const DB = (() => {
  const KEY = 'ap_pitalito_inventario_v1';
  const KEY_MOV = 'ap_pitalito_movimientos_v1';

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

  function guardar(productos) {
    localStorage.setItem(KEY, JSON.stringify(productos));
    return productos;
  }

  function sembrar() {
    const copia = JSON.parse(JSON.stringify(PRODUCTOS_SEED));
    guardar(copia);
    localStorage.setItem(KEY_MOV, JSON.stringify([]));
    return copia;
  }

  function nuevoId() {
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

  /* ---------- CRUD ---------- */

  const api = {
    todos: () => leer(),

    porId: (id) => leer().find(p => p.id === id) || null,

    crear(datos) {
      const productos = leer();
      const producto = Object.assign({
        id: nuevoId(), nombre: '', marca: '', ref: '', tipo: 'Repuestos',
        categoria: 'motor', icon: 'filter', precio: 0, stock: 0, stockMin: 3,
        compat: ['universal'], destacado: false, descripcion: ''
      }, datos);
      productos.unshift(producto);
      guardar(productos);
      api.registrarMovimiento(producto.id, 'alta', producto.stock, 'Producto creado');
      return producto;
    },

    actualizar(id, datos) {
      const productos = leer();
      const i = productos.findIndex(p => p.id === id);
      if (i === -1) return null;
      const anterior = productos[i].stock;
      productos[i] = Object.assign({}, productos[i], datos, { id });
      guardar(productos);
      if (datos.stock !== undefined && datos.stock !== anterior) {
        api.registrarMovimiento(id, 'ajuste', datos.stock - anterior, 'Edición manual');
      }
      return productos[i];
    },

    eliminar(id) {
      const productos = leer().filter(p => p.id !== id);
      guardar(productos);
    },

    ajustarStock(id, delta, motivo) {
      const productos = leer();
      const p = productos.find(x => x.id === id);
      if (!p) return null;
      p.stock = Math.max(0, p.stock + delta);
      guardar(productos);
      api.registrarMovimiento(id, delta > 0 ? 'entrada' : 'salida', delta, motivo || 'Ajuste rápido');
      return p;
    },

    restablecer: () => sembrar(),

    /* ---------- Movimientos (kardex simple) ---------- */

    movimientos() {
      try { return JSON.parse(localStorage.getItem(KEY_MOV)) || []; }
      catch (e) { return []; }
    },

    registrarMovimiento(productoId, tipo, cantidad, nota) {
      const movs = api.movimientos();
      movs.unshift({
        id: nuevoId(), productoId, tipo, cantidad,
        nota: nota || '', fecha: new Date().toISOString()
      });
      localStorage.setItem(KEY_MOV, JSON.stringify(movs.slice(0, 200)));
    },

    /* ---------- Métricas ---------- */

    estado(p) {
      if (p.stock === 0) return 'agotado';
      if (p.stock <= p.stockMin) return 'bajo';
      return 'disponible';
    },

    resumen() {
      const productos = leer();
      return {
        referencias: productos.length,
        unidades: productos.reduce((s, p) => s + p.stock, 0),
        valor: productos.reduce((s, p) => s + p.stock * p.precio, 0),
        bajos: productos.filter(p => api.estado(p) === 'bajo').length,
        agotados: productos.filter(p => p.stock === 0).length,
      };
    },
  };

  return api;
})();
