# Carrara_hidromasajes

Sitio de carrarahidromasajes.com.ar (estático, publicado por Vercel desde `main`).

## Cómo editar

Las páginas `.html` de la raíz, `assets/site.js` y `sitemap.xml` se **generan**. No se editan a mano.

- Productos, medidas y textos de tarjetas: `_build/shared.js`
- Páginas, encabezados SEO, secciones: `_build/build.js`
- Interacciones (buscador, filtro, guía, formulario): `_build/client.js`
- Estilos: `assets/site.css`

Después de cambiar algo:

```
node _build/build.js
```

y commitear los archivos generados.

## Tracking

- Google Ads `AW-18254020421` en todas las páginas.
- Conversión: clic en cualquier link de WhatsApp y carga de `gracias.html` (después de enviar el formulario de Formspree en `contacto.html`).
