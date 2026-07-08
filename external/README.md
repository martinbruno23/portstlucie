# 🟧 Externo — qué vive afuera de este sistema

Ningún bloque del wireframe está clasificado 🟧 explícitamente (confirmado con el cliente,
2026-06-30). El único punto externo real es la **tienda oficial**, que ya está construida
aparte y no se replica acá.

## Tienda
- Puntos de salida desde este sistema: botón "See the store" (bloque 04, La camiseta) y
  cualquier CTA de merch en Comunidad/Novedades si aplica.
- Contrato esperado: un `href` final hacia la tienda externa. El estilo del link/botón sí es
  responsabilidad de este sistema (usa `.cta-secondary` o link de texto, según el peso visual
  del bloque); el destino y la lógica de e-commerce no.
- No construir checkout, carrito, ni catálogo acá.

## Pendiente
- Si en el futuro se decide traer un bloque "Sumate" externo (mencionado como posibilidad por
  el cliente pero descartado por ahora, 2026-06-30), documentar acá su contrato antes de tocar
  `/native` o `/custom`.
