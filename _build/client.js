/* Interacciones del sitio (se agrega después de shared.js en assets/site.js) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Conversión de Google Ads: cualquier clic en un link de WhatsApp (también los que se generan después)
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (a && typeof gtag === "function") {
      gtag("event", "conversion", { send_to: "AW-18254020421/Z0RYCJ_yzNAcEMX-mIBE", value: 1.0, currency: "ARS" });
    }
  });

  // Menú móvil
  var mb = $("#menu-btn"), mn = $("#mnav");
  if (mb && mn) {
    mb.addEventListener("click", function () { mn.hidden = !mn.hidden; mb.setAttribute("aria-expanded", String(!mn.hidden)); });
    $$("a", mn).forEach(function (a) { a.addEventListener("click", function () { mn.hidden = true; mb.setAttribute("aria-expanded", "false"); }); });
  }

  // Ayudame a elegir
  var quiz = $("#quiz");
  if (quiz) {
    var run = function () {
      var v = function (n) { return quiz.querySelector('input[name="' + n + '"]:checked').value; };
      $("#quiz-res").innerHTML = quizResult(recommend(v("lugar"), +v("gente"), v("prio")));
    };
    quiz.addEventListener("change", run);
    quiz.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  // Filtro de spas por forma
  var sf = $("#spa-filter");
  if (sf) sf.addEventListener("click", function (e) {
    var b = e.target.closest("[data-f]"); if (!b) return;
    $$("[data-f]", sf).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    $("#spa-grid").innerHTML = SPAS.filter(function (s) { return b.dataset.f === "all" || s.forma === b.dataset.f; }).map(spaCard).join("");
  });

  // Buscador por medida (bañeras y receptáculos)
  var finder = $("#finder");
  if (finder) {
    var kind = finder.dataset.kind, list = kind === "banera" ? BANERAS : RECEPT;
    var g = $("#fam-grid"), fl = $("#fl"), fa = $("#fa"), res = $("#fres");
    var draw = function () {
      var L = +fl.value, W = +fa.value, on = L > 0 && W > 0, big = Math.max(L, W), small = Math.min(L, W);
      var shown = list.map(function (f) {
        return { f: f, fit: on ? f.s.filter(function (s) { var d = parse(s); return d[0] <= big && d[1] <= small; }) : null };
      });
      if (on) shown = shown.filter(function (x) { return x.fit.length; });
      g.innerHTML = shown.length ? shown.map(function (x) { return famCard(x.f, kind, x.fit); }).join("")
        : '<div class="empty" style="grid-column:1/-1">Ninguna de nuestras medidas entra en ' + big + " × " + small + ' cm. <a class="link" target="_blank" rel="noopener" href="' +
          esc(wa("Hola! Tengo un espacio de " + big + " × " + small + " cm para " + (kind === "banera" ? "una bañera" : "un receptáculo") + ". ¿Qué opción me recomiendan?")) +
          '">Consultanos</a> y te ayudamos a encontrar la mejor opción.</div>';
      res.textContent = !on ? "" : kind === "banera"
        ? shown.length + " familias tienen al menos una medida que entra en " + big + " × " + small + " cm (resaltadas)."
        : shown.length + " medidas entran en " + big + " × " + small + " cm.";
    };
    fl.addEventListener("input", draw); fa.addEventListener("input", draw);
    finder.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#fclear").addEventListener("click", function () { fl.value = ""; fa.value = ""; draw(); });
  }

  // Galería de la ficha
  $$(".thumbs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $("#gal-img").src = "assets/" + b.dataset.img + ".webp";
      $$(".thumbs button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
  });

  // Formulario de contacto (Formspree → gracias.html, que Google Ads mide como conversión)
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var prod = new URLSearchParams(location.search).get("producto");
    if (prod) {
      var sel = form.querySelector('select[name="producto"]'), msg = form.querySelector('textarea[name="mensaje"]');
      var cat = /^spa/i.test(prod) ? "Spa" : /^ba(ñ|n)era/i.test(prod) ? "Bañera" : /^recept/i.test(prod) ? "Receptáculo" : null;
      if (sel && cat) sel.value = cat;
      if (msg && !msg.value) msg.value = "Hola, quiero consultar el precio del " + prod + ".";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var btn = form.querySelector('button[type="submit"]'), orig = btn.textContent;
      btn.disabled = true; btn.textContent = "Enviando…"; status.className = "form-status"; status.textContent = "";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) { form.reset(); location.href = "gracias.html"; return; }
          return r.json().catch(function () { return {}; }).then(function (d) {
            status.classList.add("error");
            status.textContent = (d.errors && d.errors[0] && d.errors[0].message) || "Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp.";
          });
        })
        .catch(function () { status.classList.add("error"); status.textContent = "No se pudo enviar. Revisá tu conexión o escribinos por WhatsApp."; })
        .finally(function () { btn.disabled = false; btn.textContent = orig; });
    });
  }
})();

/* ---------- Configurador (personalizar.html) ---------- */
(function(){
/* Opcionales de bañera: lista oficial de Carrara. hidro:true = solo con hidromasaje. */
const OPC_BANERA=[
 {g:"Masaje y confort",items:[
  {id:"apoya",n:"Apoyacabeza",d:"Para descansar cómodo.",colors:["Blanco","Negro"],excl:"apoyajets"},
  {id:"apoyajets",n:"Apoyacabeza con jets cervicales",d:"Masaje directo en cuello y hombros.",hidro:true,excl:"apoya"},
  {id:"jet",n:"Jet adicional",d:"Más hidromasaje donde más lo querés.",hidro:true,qty:6}]},
 {g:"Grifería y llenado",items:[
  {id:"pico",n:"Pico de llenado",d:"Salida de agua para llenar la bañera."},
  {id:"alegro",n:"Grifería 2 llaves tipo Alegro",d:"Clásica, con agua fría y caliente."},
  {id:"transf",n:"Transferencia",d:"Pasa el agua del pico al duchador. Suma el duchador.",needs:"ducha"},
  {id:"ducha",n:"Duchador",d:"Ducha de mano para enjuagarte."}]},
 {g:"Agua y luz",items:[
  {id:"cascada",n:"Cascadas",d:"Caída de agua decorativa y relajante."},
  {id:"luces",n:"Luces subacuáticas 12 V",d:"Iluminación bajo el agua, de bajo voltaje."}]},
 {g:"Terminación e instalación",items:[
  {id:"desborde",n:"Desborde",d:"Evita que el agua rebalse."},
  {id:"puerta-al",n:"Puerta de inspección de aluminio",d:"Acceso rápido al equipo de hidromasaje.",hidro:true,excl:"puerta-ce"},
  {id:"puerta-ce",n:"Puerta de inspección para cerámica",d:"Se reviste con la misma cerámica del baño.",hidro:true,excl:"puerta-al"}]}
];
/* Opcionales de spa: CONFIRMAR con fábrica qué aplica a cada modelo. */
const OPC_SPA=[
 {g:"Confort",items:[
  {id:"apoya",n:"Apoyacabeza",d:"Para descansar cómodo.",colors:["Blanco","Negro"],excl:"apoyajets"},
  {id:"apoyajets",n:"Apoyacabeza con jets cervicales",d:"Masaje directo en cuello y hombros.",excl:"apoya"},
  {id:"jet",n:"Jet adicional",d:"Más hidromasaje donde más lo querés.",qty:6}]},
 {g:"Agua y luz",items:[
  {id:"cascada",n:"Cascadas",d:"Caída de agua decorativa y relajante."},
  {id:"luces",n:"Luces subacuáticas 12 V",d:"Iluminación bajo el agua, de bajo voltaje."}]}
];
const CFG={line:"banera",model:"minimalista",size:"",hidro:true,o:{},color:"Blanco",zona:""};
const cfgList=()=>CFG.line==="banera"?BANERAS:SPAS;
const cfgOpts=()=>CFG.line==="banera"?OPC_BANERA:OPC_SPA;
const cfgItem=id=>cfgOpts().flatMap(g=>g.items).find(x=>x.id===id);
const cfgModel=()=>cfgList().find(m=>m.id===CFG.model)||cfgList()[0];
const cfgImg=m=>CFG.line==="banera"?m.img:m.imgs[0];
const cfgSizes=m=>CFG.line==="banera"?m.s:[m.round?"Ø"+m.l:m.l+"×"+m.a];
const optOff=it=>CFG.line==="banera"&&it.hidro&&!CFG.hidro;
function cfgClean(){
  if(CFG.line==="spa")CFG.hidro=true;
  const valid=new Set(cfgOpts().flatMap(g=>g.items).filter(it=>!optOff(it)).map(it=>it.id));
  Object.keys(CFG.o).forEach(k=>{if(!valid.has(k))delete CFG.o[k]});
  const sz=cfgSizes(cfgModel()); if(!sz.includes(CFG.size))CFG.size=sz[0]||"";
}
function cfgChosen(){
  const out=[];cfgOpts().forEach(g=>g.items.forEach(it=>{const v=CFG.o[it.id];if(!v)return;
    out.push(it.n+(it.colors?` (${(v.color||it.colors[0]).toLowerCase()})`:"")+(it.qty?` × ${v.q||1}`:""))}));return out;
}
const cfgTitle=()=>(CFG.line==="banera"?"Bañera ":"Spa ")+cfgModel().n;
function cfgMsg(){
  const o=cfgChosen(),L=["Hola! Armé mi "+(CFG.line==="banera"?"bañera":"spa")+" en la web de Carrara:",
   `• Modelo: ${cfgTitle()}${CFG.size?" "+CFG.size+" cm":""}`];
  if(CFG.line==="banera")L.push(`• Hidromasaje: ${CFG.hidro?"Sí":"No"}`);
  L.push(`• Opcionales: ${o.length?o.join(", "):"ninguno"}`,`• Color: ${CFG.color}`);
  if(CFG.zona.trim())L.push(`• Localidad: ${CFG.zona.trim()}`);
  L.push("","¿Me pasan precio y plazo de entrega?");return L.join("\n");
}
function cfgOptHTML(it){
  const v=CFG.o[it.id],off=optOff(it),id="o-"+it.id;
  return `<label class="opt${off?" off":""}" for="${id}"><input type="checkbox" id="${id}" data-opt="${it.id}"${v?" checked":""}${off?" disabled":""}><b>${it.n}</b>
   <small>${off?"Solo con hidromasaje.":it.d}</small>
   ${v&&it.colors?`<span class="sub" role="group" aria-label="Color del apoyacabeza">${it.colors.map(c=>`<button type="button" data-col="${it.id}" data-v="${c}" aria-pressed="${(v.color||it.colors[0])===c}">${c}</button>`).join("")}</span>`:""}
   ${v&&it.qty?`<span class="qty"><button type="button" data-q="${it.id}" data-d="-1" aria-label="Uno menos">−</button><output>${v.q||1}</output><button type="button" data-q="${it.id}" data-d="1" aria-label="Uno más">+</button><span class="note">${(v.q||1)>1?"jets":"jet"}</span></span>`:""}</label>`;
}
function cfgSumHTML(){
  const m=cfgModel(),o=cfgChosen();
  return `<img src="${A(cfgImg(m))}" alt="${cfgTitle()} Carrara"><div class="bd"><div class="eyebrow">Tu configuración</div><h3>${cfgTitle()}</h3>
   <ul><li><span>Medida</span><b class="mono">${CFG.size?CFG.size+" cm":"A confirmar"}</b></li>
   ${CFG.line==="banera"?`<li><span>Hidromasaje</span><b>${CFG.hidro?"Sí":"No"}</b></li>`:""}
   <li><span>Color</span><b>${CFG.color}</b></li></ul>
   <div><div class="eyebrow" style="color:var(--muted);margin-bottom:6px">Opcionales (${o.length})</div>${o.length?`<ul style="border-top:0">${o.map(x=>`<li><b style="text-align:left">${x}</b></li>`).join("")}</ul>`:`<div class="empty-o">Todavía no sumaste opcionales.</div>`}</div>
   <label class="f" for="c-zona">Tu localidad (para el envío)<input id="c-zona" placeholder="Ej.: Quilmes" value="${esc(CFG.zona)}"></label>
   <a class="btn btn-wa" id="c-send" target="_blank" rel="noopener" href="${esc(wa(cfgMsg()))}">Pedir presupuesto por WhatsApp</a>
   <p class="note">Te mandamos precio y plazo de entrega directo de fábrica. Respondemos en el día.</p></div>`;
}
function cfgHTML(){
  cfgClean();const m=cfgModel(),isB=CFG.line==="banera",list=cfgList(),sz=cfgSizes(m);let n=1;const N=()=>String(n++).padStart(2,"0");
  return `<div class="cfg wrap"><form class="cfg-steps" id="cfg-form" novalidate>
   <section class="stp"><header><span class="k">${N()}</span><h3>¿Qué querés armar?</h3></header>
    <div class="seg" role="radiogroup" aria-label="Producto"><input type="radio" name="line" id="ln-b" value="banera"${isB?" checked":""}><label for="ln-b">Bañera</label><input type="radio" name="line" id="ln-s" value="spa"${!isB?" checked":""}><label for="ln-s">Spa</label></div></section>
   <section class="stp"><header><span class="k">${N()}</span><h3>Modelo</h3><span class="hint">${list.length} ${isB?"familias":"modelos"}</span></header>
    <div class="mgrid" role="radiogroup" aria-label="Modelo">${list.map(x=>`<input type="radio" name="model" id="md-${x.id}" value="${x.id}"${x.id===m.id?" checked":""}><label for="md-${x.id}"><img src="${A(isB?x.img:x.imgs[0])}" alt="" loading="lazy"><span>${x.n}</span></label>`).join("")}</div>
    ${isB?`<h4 style="margin-top:22px">Medida</h4>${sz.length?`<div class="opts" role="radiogroup" aria-label="Medida">${sz.map((x,i)=>`<input type="radio" name="size" id="sz-${i}" value="${x}"${x===CFG.size?" checked":""}><label for="sz-${i}" class="mono">${x}</label>`).join("")}</div>`:`<p class="note">Las medidas de este modelo te las confirmamos por WhatsApp.</p>`}
    <p class="note" style="margin-top:10px">¿No sabés cuál entra? <a class="link" href="baneras.html">Buscá por medida</a>.</p>`
    :`<p class="note" style="margin-top:14px"><span class="mono">${dims(m)}</span> · ${m.p}</p>`}</section>
   ${isB?`<section class="stp"><header><span class="k">${N()}</span><h3>Hidromasaje</h3></header>
    <div class="seg" role="radiogroup" aria-label="Hidromasaje"><input type="radio" name="hidro" id="hd-1" value="1"${CFG.hidro?" checked":""}><label for="hd-1">Con hidromasaje</label><input type="radio" name="hidro" id="hd-0" value="0"${!CFG.hidro?" checked":""}><label for="hd-0">Sin hidromasaje</label></div>
    <p class="note" style="margin-top:10px">Bomba, jets y comandos se arman en nuestra planta.</p></section>`:""}
   <section class="stp"><header><span class="k">${N()}</span><h3>Opcionales</h3><span class="hint">Sumá los que quieras</span></header>
    ${cfgOpts().map(g=>`<h4>${g.g}</h4><div class="olist">${g.items.map(cfgOptHTML).join("")}</div>`).join("")}</section>
   <section class="stp"><header><span class="k">${N()}</span><h3>Color</h3></header>
    <div class="seg" role="radiogroup" aria-label="Color"><input type="radio" name="color" id="cl-b" value="Blanco"${CFG.color==="Blanco"?" checked":""}><label for="cl-b">Blanco</label><input type="radio" name="color" id="cl-c" value="En color (a elegir de la paleta)"${CFG.color!=="Blanco"?" checked":""}><label for="cl-c">En color</label></div>
    <p class="note" style="margin-top:10px">${CFG.color==="Blanco"?"El blanco es el color de línea.":"Te mandamos la paleta disponible por WhatsApp junto con el presupuesto."}</p></section>
  </form>
  <aside class="cfg-sum" id="cfg-sum" aria-live="polite">${cfgSumHTML()}</aside></div>
  <div class="cfg-bar"><div class="t"><b>${cfgTitle()}${CFG.size?" "+CFG.size:""}</b>${cfgChosen().length} opcionales · ${CFG.color==="Blanco"?"Blanco":"En color"}</div><a class="btn btn-wa btn-sm" id="c-send2" target="_blank" rel="noopener" href="${esc(wa(cfgMsg()))}">Pedir presupuesto</a></div>`;
}
function bindCfg(){
  const box=document.getElementById("cfg-box");if(!box)return;
  const pre=new URLSearchParams(location.search).get("m");
  if(pre){const i=pre.indexOf("-"),line=pre.slice(0,i),id=pre.slice(i+1);
    if((line==="banera"||line==="spa")&&(line==="banera"?BANERAS:SPAS).some(x=>x.id===id)){CFG.line=line;CFG.model=id}}
  document.body.classList.add("on-cfg");
  const draw=()=>{const a=document.activeElement,fid=a&&box.contains(a)?a.id:null,dat=a&&box.contains(a)&&a.dataset?{...a.dataset}:null;
    box.innerHTML=cfgHTML();
    let el=fid&&document.getElementById(fid);
    if(!el&&dat&&(dat.q||dat.col))el=box.querySelector(dat.q?`[data-q="${dat.q}"][data-d="${dat.d}"]`:`[data-col="${dat.col}"][data-v="${dat.v}"]`);
    if(el)el.focus({preventScroll:true})};
  box.addEventListener("change",e=>{const t=e.target;
    if(t.name==="line"){CFG.line=t.value;CFG.model=cfgList()[0].id;CFG.o={};CFG.size=""}
    else if(t.name==="model"){CFG.model=t.value;CFG.size=""}
    else if(t.name==="size")CFG.size=t.value;
    else if(t.name==="hidro")CFG.hidro=t.value==="1";
    else if(t.name==="color")CFG.color=t.value;
    else if(t.dataset.opt){const id=t.dataset.opt,it=cfgItem(id);
      if(t.checked){CFG.o[id]={};if(it.excl)delete CFG.o[it.excl];if(it.needs&&!CFG.o[it.needs])CFG.o[it.needs]={}}
      else{delete CFG.o[id];cfgOpts().flatMap(g=>g.items).forEach(x=>{if(x.needs===id)delete CFG.o[x.id]})}}
    else return;
    draw()});
  box.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.q){e.preventDefault();const v=CFG.o[b.dataset.q],it=cfgItem(b.dataset.q);v.q=Math.min(it.qty,Math.max(1,(v.q||1)+ +b.dataset.d));draw()}
    else if(b.dataset.col){e.preventDefault();CFG.o[b.dataset.col].color=b.dataset.v;draw()}});
  box.addEventListener("input",e=>{if(e.target.id!=="c-zona")return;CFG.zona=e.target.value;
    const h=wa(cfgMsg());document.getElementById("c-send").href=h;document.getElementById("c-send2").href=h});
  draw();
}

bindCfg();
})();
