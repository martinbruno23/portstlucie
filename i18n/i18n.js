/**
 * i18n — bilingüe EN/ES con switch en la nav. Vanilla, portable a WordPress.
 *
 * Modelo: el INGLÉS es el contenido natural del HTML; el ESPAÑOL va co-localizado en un atributo
 * `data-es` sobre el mismo elemento. `apply()` intercambia el innerHTML según el idioma activo.
 * El idioma se persiste en localStorage y se refleja en <html lang>.
 *
 * Handoff WordPress: cada `data-es` es la traducción del texto del elemento — mapear a WPML/Polylang
 * o a cadenas i18n del theme. El toggle (data-lang-btn) llama setLang().
 *
 * Uso en la página (después de inyectar los bloques):
 *   import { initI18n } from '../i18n/i18n.js';
 *   initI18n();            // aplica el idioma guardado y activa el toggle
 * Componentes (labels dinámicos): importan getLang() y escuchan el evento 'psl:langchange'.
 */
const STORE_KEY = 'psl-lang';
let lang = 'en';

export function getLang() {
  return lang;
}

/** Helper para componentes: devuelve el string del idioma activo. */
export function L(en, es) {
  return lang === 'es' ? es : en;
}

export function initI18n(defaultLang = 'en') {
  try {
    lang = localStorage.getItem(STORE_KEY) || defaultLang;
  } catch {
    lang = defaultLang;
  }
  apply();
  // aviso inicial: sincroniza componentes que ya se renderizaron antes de initI18n
  document.dispatchEvent(new CustomEvent('psl:langchange', { detail: { lang } }));
  // delegación: funciona aunque la nav se inyecte async
  if (!window.__pslLangBound) {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang-btn]');
      if (!btn) return;
      e.preventDefault();
      setLang(btn.getAttribute('data-lang-btn'));
    });
    window.__pslLangBound = true;
  }
}

export function setLang(next) {
  if (next !== 'en' && next !== 'es') return;
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORE_KEY, next);
  } catch {
    /* modo privado: seguimos sin persistir */
  }
  apply();
  document.dispatchEvent(new CustomEvent('psl:langchange', { detail: { lang } }));
}

/** Aplica el idioma a todo `root` (default: document). Reejecutable sin efectos colaterales. */
export function apply(root = document) {
  document.documentElement.lang = lang;

  root.querySelectorAll('[data-es]').forEach((el) => {
    // guarda el original inglés una sola vez
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML.trim());
    el.innerHTML = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
  });

  // placeholders de inputs (atributo, no innerHTML)
  root.querySelectorAll('[data-es-placeholder]').forEach((el) => {
    if (!el.hasAttribute('data-en-placeholder')) {
      el.setAttribute('data-en-placeholder', el.getAttribute('placeholder') || '');
    }
    el.setAttribute('placeholder', lang === 'es'
      ? el.getAttribute('data-es-placeholder')
      : el.getAttribute('data-en-placeholder'));
  });

  // estado visual del toggle
  document.querySelectorAll('[data-lang-btn]').forEach((b) => {
    const active = b.getAttribute('data-lang-btn') === lang;
    b.setAttribute('aria-pressed', String(active));
    b.classList.toggle('is-active', active);
  });
}
