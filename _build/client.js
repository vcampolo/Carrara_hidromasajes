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
