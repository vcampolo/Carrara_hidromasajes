/* Datos y plantillas compartidas: las usa build.js para generar las páginas
   y se copian dentro de assets/site.js para el buscador, el filtro y la guía. */
const WA_NUM = "541135894707";
const wa = t => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(t)}`;
const A = n => `assets/${n}.webp`;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const SPAS = [
  {id:"tango-225",n:"Tango 225",forma:"Cuadrado",l:225,a:225,h:90,cap:"5 a 6 personas",imgs:["spa-tango225-1","spa-tango225-3","spa-tango225-2"],b:"El más amplio",
   p:"El más amplio y profundo de la línea. Inmersión completa para 5 o 6 personas.",
   long:"El modelo grande de la línea. Sus 90 cm de profundidad permiten sumergirse hasta los hombros, y la planta cuadrada de 225 cm da lugar a un grupo completo. Funciona empotrado en deck, sobre terraza o como pieza central de un área wellness."},
  {id:"tango-195",n:"Tango 195",forma:"Cuadrado",l:195,a:195,h:75,imgs:["spa-tango195-1","spa-tango195-3","spa-tango195-2"],
   p:"El cuadrado clásico, más profundo que el Minimalista.",
   long:"La medida intermedia de la línea cuadrada. Con 75 cm de profundidad, ofrece una inmersión cómoda en una planta de 195 × 195 cm que entra en la mayoría de los decks y terrazas."},
  {id:"fiesta-195",n:"Fiesta 195",forma:"Circular",l:195,a:195,h:75,round:true,imgs:["spa-redondo-1","spa-redondo-3","spa-redondo-2"],
   p:"El único circular de la línea. Sin aristas, pensado para uso social.",
   long:"Planta circular de 195 cm de diámetro: todos quedan mirando al centro, por eso es el preferido para reuniones. Sin esquinas, se integra bien en jardines y espacios de formas orgánicas."},
  {id:"minimalista-195",n:"Minimalista 195",forma:"Cuadrado",l:195,a:195,h:62,imgs:["spa-minimalista195-1","spa-minimalista-1","spa-minimalista-2"],
   p:"Cuadrado de perfil bajo y líneas limpias. Presencia sin ocupar de más.",
   long:"Mismas medidas en planta que el Tango 195, con un perfil más bajo de 62 cm. Pensado para interiores, galerías y proyectos donde el spa tiene que acompañar la arquitectura sin dominarla."},
  {id:"studio",n:"Studio",forma:"Rectangular",l:183,a:160,h:50,imgs:["spa-studio-3","spa-studio-1","spa-studio-2"],b:"El más compacto",
   p:"El más compacto y el único rectangular. Para terrazas chicas o espacios reducidos.",
   long:"El spa para cuando el lugar es el límite. Su planta de 183 × 160 cm entra en balcones, terrazas de departamento y patios chicos, con hidromasaje completo."}
];
const BANERAS = [
  {id:"minimalista",n:"Minimalista",img:"banera-minimalista",b:"Más vendida",p:"Diseño recto, perfil bajo y bordes limpios. La más elegida para reformas contemporáneas.",s:["170×70","170×75","170×80","178×80","178×90","178×120","183×130"]},
  {id:"arosa",n:"Arosa",img:"banera-arosa",p:"Perfil compacto con terminación redondeada, para baños estándar.",s:["148×70","159×70","170×70"]},
  {id:"plus",n:"Plus",img:"banera-plus",p:"La familia con mayor rango de medidas. Muy versátil para obra.",s:["120×70","140×62","140×70","165×120","182×120","183×90"]},
  {id:"super-plus",n:"Super Plus",img:"banera-superplus",p:"La versión más amplia de la familia Plus, con espacio real para dos.",s:[]},
  {id:"palace",n:"Palace",img:"banera-palace",p:"Perfil clásico con borde elevado y mayor profundidad.",s:["150×75","160×75","170×75"]},
  {id:"duo",n:"Duo",img:"banera-duo",p:"Diseñada para dos personas, para baños o espacios de relax generosos.",s:["180×150"]},
  {id:"carrara",n:"Carrara",img:"banera-carrara",b:"Insignia",p:"El modelo insignia. Línea curva y profunda con carácter propio.",s:["170×87"]},
  {id:"galana",n:"Galana",img:"banera-galana",p:"Diseño oval de líneas suaves y perfil generoso.",s:["150×80","180×90"]},
  {id:"esquineros",n:"Esquineros",img:"banera-esquinero",p:"Para instalación en ángulo. Aprovecha al máximo los rincones del baño.",s:["145×145","148×148"]},
  {id:"mykonos",n:"Mykonos",img:"banera-mykonos",p:"Amplia y baja, para sumergirse completo y aprovechar el hidromasaje.",s:["172×84","180×80"]},
  {id:"bahia",n:"Bahía",img:"banera-bahia",p:"Bañera circular de líneas envolventes, un punto focal para baños amplios.",s:["Ø150","Ø160"]},
  {id:"infinity",n:"Infinity",img:"banera-infinity",p:"Perfil profundo con respaldo ergonómico y apoyacabeza.",s:[]}
];
const RECEPT = [
  {id:"78x78",n:"78 × 78",forma:"Cuadrado",img:"recept-cuadrado-1",alt:"recept-cuadrado-2",p:"El más compacto. Para duchas reducidas o como segunda ducha.",s:["78×78"]},
  {id:"90x90",n:"90 × 90",forma:"Cuadrado",img:"recept-cuadrado-2",alt:"recept-cuadrado-1",b:"Más pedido",p:"El más pedido para baños estándar. Fácil de instalar en reformas.",s:["90×90"]},
  {id:"90x70",n:"90 × 70",forma:"Rectangular",img:"recept-rectangular-1",alt:"recept-rectangular-2",p:"Para baños más angostos, con buena profundidad.",s:["90×70"]},
  {id:"110x70",n:"110 × 70",forma:"Rectangular",img:"recept-rectangular-2",alt:"recept-rectangular-3",p:"Para duchas más amplias en baños con espacio suficiente.",s:["110×70"]},
  {id:"120x80",n:"120 × 80",forma:"Rectangular",img:"recept-rectangular-3",alt:"recept-rectangular-1",p:"Buena proporción para uso diario, con espacio para moverse.",s:["120×80"]},
  {id:"140x70",n:"140 × 70",forma:"Rectangular largo",img:"recept-alargado-1",alt:"recept-alargado-2",p:"Ducha larga y estrecha, para espacios con ancho limitado.",s:["140×70"]},
  {id:"150x80",n:"150 × 80",forma:"Rectangular largo",img:"recept-alargado-4",alt:"recept-alargado-3",p:"El más amplio. Para baños principales y proyectos hoteleros.",s:["150×80"]}
];

const plan = s => s.round ? "Ø " + s.l : s.l + " × " + s.a;
const dims = s => `${plan(s)} × ${s.h} cm`;
const parse = s => { if (s.startsWith("Ø")) { const d = +s.slice(1); return [d, d]; } const [a, b] = s.split("×").map(Number); return [Math.max(a, b), Math.min(a, b)]; };
const priceBtn = (label, sub) => `<a class="add" target="_blank" rel="noopener" href="${esc(wa(`Hola! Quiero precio de: ${label}${sub ? " (" + sub + ")" : ""}`))}">Pedir precio</a>`;

function spaCard(s) {
  return `<article class="card"><a class="ph" href="spa-${s.id}.html">${s.b ? `<span class="badge">${s.b}</span>` : ""}<img src="${A(s.imgs[0])}" alt="Spa ${s.n} Carrara" loading="lazy" width="800" height="600"><img class="alt" src="${A(s.imgs[1])}" alt="" loading="lazy"></a>
  <div class="bd"><h3 class="h4"><a href="spa-${s.id}.html">${s.n}</a></h3><p>${s.p}</p>
  <div class="specs"><div><span>Planta</span><b>${s.round ? "Ø " + s.l : s.l + "×" + s.a}</b></div><div><span>Prof.</span><b>${s.h} cm</b></div><div><span>Forma</span><b>${s.forma}</b></div></div>
  <div class="act"><a class="link" href="spa-${s.id}.html">Ver ficha →</a>${priceBtn("Spa " + s.n, dims(s))}</div></div></article>`;
}
function famCard(f, kind, fit) {
  const label = (kind === "banera" ? "Bañera " : "Receptáculo ") + f.n + (kind === "recept" ? " cm" : "");
  const sizes = f.s.length ? f.s.map(x => `<span class="chip${fit && fit.includes(x) ? " fit" : ""}">${x}</span>`).join("") : `<span class="chip">Consultar medidas</span>`;
  return `<article class="card${kind === "recept" ? " tall" : ""}"><div class="ph">${f.b ? `<span class="badge">${f.b}</span>` : ""}<img src="${A(f.img)}" alt="${label} Carrara" loading="lazy">${f.alt ? `<img class="alt" src="${A(f.alt)}" alt="" loading="lazy">` : ""}</div>
  <div class="bd"><h3 class="h4">${kind === "recept" ? f.n + " cm" : f.n}</h3>${f.forma ? `<div class="dim">${f.forma} · antideslizante · desagüe centrado</div>` : `<div class="dim">Con o sin hidromasaje</div>`}<p>${f.p}</p>
  ${kind === "banera" ? `<div class="sizes">${sizes}</div>` : ""}
  <div class="act">${priceBtn(label, kind === "banera" && fit && fit.length ? fit[0] : "")}</div></div></article>`;
}
function quizResult(s) {
  return `<img src="${A(s.imgs[0])}" alt="Spa ${s.n}"><div class="bd"><div class="eyebrow">Te recomendamos</div><h3>${s.n}</h3><div class="mono" style="color:var(--accent)">${dims(s)}</div><p class="muted">${s.p}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><a class="btn btn-primary btn-sm" href="spa-${s.id}.html">Ver ficha</a>${priceBtn("Spa " + s.n, dims(s))}</div></div>`;
}
function recommend(L, G, P) {
  const sc = {studio:0,"minimalista-195":0,"tango-195":0,"fiesta-195":0,"tango-225":0};
  if (L === "chico") sc.studio += 4, sc["minimalista-195"] += 1;
  if (L === "deck") sc["tango-225"] += 2, sc["fiesta-195"] += 2, sc["tango-195"] += 2;
  if (L === "interior") sc["minimalista-195"] += 3, sc.studio += 1;
  if (G === 2) sc.studio += 2, sc["minimalista-195"] += 1;
  if (G === 4) sc["tango-195"] += 2, sc["fiesta-195"] += 2, sc["minimalista-195"] += 1;
  if (G === 6) sc["tango-225"] += 4, sc["fiesta-195"] += 1;
  if (P === "espacio") sc.studio += 3;
  if (P === "prof") sc["tango-225"] += 3, sc["tango-195"] += 2;
  if (P === "social") sc["fiesta-195"] += 3;
  if (P === "diseno") sc["minimalista-195"] += 3;
  const id = Object.entries(sc).sort((a, b) => b[1] - a[1])[0][0];
  return SPAS.find(x => x.id === id);
}

if (typeof module !== "undefined") module.exports = { WA_NUM, wa, A, esc, SPAS, BANERAS, RECEPT, plan, dims, parse, priceBtn, spaCard, famCard, quizResult, recommend };
