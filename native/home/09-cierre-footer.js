/**
 * Newsletter — bloque 09. Nativo, sin backend: valida y muestra confirmación.
 * Reemplazar el handler por POST al endpoint real de suscripción en el handoff a WordPress.
 */
// idioma desde el DOM (fuente única que setea i18n.apply())
const L = (en, es) => (document.documentElement.lang === 'es' ? es : en);

function initNewsletter(root = document) {
  const form = root.querySelector('[data-newsletter]');
  if (!form) return;
  const msg = form.parentElement.querySelector('[data-newsletter-msg]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO handoff: POST { email } al endpoint de suscripción
    msg.textContent = L("✓ You're on the list. Welcome to the build.", '✓ Ya estás en la lista. Bienvenido a la construcción.');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => initNewsletter());

export { initNewsletter };
