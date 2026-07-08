# PSL SC — Handoff notes

Diseño, sistema de diseño y bloques de código para la web de Port St. Lucie SC.
Destino final: **WordPress** (Gutenberg/ACF). Este repo llega hasta el handoff al developer — no
integra WordPress. Última actualización: 2026-07-06.

---

## 1. Cómo está organizado

```
src/
  tokens/        tokens.css (variables) · fonts.css (@font-face) · tokens.md (origen de cada valor)
  native/        bloques 🟩 nativos, HTML+CSS(+JS) por bloque. 1 bloque ≈ 1 bloque WordPress.
    _patterns/   patrones compartidos entre páginas (cards.css → .pcard)
    home/        00-nav … 09-cierre-footer  (HOME COMPLETA)
    sumate/      s01-hero … s06-cta          (COMPLETA)
    partners/    p01-hero … p05-contact      (COMPLETA)
  custom/        piezas 🟦 a medida, como Web Components autocontenidos (se insertan como un tag).
    live-counter/    <psl-live-counter>   — contadores en vivo
    jersey-viewer/   <psl-jersey-viewer>  — viewer 3D de la camiseta
    founder-wall/    <psl-founder-wall>   — muro de fundadores en vivo
                     <psl-founder-card>   — carnet 9:16 (Pieza B) [pendiente de restyle, ver §5]
  assets/        brand/ (logos oficiales) · fonts/ (tipografías) · placeholders
  pages/         home.html (ensambla los bloques para preview; en WP cada bloque va por separado)
  docs/          esta doc
  external/      🟧 lo que vive afuera (tienda) — solo contrato de link, no se construye acá
```

**Preview local:** `python3 -m http.server 8788` desde la raíz → `localhost:8788/src/pages/home.html`.
Los CSS/JS llevan `?v=N` (cache-busting): al editar, subir N en `pages/*.html`.

---

## 2. Sistema de diseño (resumen; detalle en tokens.md)

**Color (brandbook oficial):** aquamarine `#AAF6E6` principal · negro `#0C0C0A` · blanco · red marine
`#FF0033` acento. Secciones alternan `surface-ink` (oscura) y `surface-paper` (clara).
El naranja está **prohibido** por el manual de marca.

**Tipografía (fuentes de marca, self-hosted):**
- `--font-hero` **Ferryman** — título de la home / heros
- `--font-display` **Druk** (peso 800 + `--ls-display: .02em`) — títulos de sección, números
- `--font-label` **Druk Text Wide** — kickers/labels/nav (`--font-mono` es alias de éste)
- `--font-body` **Proxima Nova** — body, UI, botones, inputs (legible)
- `--font-detail` **Cabazon** — detalle decorativo (uso puntual)

**Primitivas compartidas (tokens.css):** `.psl-container` · `.surface-ink/paper/aqua` · `.psl-kicker`
(kicker numerado) · `.psl-h2` · `.psl-btn` + `.cta-primary/.cta-secondary` · `.tnum` (tabular-nums).

**Logos (src/assets/brand/, extraídos del .ai oficial):** `crest-aqua/black.png` (institucional,
nav+footer) · `anchor-aqua/white/black.png` (ancla without-shape, detalles) ·
`anchor-shape-aqua.png` (with-shape) · `wordmark-sc-aqua.png`. Mascota: `assets/luca.png`.

---

## 3. Piezas a medida — contratos de datos (a implementar en WordPress)

Todas corren hoy con **datos demo + simulación**. Reemplazar por el endpoint real.

- **`<psl-live-counter variant="stats|fan|reservation|sponsor">`** — `GET /api/live-counter?scope=…`
  Schema en `custom/live-counter/live-counter.config.js`. Métricas enteras hacen count-up 0→valor
  al entrar en viewport; updates en vivo silenciosos (sin flash).
- **`<psl-founder-wall>`** — mismo scope de founders. Lista pública: nombre + #número + ciudad
  (sin email). Nuevos ingresos entran con rise + highlight.
