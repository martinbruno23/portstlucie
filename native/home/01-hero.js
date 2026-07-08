/**
 * Hero — animación de la última palabra del titular (bilingüe EN/ES).
 * La palabra cicla por varios estados como un "proceso/carga" y aterriza en la palabra final
 * en aquamarine. Respeta prefers-reduced-motion. Se reinicia al cambiar de idioma.
 *
 * Anti-salto: el "sizer" CSS reserva el ancho de la palabra más larga (del idioma activo), así el
 * titular nunca reflowea al cambiar de palabra, en cualquier tamaño.
 */
// idioma desde el DOM (fuente única que setea i18n.apply()); evita instancias duplicadas del módulo
const getLang = () => (document.documentElement.lang === 'es' ? 'es' : 'en');

function initHeroMorph(root = document) {
  const el = root.querySelector('.hero__morph-word');
  if (!el) return;
  const sizer = root.querySelector('.hero__morph-sizer');

  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  const wordsFor = (lang) => {
    const raw = lang === 'es' ? (el.dataset.wordsEs || el.dataset.words) : el.dataset.words;
    return (raw || 'born').split(',').map((w) => `${w.trim()}.`);
  };

  const run = () => {
    clearTimers();
    const words = wordsFor(getLang());
    const finalWord = words[words.length - 1];
    const cycleWords = words.slice(0, -1);

    // el sizer reserva el ancho de la palabra más larga del idioma activo
    if (sizer) {
      sizer.textContent = words.reduce((a, b) => (b.length > a.length ? b : a), '');
    }

    el.classList.remove('is-cycling');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || cycleWords.length === 0) {
      el.textContent = finalWord;
      return;
    }

    const STEP = 400;
    const LOOPS = 2;
    const sequence = [];
    for (let i = 0; i < LOOPS; i++) sequence.push(...cycleWords);
    sequence.push(finalWord);

    let i = 0;
    const swap = () => {
      const word = sequence[i];
      const isFinal = i === sequence.length - 1;
      el.style.opacity = '0';
      timers.push(setTimeout(() => {
        el.textContent = word;
        el.classList.toggle('is-cycling', !isFinal);
        el.style.opacity = '1';
      }, 90));
      i += 1;
      if (!isFinal) timers.push(setTimeout(swap, STEP));
    };
    timers.push(setTimeout(swap, 800));
  };

  run();
  document.addEventListener('psl:langchange', run);
}

document.addEventListener('DOMContentLoaded', () => initHeroMorph());

export { initHeroMorph };
