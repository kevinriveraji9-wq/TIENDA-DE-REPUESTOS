/* ============================================================
   Cursor propio: punto que sigue exacto y anillo que persigue
   con retraso. Solo en escritorio con puntero fino.
   ============================================================ */

(() => {
  const FINO = '(hover: hover) and (pointer: fine)';
  const MENOS_MOVIMIENTO = '(prefers-reduced-motion: reduce)';
  const ACCIONABLE = 'a, button, .card, .pill, .navlink, [data-accion], [role="button"], label.check';
  const TEXTO = 'input:not([type="checkbox"]), textarea';

  function init() {
    if (!window.matchMedia(FINO).matches) return;

    const raiz = document.documentElement;
    const punto = document.createElement('div');
    const anillo = document.createElement('div');
    punto.className = 'cursor-punto';
    anillo.className = 'cursor-anillo';
    document.body.append(punto, anillo);

    /* Solo ahora se oculta el puntero del sistema: si algo falló antes,
       el usuario se queda con el cursor normal en vez de sin ninguno. */
    raiz.classList.add('cursor-propio');

    /* Sin suavizado si el sistema pide menos movimiento */
    const suave = window.matchMedia(MENOS_MOVIMIENTO).matches ? 1 : .18;

    let x = 0, y = 0;      // posición real del mouse
    let ax = 0, ay = 0;    // posición interpolada del anillo
    let iniciado = false;

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!iniciado) { ax = x; ay = y; iniciado = true; }
      raiz.classList.remove('cursor-fuera');
    });

    document.addEventListener('mouseleave', () => raiz.classList.add('cursor-fuera'));
    document.addEventListener('mouseenter', () => raiz.classList.remove('cursor-fuera'));

    /* Un solo listener para toda la página: los elementos se repintan y los
       listeners individuales se perderían (ver component-guidelines). */
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      if (!t.closest) return;
      raiz.classList.toggle('cursor-texto', !!t.closest(TEXTO));
      raiz.classList.toggle('cursor-activo', !!t.closest(ACCIONABLE));
    });

    /* El seguimiento va en rAF, no escribiendo estilos en cada mousemove */
    function bucle() {
      ax += (x - ax) * suave;
      ay += (y - ay) * suave;
      punto.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      anillo.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(bucle);
    }
    requestAnimationFrame(bucle);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