- **`<psl-founder-card>`** — carnet 9:16. El benchmark pide generación **server-side** (OG image
  endpoint) para consistencia al compartir; hoy es client-side. Ver §5.
- **`<psl-jersey-viewer>`** — placeholder visual; reemplazar por escena Three.js con el modelo glTF
  real (.glb, Draco, <3MB). La física de drag/inercia/auto-rotate no depende del renderer.
- **`<psl-fixtures>`** (Home, bloque Matchday) — strip de partidos del equipo reserva con flechas
  ‹ › (+ swipe), próximo destacado, resultados W/L/D y tarjeta de debut 2027.
  Contrato: `GET /api/fixtures?team=reserve` → `[{ id, competition, kickoff: ISO, venue,
  home:{name,abbr,crest}, away:{...}, status:"final|scheduled|live", score:[h,a]|null }]`.
  Hoy datos demo con `status` explícito (no depende del reloj del navegador); escudos de rivales =
  placeholder con iniciales. Detalle en `custom/fixtures/fixtures.js`.
- **Newsletter** (`native/home/09-…js`) — reemplazar handler por POST al endpoint de suscripción.
- **Alta de fundador (Sumate S03)** — el CTA de cada plan dispara:
  `POST /api/founder-signup { plan, name, email, city, depositAmount }` → `201 { founderNumber, tier }`.
  `free` no cobra; `founder`/`premium` pasan por checkout de seña **reembolsable hasta 2027**. Al
  completar, mostrar `<psl-founder-card>` con el `founderNumber` devuelto. (Detalle en s03-plans.html.)

---

## 4. HOME — bloques (COMPLETA)

| # | Bloque | Superficie | Pieza |
|---|---|---|---|
| 00 | Nav (crest oficial, sticky) | ink | 🟩 |
| 01 | Hero + barra gradiente + morph "born" | ink | 🟩 (JS: morph de la última palabra) |
| 02 | Stats band (count-up) | ink | 🟦 live-counter (stats) |
| 03 | The full project (4 cards, 1 oscura) | paper | 🟩 `.pcard` |
| 04 | Proof / construction schedule + timeline | ink | 🟩 (JS: timeline animada) |
| 04b | Matchday — fixtures del equipo reserva (strip navegable) | paper | 🟦 fixtures |
| 05 | Jersey / Shop | ink | 🟦 jersey-viewer |
| 06 | Founders (Luca + lista en vivo) | paper | 🟦 founder-wall |
| 07 | Academy | ink | 🟩 |
| 08 | News | paper | 🟩 |
| 09 | Newsletter + Footer | ink | 🟩 (JS: form) |

**Motion en Home:** morph de "born" (sizer CSS evita reflow) · count-up de números · timeline de
proof · barra separadora gradiente aquamarine→red marine · marquee eliminado.

---

## 4a-nav. Navegación entre páginas (2026-07-07)

Las 3 páginas (`home.html`, `sumate.html`, `partners.html`) están interconectadas con hrefs reales
de archivo, no solo anclas `#`. Como el nav y el footer son bloques **compartidos** (inyectados tal
cual en las 3 páginas), sus links usan `archivo.html#ancla` — así funcionan sin importar desde qué
página se cliquea (si ya estás en ese archivo, el navegador solo hace scroll, no recarga).

**Mapa de navegación:**
- Nav: Club/Teams → `home.html#project` · Academy → `home.html#academy` · Shop → `home.html#jersey`
  · News → `home.html#news` · **Partners → `partners.html`** (antes no era alcanzable desde ningún
  lado — se agregó el link) · CTA "Become a Founder" → `sumate.html`.
- Footer: mismo criterio + "Contact" → `partners.html#contact` (el único form de contacto real
  vive en Partners P05).
