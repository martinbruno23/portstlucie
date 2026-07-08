/**
 * Partners — form de contacto (P05). Nativo, sin backend: valida y muestra confirmación.
 * Reemplazar el handler por POST /api/partner-contact { name, company, email, message } en el handoff.
 */
// idioma desde el DOM (fuente única que setea i18n.apply())
const L = (en, es) => (document.documentElement.lang === 'es' ? es : en);

function initPartnerContact(root = document) {
  const form = root.querySelector('[data-partner-contact]');
  if (!form) return;
  const msg = form.querySelector('[data-partner-msg]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO handoff: POST { name, company, email, message } a /api/partner-contact
    msg.textContent = L('✓ Got it. A real person will get back to you soon.', '✓ Recibido. Una persona real te va a responder pronto.');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => initPartnerContact());

export { initPartnerContact };
