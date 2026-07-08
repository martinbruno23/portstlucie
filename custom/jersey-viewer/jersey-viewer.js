/**
 * <psl-jersey-viewer></psl-jersey-viewer>
 *
 * 🟦 A medida — bloque 05 (La camiseta / Shop). Pieza A del benchmark Piezas Diferenciales.
 * Renderiza SOLO el stage rotatorio (la copy, precio y CTA viven en el bloque nativo que lo envuelve,
 * según el layout 2-col del diseño aprobado).
 *
 * ESTADO ACTUAL: capa de interacción completa (drag, inercia, auto-rotate, skeleton) funcional,
 * montada sobre un placeholder en vez de un modelo glTF real (el cliente aún no tiene el asset 3D).
 * Cuando exista el modelo (.glb, Draco, <3MB, texturas 1024/2048px), reemplazar la capa visual por
 * una escena Three.js; la física de drag/inercia/auto-rotate no depende del renderer y se reutiliza.
 *
 * Decisiones aplicadas (Pieza A):
 * - Fondo oscuro del stage (decisión #1 del ranking de 9).
 * - Inercia 400-600ms, easing exponential-out (decisión #4).
 * - Skeleton con shimmer, interacción habilitada desde el skeleton (decisión #7).
 * - Auto-rotate lento (3rpm) los primeros 5s, se detiene al primer toque.
 */
// idioma desde el DOM (fuente única que setea i18n.apply()); evita instancias duplicadas del módulo
const L = (en, es) => (document.documentElement.lang === 'es' ? es : en);

class PSLJerseyViewer extends HTMLElement {
  connectedCallback() {
    this._rotation = 0;
    this._velocity = 0;
    this._dragging = false;
    this._hasInteracted = false;
    this._render();
    this._startLoading();
    this._onLang = () => { this._hint.textContent = L('DRAG TO ROTATE', 'ARRASTRA PARA GIRAR'); };
    document.addEventListener('psl:langchange', this._onLang);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._autoRotateRaf);
    cancelAnimationFrame(this._inertiaRaf);
    document.removeEventListener('psl:langchange', this._onLang);
  }

  _render() {
    this.innerHTML = `
      <div class="jviewer" tabindex="0" role="img" aria-label="Founders edition jersey, drag to rotate">
        <div class="jviewer__skeleton"><div class="jviewer__skeleton-shape"></div></div>
        <div class="jviewer__visual" aria-hidden="true"></div>
        <span class="jviewer__tag jviewer__tag--asset">▦ KIT PHOTO · DROP HERE</span>
        <span class="jviewer__tag jviewer__tag--hint">${L('DRAG TO ROTATE', 'ARRASTRA PARA GIRAR')}</span>
      </div>
    `;
    this._stage = this.querySelector('.jviewer');
    this._visual = this.querySelector('.jviewer__visual');
    this._hint = this.querySelector('.jviewer__tag--hint');
    this._bindDrag();
  }

  _startLoading() {
    this._stage.classList.add('is-loading');
    // simula la carga del modelo — reemplazar por el evento real de carga del glTF
    setTimeout(() => {
      this._stage.classList.remove('is-loading');
      this._stage.classList.add('is-loaded');
      this._startAutoRotate();
    }, 900);
  }

  _startAutoRotate() {
    this._hasInteracted = false;
    cancelAnimationFrame(this._autoRotateRaf);
    const start = performance.now();
    const degPerMs = (3 * 360) / 60000; // 3rpm
    const tick = (now) => {
      if (this._hasInteracted || this._dragging) return;
      if (now - start > 5000) return; // se detiene a los 5s o al primer toque
      this._rotation += degPerMs * 16.6;
      this._applyRotation();
      this._autoRotateRaf = requestAnimationFrame(tick);
    };
    this._autoRotateRaf = requestAnimationFrame(tick);
  }

  _bindDrag() {
    let lastX = 0;
    let lastT = 0;
    const onDown = (e) => {
      this._dragging = true;
      this._hasInteracted = true;
      this._hint.classList.add('is-hidden');
      cancelAnimationFrame(this._inertiaRaf);
      lastX = e.clientX;
      lastT = performance.now();
      this._stage.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!this._dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(now - lastT, 1);
      this._velocity = (dx / dt) * 16.6;
      this._rotation += dx * 0.6;
      this._applyRotation();
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!this._dragging) return;
      this._dragging = false;
      this._applyInertia();
    };
    this._stage.addEventListener('pointerdown', onDown);
    this._stage.addEventListener('pointermove', onMove);
    this._stage.addEventListener('pointerup', onUp);
    this._stage.addEventListener('pointercancel', onUp);
  }

  // Inercia 400-600ms, easing exponential-out — nunca corte instantáneo (decisión #4).
  _applyInertia() {
    const duration = 400 + Math.random() * 200;
    const start = performance.now();
    const startVelocity = this._velocity;
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const remaining = 1 - easeOutExpo(t);
      this._rotation += startVelocity * 0.6 * remaining * 0.15;
      this._applyRotation();
      if (t < 1) this._inertiaRaf = requestAnimationFrame(tick);
    };
    this._inertiaRaf = requestAnimationFrame(tick);
  }

  _applyRotation() {
    // Aproximación CSS 3D sobre placeholder — reemplazar por rotación de cámara/objeto Three.js.
    this._visual.style.transform = `rotateY(${this._rotation % 360}deg)`;
  }
}

customElements.define('psl-jersey-viewer', PSLJerseyViewer);

export { PSLJerseyViewer };