- Home → Sumate: hero CTA, tarjeta "First whistle 2027" y el CTA del bloque Founders ("Claim my
  number") llevan a `sumate.html` (antes apuntaban mal, ver bugs abajo).
- Sumate → Home/Partners: vía nav/footer compartidos.

**Bugs corregidos de paso:**
- `id="top"` duplicado: el `<header>` del nav tenía `id="top"` Y los heroes de Sumate/Partners
  también — como el nav se inyecta en las 3 páginas, en Sumate/Partners había dos elementos con el
  mismo id. Se quitó `id="top"` del nav (ya no se usa; el logo ahora linkea a `home.html` directo).
- Bloque 06 Founders (Home): el CTA "Claim my number" tenía `href="#store"` con `data-external="sumate"`
  (typo — apuntaba a un ancla que no existía y marcaba Sumate como "externo" siendo una página
  interna). Corregido a `href="sumate.html#plans"`, sin `data-external`.
- Sumate S02 "See your card" apuntaba a `#card`, un ancla que nunca existió (el `<psl-founder-card>`
  no tiene sección propia montada todavía). Redirigido a `#wall` (S04, destino real más cercano)
  como interino — pendiente definir su sección definitiva.

**Idioma persiste entre páginas** vía `localStorage['psl-lang']`: cambiás a ES en una página,
navegás a otra, sigue en ES (cada página llama `initI18n()` al cargar, que lee la misma key).

**Handoff WP:** estos hrefs de archivo (`sumate.html`, `partners.html#contact`) pasan a ser rutas
reales de WordPress (`home_url('/sumate')`, etc.) — el dev los remapea junto con las rutas de
`/src/assets/`.

---

## 4a. Bilingüe EN/ES (i18n)

Switch EN|ES en la nav. Vanilla, portable a WordPress. Core: `src/i18n/i18n.js`.
- **Contenido estático**: el inglés es el HTML natural; el español va co-localizado en `data-es`
  (o `data-es-placeholder` para inputs). `apply()` intercambia el innerHTML según el idioma.
- **Componentes** (labels dinámicos): leen el idioma de `document.documentElement.lang` (fuente
  única que setea `apply()`) con un helper local `L(en, es)` y se re-aplican en el evento
  `psl:langchange`. No importan el módulo i18n (evita instancias duplicadas por query-string).
- **Persistencia**: `localStorage['psl-lang']` + `<html lang>`.
- **Init**: la página, tras inyectar los bloques, hace `initI18n()`.
- **Handoff WP**: cada `data-es` es la traducción del texto — mapear a WPML/Polylang o a `.po/.mo`
  del theme. El español es neutro/latino (Miami), no argentino. Se mantienen en inglés: nombre del
  club, "Treasure Coast", "USL League One", nombres de producto (p. ej. "Founders Edition" en el
  carnet). "Founder" → "Fundador".
- **Estado**: ✅ COMPLETO — Home, Sumate y Partners + nav + footer + los 4 componentes
  (live-counter, jersey-viewer, founder-wall, founder-card), incluyendo labels, notas, tiempos
  relativos ("hace 12 min") y mensajes de forms. Toggle reversible verificado en las 3 páginas.

## 4b. Portabilidad a WordPress (auditoría 2026-07-06)

**Todo el código es HTML/CSS/JS estándar del navegador. No hay React, Vue, Svelte, JSX ni
templating (`{{ }}`) en ningún lado — nada que impida el traspaso.** Verificado con grep sobre todo `src/`.

- **Animaciones**: 100% portables. Son CSS `@keyframes` (`psl-pulse`, `psl-marq`, `psl-rise`,
  `psl-shimmer` en tokens.css) + `requestAnimationFrame`/`setInterval` vanilla. Ninguna librería.
- **Web Components** (`<psl-live-counter>`, `<psl-jersey-viewer>`, `<psl-founder-wall>`,
  `<psl-founder-card>`): son `customElements.define` — API nativa del navegador, funciona en
  WordPress tal cual. Se insertan como una etiqueta HTML dentro de cualquier bloque.
- **ES modules** (`import`/`export`): encolar los `.js` con `type="module"`
  (`wp_enqueue_script(..., ['strategy'=>'defer'])` + filtro para `type=module`, o `<script type=module>`).

**Lo único a adaptar al integrar (no son bloqueos, son remapeos):**
1. **Andamiaje de preview** — `pages/home.html`, `sumate.html`, `partners.html` usan `fetch()` para
   ensamblar los bloques en una sola página. Eso es SOLO para previsualizar. En WordPress cada
   bloque de `native/` es un bloque separado; el `fetch`/ensamblado NO se traspasa (ni debe).
   (El único `fetch(` fuera de `pages/` es un comentario en `live-counter.js`, no código.)
2. **Rutas de assets absolutas** `/src/assets/...` en 4 archivos (00-nav, 06-founders, 09-footer,
   founder-card.js) → remapear a la ruta de assets del theme (`get_template_directory_uri()` o
   equivalente). Las fuentes en `fonts.css` ya usan rutas relativas (`../assets/fonts/`).
3. **Cache-busting** `?v=N` en los `<link>`/`<script>` de las pages y en el import de
   `live-counter.js` (`./live-counter.config.js?v=2`) → el dev lo maneja con el versionado de
   `wp_enqueue_*`; se puede quitar el `?v=` del import al bundlear.
4. **Endpoints demo** — los componentes corren con datos simulados; conectar los contratos de §3.

## 5. Deuda técnica conocida

- **`founder-card.css/js`**: ✅ restylado al sistema nuevo (crest oficial aqua, número Druk, arte
  generativo aqua + red marine, tiers Charter/Founding, share pill aqua). Todavía NO montado en una
  página — se ubica al construir el bloque "Your card" / S04. Generación real: server-side (OG image).
- Placeholders `▦ DROP ASSET HERE`: reemplazar por renders de estadio y fotos reales del cliente.
- Nav en mobile: algo apretado (wordmark + CTA), candidato a menú hamburguesa más adelante.

---

## 6. Roadmap

### Sumate (Founders) — COMPLETA (`pages/sumate.html`)
| Bloque | Qué es | Tipo | Estado |
|---|---|---|---|
| S01 | Apertura "Be a Founder. Forever." (statement hero) | 🟩 | ✅ |
| S02 | 4 beneficios (For life / Your number / On the wall / Your card) | 🟩 `.pcard` | ✅ |
| S03 | Cómo sumarte — tabla 3 planes (alta de fundador) | 🟦 | ✅ |
| S04 | Muro de fundadores (reusa founder-wall + búsqueda por número) | 🟦 | ✅ |
| S05 | FAQ acordeón (`<details>` nativo, sin JS) | 🟩 | ✅ |
| S06 | Llamado final — banda aquamarine (Join free / Reserve) | 🟩 | ✅ |

Footer/newsletter: reusa el bloque compartido `home/09-cierre-footer`.
Nota reuso: nav, footer, `.pcard`, `founder-wall`, `founder-card` (carnet, aún por montar en su
bloque "Your card"), y el contrato de alta (S03) — todos compartidos con Home / listos para Partners.

### Partners — COMPLETA (`pages/partners.html`)
| Bloque | Qué es | Tipo | Estado |
|---|---|---|---|
| P01 | Apertura "Build it with us." (hero del estadio) | 🟩 | ✅ |
| P02 | La oportunidad — 4 cards (Approved stadium / Sport complex / Growing audience / A city project) | 🟩 `.pcard` | ✅ |
| P03 | Qué ganás — 3 cards (Visibility / Association / Early-mover) | 🟩 | ✅ |
| P04 | La tracción — `<psl-live-counter variant="sponsor">` (growth %, reach, deposits captured) | 🟦 | ✅ |
| P05 | Hablemos — form de contacto + descarga del partner deck | 🟩 | ✅ |

Contrato P05: `POST /api/partner-contact { name, company, email, message }`; deck = enlace a PDF (href
a definir). Footer/newsletter: reusa `home/09-cierre-footer`.

Orden estipulado: Hero → resto de Home ✓ → Sumate ✓ → Partners ✓ — **las 3 páginas completas.**
