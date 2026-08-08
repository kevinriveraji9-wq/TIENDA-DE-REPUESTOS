/* ============================================================
   Cursor: mira de escáner. Cuatro esquinas que encuadran el
   puntero, con el mismo motivo del visor del escáner.
   Sigue la posición exacta, sin interpolación.
   Solo en escritorio con puntero fino.
   ============================================================ */

(() => {
  const FINO = '(hover: hover) and (pointer: fine)';
  const ACCIONABLE = 'a, button, .card, .pill, .navlink, [data-accion], [role="button"], label.check';
  const TEXTO = 'input:not([type="checkbox"]), textarea';

  function init() {
    if (!window.matchMedia(FINO).matches) return;

    const raiz = document.documentElement;
    const mira = document.createElement('div');
    mira.className = 'cursor-mira';
    mira.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
    document.body.appendChild(mira);

    /* Solo ahora se oculta el puntero del sistema: si algo falló antes,
       el usuario se queda con el cursor normal en vez de sin ninguno. */
    raiz.classList.add('cursor-propio');
    /* Oculta hasta el primer movimiento: si no, aparece pegada en la
       esquina superior izquierda mientras el mouse sigue quieto. */
    raiz.classList.add('cursor-fuera');

    let x = 0, y = 0, pendiente = false;

    /* El movimiento solo marca la posición; escribir el transform se deja
       para el siguiente cuadro, así no se toca el estilo en cada evento. */
    function dibujar() {
      mira.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      pendiente = false;
    }

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      raiz.classList.remove('cursor-fuera');
      if (!pendiente) { pendiente = true; requestAnimationFrame(dibujar); }
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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
