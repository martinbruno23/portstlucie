/**
 * Proof — línea de tiempo animada.
 * Auto-avanza el highlight por los hitos 2024 → 2027 en loop. Al hacer hover sobre un paso,
 * pausa el auto y resalta ese paso; al salir, retoma. Respeta prefers-reduced-motion.
 */
function initProofTimeline(root = document) {
  const timeline = root.querySelector('.proof__timeline');
  if (!timeline) return;
  const steps = [...timeline.querySelectorAll('.proof__step')];
  if (steps.length === 0) return;

  const setActive = (idx) => steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    setActive(steps.length - 1); // muestra el estado final (2027) sin animar
    return;
  }

  let idx = 0;
  let timer = null;
  const advance = () => {
    setActive(idx);
    idx = (idx + 1) % steps.length;
    timer = setTimeout(advance, 1600);
  };
  advance();

  // hover: pausar auto y resaltar el paso apuntado
  steps.forEach((step, i) => {
    step.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      setActive(i);
    });
  });
  timeline.addEventListener('mouseleave', () => {
    idx = 0;
    advance();
  });
}

document.addEventListener('DOMContentLoaded', () => initProofTimeline());

export { initProofTimeline };
