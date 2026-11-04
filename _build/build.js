/* Genera el sitio estático de Carrara.  Uso:  node _build/build.js
   Escribe los .html en la raíz del repo y assets/site.js. */
const fs = require("fs");
const path = require("path");
const S = require("./shared.js");
const { wa, A, esc, SPAS, BANERAS, RECEPT, plan, dims, priceBtn, spaCard, famCard, quizResult, recommend } = S;

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.carrarahidromasajes.com.ar/";
const VERSION = Date.now().toString(36);

const WA_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.3-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.4 13.4 0 0 1-5.1-4.5c-.4-.6-.9-1.5-.9-2.6s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.7c.1.1.1.3 0 .4l-.3.4-.3.3c-.1.1-.2.3-.1.5.2.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/></svg>`;

const BUSINESS = {
  "@context": "https://schema.org", "@type": "LocalBusiness", name: "Carrara Hidromasajes",
  description: "Fabricantes de spas, bañeras, hidromasajes y receptáculos desde 1992.",
  url: SITE, logo: SITE + "assets/carrara-logo.png", image: SITE + "assets/hero-spa-real.jpg",
  telephone: "+541135894707", email: "valentin@carrarahidromasajes.com.ar", foundingDate: "1992", priceRange: "$$",
  address: { "@type": "PostalAddress", streetAddress: "Av. Nicolás Milazzo 3251, Parque Industrial Plátanos", addressLocality: "Plátanos", addressRegion: "Buenos Aires", addressCountry: "AR" },
  openingHours: "Mo-Fr 08:00-17:00", areaServed: "AR"
};
const crumbsLd = items => ({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })) });

const NAV = [["spas.html", "Spas"], ["baneras.html", "Bañeras"], ["receptaculos.html", "Receptáculos"], ["revendedores.html", "Profesionales"], ["empresa.html", "Fábrica"], ["contacto.html", "Contacto"]];

function layout({ file, title, description, image = "assets/hero-spa-real.jpg", nav, body, ld = [], robots }) {
  const canonical = SITE + (file === "index.html" ? "" : file);
  const navLinks = NAV.map(([h, t]) => `<a href="${h}"${h === nav ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18254020421"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18254020421');</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${robots ? `<meta name="robots" content="${robots}">` : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Carrara Hidromasajes">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#10201F">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="assets/site.css?v=${VERSION}">
${[BUSINESS, ...ld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="wordmark" href="index.html"><span class="logo" role="img" aria-label="Carrara"></span><small>HIDROMASAJES<br>DESDE 1992</small></a>
    <nav class="main" aria-label="Principal">${navLinks}</nav>
    <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Abrir menú"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 5h14M2 9h14M2 13h14"/></svg></button>
  </div>
  <nav class="mnav wrap" id="mnav" hidden aria-label="Menú móvil">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}<a href="spas.html#elegir">Ayudame a elegir</a></nav>
</header>
<main>
${body}
</main>
<footer class="site">
  <div class="wrap">
    <div class="brand"><span class="logo" role="img" aria-label="Carrara Hidromasajes"></span>
      <p style="margin-top:16px;font-size:15px;max-width:36ch">Spas, bañeras y receptáculos de acrílico termoformado. Fabricamos en Plátanos, Buenos Aires, desde 1992.</p></div>
    <div><h2 class="fh">Productos</h2><a href="spas.html">Spas</a><a href="baneras.html">Bañeras</a><a href="receptaculos.html">Receptáculos</a><a href="spas.html#elegir">Ayudame a elegir</a><a href="spas.html#comparar">Comparar spas</a></div>
    <div><h2 class="fh">Empresa</h2><a href="revendedores.html">Profesionales</a><a href="empresa.html">Fábrica</a><a href="contacto.html#preguntas">Preguntas frecuentes</a><a href="contacto.html">Contacto</a></div>
    <div><h2 class="fh">Planta</h2><a href="contacto.html">Av. Nicolás Milazzo 3251</a><a href="contacto.html">Parque Industrial Plátanos</a><a href="${esc(wa("Hola! Quiero hacer una consulta."))}" target="_blank" rel="noopener">+54 11 3589-4707</a><span class="fsmall">Lunes a viernes, 8 a 17 h</span></div>
    <div class="legal">© 2026 Carrara Hidromasajes · Fabricación nacional · 5 años de garantía de fábrica</div>
  </div>
</footer>
<a class="fab" href="${esc(wa("Hola! Quiero hacer una consulta."))}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${WA_ICON}</a>
<script src="assets/site.js?v=${VERSION}"></script>
</body>
</html>
`;
}

/* ---------- Bloques ---------- */
const pageHead = (crumbs, h, p, facts) => `<div class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a> / ${crumbs}</nav><h1>${h}</h1><p>${p}</p><div class="facts">${facts.map(f => `<span class="chip">${f}</span>`).join("")}</div></div></div>`;

const QUICK = `<div class="quick"><div class="wrap">
 <a href="spas.html#elegir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><div><b>Ayudame a elegir</b><span>3 preguntas, un modelo</span></div></a>
 <a href="spas.html#comparar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/></svg><div><b>Comparar spas</b><span>Medidas lado a lado</span></div></a>
 <a target="_blank" rel="noopener" href="${esc(wa("Hola! Quiero recibir el catálogo de Carrara."))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg><div><b>Pedir catálogo</b><span>Fichas técnicas y fotos</span></div></a>
 <a href="revendedores.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21V9l9-5 9 5v12"/><path d="M9 21v-7h6v7"/></svg><div><b>Ser revendedor</b><span>Precio y condiciones de fábrica</span></div></a>
</div></div>`;

const defaultPick = recommend("chico", 2, "espacio");
const QUIZ = `<section class="block" id="elegir"><div class="wrap">
 <div class="sec-head"><div><div class="eyebrow">Ayudame a elegir</div><h2>Tres preguntas y te decimos qué spa va.</h2></div><p>Respondé según tu espacio y cómo lo vas a usar. La recomendación cambia en vivo.</p></div>
 <form class="quiz" id="quiz">
  <div class="qs">
   <fieldset><legend>¿Dónde va a estar?</legend><div class="opts">
    <input type="radio" name="lugar" id="l1" value="chico" checked><label for="l1">Balcón o terraza chica</label>
    <input type="radio" name="lugar" id="l2" value="deck"><label for="l2">Deck, jardín o terraza amplia</label>
    <input type="radio" name="lugar" id="l3" value="interior"><label for="l3">Interior o galería</label></div></fieldset>
   <fieldset><legend>¿Cuántos lo van a usar a la vez?</legend><div class="opts">
    <input type="radio" name="gente" id="g1" value="2" checked><label for="g1">1 o 2</label>
    <input type="radio" name="gente" id="g2" value="4"><label for="g2">3 o 4</label>
    <input type="radio" name="gente" id="g3" value="6"><label for="g3">5 o 6</label></div></fieldset>
   <fieldset><legend>¿Qué es lo más importante?</legend><div class="opts">
    <input type="radio" name="prio" id="p1" value="espacio" checked><label for="p1">Que ocupe poco</label>
    <input type="radio" name="prio" id="p2" value="prof"><label for="p2">Sumergirme bien</label>
    <input type="radio" name="prio" id="p3" value="social"><label for="p3">Compartir y charlar</label>
    <input type="radio" name="prio" id="p4" value="diseno"><label for="p4">Que se integre al diseño</label></div></fieldset>
  </div>
  <div class="res" id="quiz-res" aria-live="polite">${quizResult(defaultPick)}</div>
 </form></div></section>`;

const COMPARE = `<section class="block" id="comparar"><div class="wrap">
 <div class="sec-head"><div><div class="eyebrow">Comparador</div><h2>Los cinco spas, lado a lado.</h2></div><p>Forma, medidas y superficie de cada modelo, para que veas cuál entra en tu espacio.</p></div>
 <div class="cmp-wrap"><table class="cmp"><thead><tr><th></th>${SPAS.map(s => `<th><a href="spa-${s.id}.html"><img src="${A(s.imgs[0])}" alt="" loading="lazy"></a>${s.n}</th>`).join("")}</tr></thead><tbody>
  <tr><th>Forma</th>${SPAS.map(s => `<td>${s.forma}</td>`).join("")}</tr>
  <tr><th>Planta</th>${SPAS.map(s => `<td>${plan(s)} cm</td>`).join("")}</tr>
  <tr><th>Profundidad</th>${SPAS.map(s => `<td>${s.h} cm</td>`).join("")}</tr>
  <tr><th>Superficie</th>${SPAS.map(s => `<td>${(s.round ? Math.PI * (s.l / 200) ** 2 : s.l * s.a / 1e4).toFixed(2).replace(".", ",")} m²</td>`).join("")}</tr>
  <tr><th></th>${SPAS.map(s => `<td>${priceBtn("Spa " + s.n, dims(s))}</td>`).join("")}</tr>
 </tbody></table></div></div></section>`;

const TECH = `<section class="block tech"><div class="wrap tech-grid">
 <div><div class="eyebrow">Nuestro diferencial</div><h2>Una sola pieza. Ninguna unión.</h2>
  <p>Nuestro horno de termoformado mide 4 × 4 metros, de los pocos de ese tamaño en el país. Eso nos permite formar la cuba completa del spa en una sola lámina de acrílico, sin uniones ni pegados. Después armamos el hidromasaje en la misma planta.</p>
  <dl><div><dt>4×4 m</dt><dd>Horno propio</dd></div><div><dt>1</dt><dd>Pieza por cuba</dd></div><div><dt>5 años</dt><dd>Garantía de fábrica</dd></div></dl></div>
 <svg class="oven" viewBox="0 0 520 380" role="img" aria-label="Esquema: la cuba del Tango 225 entra completa en el horno de 4 por 4 metros">
  <rect x="40" y="20" width="340" height="340" fill="none" stroke="var(--band-accent)" stroke-width="2"/>
  <text class="t" x="48" y="44">Horno de termoformado</text><text x="48" y="62">400 × 400 cm</text>
  <rect x="97" y="77" width="226" height="226" rx="10" fill="color-mix(in srgb,var(--band-accent) 18%,transparent)" stroke="var(--band-fg)" stroke-width="1.5"/>
  <rect x="127" y="107" width="166" height="166" rx="40" fill="none" stroke="var(--band-fg)" stroke-opacity=".5" stroke-dasharray="4 4"/>
  <text class="t" x="210" y="186" text-anchor="middle">Tango 225</text><text x="210" y="204" text-anchor="middle">1 lámina · 0 uniones</text>
  <line x1="97" x2="323" y1="320" y2="320" stroke="var(--band-muted)"/><line x1="97" x2="97" y1="314" y2="326" stroke="var(--band-muted)"/><line x1="323" x2="323" y1="314" y2="326" stroke="var(--band-muted)"/>
  <text x="210" y="342" text-anchor="middle">225 cm</text>
  <line x1="400" x2="400" y1="20" y2="360" stroke="var(--band-muted)"/><line x1="394" x2="406" y1="20" y2="20" stroke="var(--band-muted)"/><line x1="394" x2="406" y1="360" y2="360" stroke="var(--band-muted)"/>
  <text x="412" y="194">400 cm</text>
 </svg>
</div></section>`;

const PRO = `<section class="block pro" id="profesionales"><div class="wrap">
 <div class="sec-head"><div><div class="eyebrow">Canal profesional</div><h2>Directo de fábrica para quien vende, proyecta y construye.</h2></div><p>Sin cadena de intermediarios: precio de fábrica, plazos que se pueden comunicar y alguien que conoce el producto del otro lado del teléfono.</p></div>
 <div class="pro-grid">
  <article class="pro-col" id="revendedores"><div class="who">Locales · Sanitarios · Piscineros</div><h3>Revendedores y distribuidores</h3><ul>
   <li>Lista de precios de revendedor con margen real.</li><li>Fabricado en Argentina.</li><li>Catálogo con fichas técnicas y fotos para tu local y tus redes.</li><li>Capacitación sobre cada línea: usos, instalación y preguntas frecuentes.</li></ul>
   <a class="btn" target="_blank" rel="noopener" href="${esc(wa("Hola! Tengo un local y quiero recibir la lista de revendedores de Carrara."))}">Quiero ser revendedor</a></article>
  <article class="pro-col" id="arquitectos"><div class="who">Estudios · Interioristas</div><h3>Arquitectos y diseñadores</h3><ul>
   <li>Medidas exactas de cada modelo para especificar en pliego y planos.</li><li>Buscador por medida de bañeras y receptáculos.</li><li>Asesoramiento sobre instalación, desagües y conexión eléctrica.</li></ul>
   <a class="btn" target="_blank" rel="noopener" href="${esc(wa("Hola! Soy arquitecto/a y quiero especificar productos Carrara en un proyecto."))}">Consultar para un proyecto</a></article>
  <article class="pro-col" id="constructoras"><div class="who">Desarrollos · Hoteles · Cabañas</div><h3>Constructoras y hotelería</h3><ul>
   <li>Cotización por volumen para edificios, barrios y complejos.</li><li>Entregas coordinadas con el avance de obra.</li><li>Receptáculos antideslizantes de serie, para uso intensivo.</li><li>Spas para áreas wellness, terrazas y unidades premium.</li></ul>
   <a class="btn" target="_blank" rel="noopener" href="${esc(wa("Hola! Quiero cotizar productos Carrara para una obra."))}">Cotizar una obra</a></article>
 </div>
 <div class="steps"><div class="step"><span class="k">Paso 1</span><p>Nos contás qué negocio o proyecto tenés y en qué zona trabajás.</p></div><div class="step"><span class="k">Paso 2</span><p>Te enviamos el catálogo con precios y condiciones para tu perfil.</p></div><div class="step"><span class="k">Paso 3</span><p>Definimos el primer pedido o la planilla de obra y coordinamos fabricación y entrega.</p></div></div>
</div></section>`;

const FAB = `<section class="block"><div class="wrap factory">
 <div class="photos"><img src="${A("spa-tango225-3")}" alt="Spa Tango 225 con terminación granito azul en una terraza" loading="lazy"><img src="${A("banera-minimalista")}" alt="Bañera Minimalista" loading="lazy"><img src="${A("recept-cuadrado-1")}" alt="Receptáculo cuadrado antideslizante" loading="lazy"></div>
 <div><div class="eyebrow">Fabricación propia desde 1992</div><h2 class="h2">Lo que hace un fabricante y no un importador.</h2>
  <p class="muted" style="margin-top:18px;max-width:54ch">Producimos en Av. Nicolás Milazzo 3251, Parque Industrial Plátanos. Todo el proceso pasa por nuestra planta: por eso podemos sostener repuestos y responder por cada unidad.</p>
  <ol class="proc">
   <li><span class="k">01</span><div><b>Termoformado</b><span>La lámina de acrílico se forma en nuestro horno de 4 × 4 m. La cuba sale de una sola pieza.</span></div></li>
   <li><span class="k">02</span><div><b>Armado del hidromasaje</b><span>Montamos jets, bomba y comandos en planta, según el modelo y la configuración pedida.</span></div></li>
   <li><span class="k">03</span><div><b>Prueba y control</b><span>Cada equipo se prueba antes de salir de fábrica.</span></div></li>
   <li><span class="k">04</span><div><b>Entrega</b><span>Coordinamos el despacho con el local, la obra o el cliente final.</span></div></li>
  </ol></div></div></section>`;

const FAQS = [
  ["¿Venden directo de fábrica?", "Sí. Atendemos a particulares y a profesionales: revendedores, distribuidores, estudios de arquitectura, constructoras y hoteles. Cada perfil tiene sus condiciones."],
  ["¿Qué garantía tienen los productos?", "Todos los productos tienen 5 años de garantía de fábrica. Como fabricamos acá, también sostenemos repuestos y servicio."],
  ["¿Todas las bañeras pueden llevar hidromasaje?", "Sí. Las 12 familias se fabrican con o sin sistema de hidromasaje incorporado."],
  ["¿Hacen entregas fuera de Buenos Aires?", "Coordinamos la entrega según el destino. Escribinos con tu localidad y te confirmamos plazo y forma de envío."],
  ["¿Qué necesito para pedir una cotización?", "El producto que te interesa, las medidas aproximadas del espacio y, si podés, una foto del lugar. Con eso te respondemos con precio y plazo."],
  ["¿Cómo me sumo como revendedor?", "Nos contás qué tipo de local tenés y en qué zona. Te enviamos el catálogo con precios de revendedor y coordinamos una capacitación sobre la línea."]
];
const FAQ = `<section class="block" id="preguntas"><div class="wrap faq"><div><div class="eyebrow">Preguntas frecuentes</div><h2 class="h2">Antes de cotizar.</h2><p class="muted" style="margin-top:14px">¿No está tu pregunta? Escribinos por WhatsApp.</p></div>
 <div>${FAQS.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div></section>`;
const FAQ_LD = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

const CTA = `<section class="cta-band"><div class="wrap"><div><h2>¿Ya sabés qué necesitás?</h2><p>Contanos el producto, la medida y la zona. Te respondemos en el día hábil.</p></div>
 <div class="ctas"><a class="btn btn-wa" target="_blank" rel="noopener" href="${esc(wa("Hola! Quiero hacer una consulta."))}">${WA_ICON} Escribir por WhatsApp</a><a class="btn btn-ghost" href="contacto.html">Dejar una consulta</a></div></div></section>`;

/* ---------- Páginas ---------- */
const pages = [];

pages.push({ file: "index.html", nav: "", title: "Carrara Hidromasajes | Spas, bañeras y receptáculos",
  description: "Spas, bañeras, hidromasajes y receptáculos fabricados en nuestra planta de Plátanos. Carrara Hidromasajes, desde 1992.",
  ld: [FAQ_LD],
  body: `<section class="hero"><img src="${A("hero-spa-real")}" alt="Spa Carrara empotrado en deck junto a la pileta" fetchpriority="high" width="1448" height="1086">
  <div class="spec">SPA TANGO 225<br>225 × 225 × 90 CM</div>
  <div class="wrap"><div class="eyebrow" style="color:#9EE6E8">Fábrica en Plátanos · Desde 1992</div>
   <h1 style="margin-top:14px">El spa se fabrica acá.</h1>
   <p>Spas, bañeras y receptáculos de acrílico termoformado, hechos de cero en nuestra planta. Para tu casa, tu local o tu obra.</p>
   <div class="ctas"><a class="btn btn-primary" href="spas.html#elegir">Ayudame a elegir</a><a class="btn btn-ghost" href="spas.html">Ver los spas</a></div></div></section>
 ${QUICK}
 <section class="block"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Nuestras líneas</div><h2>Tres líneas, todas fabricadas en Plátanos.</h2></div><p>Del spa para la terraza al receptáculo para un edificio entero.</p></div>
  <div class="lines">
   <a class="line-card" href="spas.html"><img src="${A("spa-tango225-1")}" alt="" loading="lazy"><div class="tx"><span class="n">5 MODELOS</span><h3>Spas</h3><p>De 183 × 160 a 225 × 225 cm. Interior y exterior.</p></div></a>
   <a class="line-card" href="baneras.html"><img src="${A("banera-duo")}" alt="" loading="lazy"><div class="tx"><span class="n">12 FAMILIAS</span><h3>Bañeras</h3><p>Más de 30 medidas, con o sin hidromasaje.</p></div></a>
   <a class="line-card" href="receptaculos.html"><img src="${A("product-shower")}" alt="" loading="lazy"><div class="tx"><span class="n">7 MEDIDAS</span><h3>Receptáculos</h3><p>Antideslizantes de serie, de 78 × 78 a 150 × 80 cm.</p></div></a>
  </div></div></section>
 <section class="block" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Pensado para</div><h2>Empezá por lo que necesitás.</h2></div></div>
  <div class="uses">
   <a class="use" href="spa-studio.html"><img src="${A("spa-studio-1")}" alt="" loading="lazy"><div><b>Terrazas y balcones</b><span>Hidromasaje completo en 183 × 160 cm.</span><em>Spa Studio →</em></div></a>
   <a class="use" href="spa-fiesta-195.html"><img src="${A("spa-redondo-1")}" alt="" loading="lazy"><div><b>Reuniones con amigos</b><span>Planta circular: todos mirando al centro.</span><em>Spa Fiesta 195 →</em></div></a>
   <a class="use" href="spa-tango-225.html"><img src="${A("spa-tango225-1")}" alt="" loading="lazy"><div><b>Inmersión total</b><span>90 cm de profundidad, para 5 o 6 personas.</span><em>Spa Tango 225 →</em></div></a>
   <a class="use" href="baneras.html"><img src="${A("banera-minimalista")}" alt="" loading="lazy"><div><b>Reforma de baño</b><span>La Minimalista, en 7 medidas.</span><em>Bañeras →</em></div></a>
   <a class="use" href="receptaculos.html"><img src="${A("recept-cuadrado-2")}" alt="" loading="lazy"><div><b>Hoteles y cabañas</b><span>Receptáculos antideslizantes para uso intensivo.</span><em>Receptáculos →</em></div></a>
   <a class="use" href="revendedores.html"><img src="${A("banera-plus")}" alt="" loading="lazy"><div><b>Obras en serie</b><span>Cotización por volumen y entregas por etapa.</span><em>Profesionales →</em></div></a>
  </div></div></section>
 ${TECH}${PRO}${FAQ}${CTA}` });

pages.push({ file: "spas.html", nav: "spas.html", title: "Spas de hidromasaje | Carrara Hidromasajes",
  description: "Cinco spas de hidromasaje de acrílico termoformado fabricados en Plátanos: Tango 225, Tango 195, Fiesta 195, Minimalista 195 y Studio. Cuba de una pieza.",
  image: "assets/spa-tango225-1.webp",
  ld: [crumbsLd([["Inicio", ""], ["Spas", "spas.html"]])],
  body: `${pageHead("Spas", "Spas de hidromasaje", "Cinco modelos de acrílico termoformado, del más compacto al más amplio. Cuba de una sola pieza e hidromasaje armado en planta.", ["5 modelos", "Cuba de 1 pieza", "Interior / exterior", "5 años de garantía"])}
 <section class="block" style="padding-top:40px"><div class="wrap">
  <div class="toolbar" id="spa-filter" role="group" aria-label="Filtrar por forma">
   <button class="chipf" type="button" data-f="all" aria-pressed="true">Todos</button><button class="chipf" type="button" data-f="Cuadrado" aria-pressed="false">Cuadrados</button><button class="chipf" type="button" data-f="Circular" aria-pressed="false">Circular</button><button class="chipf" type="button" data-f="Rectangular" aria-pressed="false">Rectangular</button>
   <a class="link" href="#comparar" style="margin-left:auto">Comparar los 5 →</a></div>
  <div class="grid" id="spa-grid">${SPAS.map(spaCard).join("")}</div></div></section>
 ${QUIZ}${COMPARE}${TECH}${CTA}` });

SPAS.forEach(s => pages.push({ file: `spa-${s.id}.html`, nav: "spas.html",
  title: `Spa ${s.n} ${plan(s)} cm | Carrara Hidromasajes`,
  description: `Spa de hidromasaje ${s.n}: ${dims(s)}, ${s.forma.toLowerCase()}, acrílico termoformado en una sola pieza. Fabricado en Plátanos, Buenos Aires. Pedí precio directo de fábrica.`,
  image: A(s.imgs[0]),
  ld: [crumbsLd([["Inicio", ""], ["Spas", "spas.html"], [s.n, `spa-${s.id}.html`]]),
    { "@context": "https://schema.org", "@type": "Product", name: "Spa " + s.n, description: s.long, image: s.imgs.map(i => SITE + A(i)),
      brand: { "@type": "Brand", name: "Carrara Hidromasajes" }, material: "Acrílico termoformado" }],
  body: `<div class="wrap"><div class="page-head" style="background:none;border:0;padding-bottom:0"><nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a> / <a href="spas.html">Spas</a> / ${s.n}</nav></div>
 <div class="detail"><div><div class="gal-main"><img id="gal-img" src="${A(s.imgs[0])}" alt="Spa ${s.n} Carrara" width="1200" height="900"></div>
   <div class="thumbs">${s.imgs.map((m, i) => `<button type="button" data-img="${m}" aria-pressed="${i === 0}" aria-label="Foto ${i + 1}"><img src="${A(m)}" alt="" loading="lazy"></button>`).join("")}</div></div>
  <div><div class="eyebrow">Spa · ${s.forma}</div><h1>${s.n}</h1><p class="lead">${s.long}</p>
   <div class="sheet"><div><span>Planta</span><b>${plan(s)} cm</b></div><div><span>Profundidad</span><b>${s.h} cm</b></div>${s.cap ? `<div><span>Capacidad</span><b>${s.cap}</b></div>` : ""}<div><span>Material</span><b>Acrílico termoformado</b></div><div><span>Cuba</span><b>1 pieza, sin uniones</b></div><div><span>Hidromasaje</span><b>Armado en planta</b></div><div><span>Garantía</span><b>5 años de fábrica</b></div></div>
   <div class="ctas"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${esc(wa(`Hola! Me interesa el spa ${s.n} (${dims(s)}). ¿Me pasan precio y plazo?`))}">${WA_ICON} Pedir precio por WhatsApp</a><a class="btn btn-ghost btn-sm" href="contacto.html?producto=${encodeURIComponent("Spa " + s.n)}">Dejar una consulta</a></div>
   <p class="note" style="margin-top:14px">¿No sabés cuál elegir? <a class="link" href="spas.html#comparar">Compará las medidas de los 5 spas</a>.</p></div></div></div>
 <section class="block" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Otros modelos</div><h2>Seguí mirando.</h2></div></div><div class="grid">${SPAS.filter(x => x.id !== s.id).slice(0, 3).map(spaCard).join("")}</div></div></section>` }));

const famPage = (kind, list) => {
  const isB = kind === "banera";
  return `${isB ? pageHead("Bañeras", "Bañeras con o sin hidromasaje", "Doce familias de fabricación nacional, desde modelos compactos para baños chicos hasta versiones dobles. Cualquier modelo se fabrica con hidromasaje incorporado.", ["12 familias", "+30 medidas", "Con o sin hidromasaje", "Fabricación nacional"])
    : pageHead("Receptáculos", "Receptáculos para ducha", "Platos de ducha de diseño limpio e instalación sencilla. Base antideslizante de serie y desagüe centrado en todos los modelos.", ["7 medidas", "Antideslizante de serie", "Desagüe centrado", "Uso residencial y hotelero"])}
  <section class="block" style="padding-top:40px"><div class="wrap">
   <form class="finder" id="finder" data-kind="${kind}" novalidate><div class="t"><b>¿Qué entra en tu ${isB ? "baño" : "ducha"}?</b><span>Cargá el espacio disponible y marcamos las medidas que entran.</span></div>
    <label class="f" for="fl">Largo disponible (cm)<input id="fl" type="number" inputmode="numeric" min="50" max="300" placeholder="${isB ? "170" : "120"}"></label>
    <label class="f" for="fa">Ancho disponible (cm)<input id="fa" type="number" inputmode="numeric" min="50" max="300" placeholder="80"></label>
    <button class="btn btn-ink" type="button" id="fclear">Ver todo</button></form>
   <p class="note" id="fres" style="margin:-12px 0 20px" aria-live="polite"></p>
   <div class="grid${isB ? "" : " g4"}" id="fam-grid">${list.map(f => famCard(f, kind, null)).join("")}</div></div></section>${CTA}`;
};
pages.push({ file: "baneras.html", nav: "baneras.html", title: "Bañeras con hidromasaje | Carrara Hidromasajes",
  description: "12 familias de bañeras fabricadas en Argentina: Minimalista, Arosa, Plus, Super Plus, Palace, Duo, Carrara, Galana, Esquineros, Mykonos, Bahía e Infinity. Con o sin hidromasaje.",
  image: "assets/banera-minimalista.webp", ld: [crumbsLd([["Inicio", ""], ["Bañeras", "baneras.html"]])], body: famPage("banera", BANERAS) });
pages.push({ file: "receptaculos.html", nav: "receptaculos.html", title: "Receptáculos para ducha | Carrara Hidromasajes",
  description: "Receptáculos para ducha de fabricación nacional. 7 medidas, de 78 × 78 a 150 × 80 cm, todos con base antideslizante y desagüe centrado. Planta en Plátanos, Buenos Aires.",
  image: "assets/product-shower.webp", ld: [crumbsLd([["Inicio", ""], ["Receptáculos", "receptaculos.html"]])], body: famPage("recept", RECEPT) });

pages.push({ file: "revendedores.html", nav: "revendedores.html", title: "Revendedores, arquitectos y constructoras | Carrara Hidromasajes",
  description: "Revendé la línea Carrara o especificala en tu obra. Precio de fábrica, fabricación nacional y atención directa para revendedores, arquitectos, constructoras y hoteles.",
  ld: [crumbsLd([["Inicio", ""], ["Profesionales", "revendedores.html"]]), FAQ_LD],
  body: `${pageHead("Profesionales", "Directo de fábrica, para profesionales.", "Trabajamos con revendedores, distribuidores, estudios de arquitectura, constructoras y hoteles de todo el país.", ["Precio de fábrica", "Fabricado en Argentina", "Desde 1992", "5 años de garantía"])}${PRO}${FAQ}${CTA}` });

pages.push({ file: "empresa.html", nav: "empresa.html", title: "Nuestra fábrica | Carrara Hidromasajes",
  description: "Carrara Hidromasajes: fabricantes de spas, bañeras e hidromasajes desde 1992 en Plátanos, Buenos Aires. Horno de termoformado de 4 × 4 m y cuba de una sola pieza.",
  ld: [crumbsLd([["Inicio", ""], ["Fábrica", "empresa.html"]])],
  body: `${pageHead("Fábrica", "Fabricamos desde 1992 en Plátanos.", "Termoformamos el acrílico, armamos el hidromasaje y probamos cada equipo en nuestra planta del Parque Industrial Plátanos.", ["Desde 1992", "Horno de 4 × 4 m", "Cuba de 1 pieza", "5 años de garantía"])}${FAB}${TECH}${CTA}` });

pages.push({ file: "contacto.html", nav: "contacto.html", title: "Contacto | Carrara Hidromasajes",
  description: "Contactá a Carrara Hidromasajes: WhatsApp, mail y planta en Plátanos, Buenos Aires. Pedí tu cotización directo de fábrica de spas, bañeras y receptáculos.",
  ld: [crumbsLd([["Inicio", ""], ["Contacto", "contacto.html"]]), FAQ_LD],
  body: `<section class="block"><div class="wrap contact">
 <div><nav class="crumbs" aria-label="Ruta" style="font:12px var(--f-mono);color:var(--muted)"><a href="index.html" style="text-decoration:none">Inicio</a> / Contacto</nav><h1 class="h1c">Contanos qué estás armando.</h1>
  <p class="muted" style="margin-top:16px;max-width:44ch">Con el producto, una medida aproximada y la zona ya podemos cotizarte. Te respondemos el mismo día hábil.</p>
  <div class="info"><div><span class="l">WhatsApp / Teléfono</span><span class="v mono">+54 11 3589-4707</span></div><div><span class="l">Email</span><span class="v">valentin@carrarahidromasajes.com.ar</span></div><div><span class="l">Planta</span><span class="v">Av. Nicolás Milazzo 3251<br>Parque Industrial Plátanos, Buenos Aires</span></div><div><span class="l">Horario</span><span class="v">Lunes a viernes, 8 a 17 h</span></div></div>
  <a class="btn btn-wa" style="margin-top:24px" target="_blank" rel="noopener" href="${esc(wa("Hola! Quiero hacer una consulta."))}">${WA_ICON} Escribir por WhatsApp</a></div>
 <form class="form" id="contact-form" action="https://formspree.io/f/xdarykeq" method="POST">
  <div class="row2"><label class="f" for="k-nombre">Nombre *<input id="k-nombre" name="nombre" required autocomplete="name"></label>
   <label class="f" for="k-tel">Teléfono *<input id="k-tel" name="telefono" type="tel" required autocomplete="tel" minlength="8" pattern="[0-9+() -]{8,20}" title="Ingresá un teléfono válido, ej: 11 3589-4707"></label></div>
  <div class="row2"><label class="f" for="k-email">Email<input id="k-email" name="email" type="email" autocomplete="email"></label>
   <label class="f" for="k-zona">Localidad<input id="k-zona" name="localidad"></label></div>
  <div class="row2"><label class="f" for="k-perfil">Consulto como<select id="k-perfil" name="perfil"><option>Particular</option><option>Revendedor / distribuidor</option><option>Arquitecto / estudio</option><option>Constructora / hotel</option></select></label>
   <label class="f" for="k-prod">Producto<select id="k-prod" name="producto"><option>Spa</option><option>Bañera</option><option>Receptáculo</option><option>Otro / no estoy seguro</option></select></label></div>
  <label class="f" for="k-msg">Mensaje<textarea id="k-msg" name="mensaje" placeholder="Modelos, medidas, cantidad, plazo de obra…"></textarea></label>
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
  <input type="hidden" name="_subject" value="Nueva consulta desde carrarahidromasajes.com.ar">
  <button class="btn btn-primary" type="submit" style="justify-self:start">Enviar consulta</button>
  <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
 </form></div></section>${FAQ}` });

pages.push({ file: "gracias.html", nav: "", title: "Consulta enviada | Carrara Hidromasajes", robots: "noindex, nofollow",
  description: "Recibimos tu consulta. Te respondemos el mismo día hábil.",
  body: `<section class="block"><div class="wrap" style="max-width:760px">
  <div class="eyebrow">Consulta enviada</div><h1 class="h1c">Gracias, recibimos tu consulta.</h1>
  <p class="muted" style="margin-top:16px;font-size:18px">Te respondemos el mismo día hábil con modelos, medidas, precio y tiempos de entrega. Si querés adelantarlo, escribinos directo por WhatsApp.</p>
  <div class="ctas" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px"><a class="btn btn-wa" target="_blank" rel="noopener" href="${esc(wa("Hola! Acabo de dejar una consulta en la web."))}">${WA_ICON} Seguir por WhatsApp</a><a class="btn btn-ghost" href="spas.html">Ver productos</a></div>
 </div></section>` });

/* ---------- Escritura ---------- */
for (const p of pages) fs.writeFileSync(path.join(ROOT, p.file), layout(p));
fs.writeFileSync(path.join(ROOT, "assets/site.js"),
  "/* Generado por _build/build.js — no editar a mano */\n" + fs.readFileSync(path.join(__dirname, "shared.js"), "utf8").replace(/\nif \(typeof module[^\n]*\n?/, "\n") + "\n" + fs.readFileSync(path.join(__dirname, "client.js"), "utf8"));

const today = new Date().toISOString().slice(0, 10);
const indexable = pages.filter(p => !p.robots);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p => `  <url><loc>${SITE}${p.file === "index.html" ? "" : p.file}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log("Generadas", pages.length, "páginas:", pages.map(p => p.file).join(", "));
