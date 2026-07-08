# Tokens — origen de cada decisión

Sistema visual adoptado de **`Diseño ClaudeDesign/Home.dc.html`** (dirección de diseño validada
por el cliente, jul 2026). Verificado contra el **manual de marca oficial** (`Manual de
marca/.../PSL-Brandbook.pdf`, sept 2025).

## Colores oficiales (brandbook)

| Nombre | Valor | Pantone |
|---|---|---|
| Aquamarine | `#AAF6E6` (RGB 170/246/230) | 0921 C |
| Black | `#000000` | Black C |
| White | `#FFFFFF` | White C |
| Red Marine | `#FF0033` | 0821 C |

**Regla de marca crítica:** el escudo NO admite colores no aprobados — el brandbook muestra
explícitamente un escudo **naranja tachado**. Cualquier acento naranja/terracota queda descartado.
Tampoco: quitar elementos, alterar proporciones, outline, cambiar opacidad, rotar, ni sombras
sobre el escudo.

## Mapeo → tokens (colores y fuentes del brandbook)

Color: **aquamarine principal, negro secundario, blanco + red marine acento** (indicación del cliente).
Estructura/estética tomada del diseño aprobado; color y tipografía del manual de marca.

| Token | Valor | Origen |
|---|---|---|
| `--color-aqua` | `#AAF6E6` | Aquamarine oficial — PRINCIPAL: CTAs, kickers, acentos sobre oscuro |
| `--color-aqua-deep` | `#0E8C79` | aquamarine legible sobre superficies claras (contraste) |
| `--color-ink` | `#0C0C0A` | negro cálido — fondo base oscuro |
| `--color-paper` | `#FFFFFF` | blanco de marca — secciones claras |
| `--color-red-marine` | `#FF0033` | Red Marine oficial — acento de urgencia |
| `--font-hero` | Ferryman | título de la home (H1) |
| `--font-display` | Druk | títulos de sección, números display, títulos de card |
| `--font-label` (`--font-mono` alias) | Druk Text Wide | kickers, labels, nav, "EST. 2019" |
| `--font-body` | FF Tisa (TisaPro) | body / párrafos (serif) |
| `--font-detail` | Cabazon | detalle decorativo (uso puntual) |
| `--color-jersey-viewer-bg` | `#0C0C0A` | Pieza A, decisión #1 del ranking |
| `--ease-jersey-drag`, `--duration-jersey-drag-*` | — | Pieza A, decisión #4 (inercia 400–600ms) |
| `--fs-counter`, `--font-feature-counter` | — | Pieza C, decisión #3 (tabular-nums) |

Fuentes instaladas vía `@font-face` en `src/tokens/fonts.css` (archivos en `src/assets/fonts/`).

## Assets de logo (extraídos de PSL-AllLogos.ai → `src/assets/brand/`)
- `crest-aqua.png` / `crest-black.png` — escudo institucional (nav, footer).
- `anchor-aqua/white/black.png` — ancla **without shape** (detalles, marcas de agua).
- `anchor-shape-aqua.png` — ancla **with shape** (detalle).
- `wordmark-sc-aqua.png` — wordmark "Port St Lucie SC".

## Assets de marca disponibles
- `src/assets/crest.png` — escudo oficial (blackletter "Port St Lucie" + ancla, aquamarine/negro)
- `src/assets/anchor.png` — ancla suelta
- `src/assets/luca.png` — mascota oficial **Luca** (mono pirata)
- Tagline oficial: **"Anchored in glory · Pride of the City"**

## Pendiente
- Reemplazar placeholders de render/foto (`▦ DROP ASSET HERE`) por renders de estadio y fotos
  reales cuando el cliente los entregue.
- Tipografía custom blackletter del escudo: solo vive en el asset del crest, no se usa como webfont.
