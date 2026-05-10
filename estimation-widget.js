/**
 * Havn Stays — Estimation widget (calculator + lead capture).
 *
 * Self-contained : renders form HTML, injects scoped CSS, binds events,
 * computes instant estimation, sends lead to /api/lead + Formsubmit (browser).
 *
 * Usage on any page :
 *   <link rel="stylesheet" href="/estimation-widget.css">
 *   <div id="estimation-widget"></div>
 *   <script src="/estimation-widget.js"></script>
 *
 * All CSS classes are prefixed `.ew-` to avoid host-page conflicts.
 * The widget uses an internal light palette regardless of host theme.
 */
(function () {
  "use strict";

  // ─── Domain data (mirrors scripts/marrakech_projector/build_template.py) ───
  const RATECARD = {
    palmeraie: [2050, 2750, 4400, 5600, 6950, 8300],
    medina:    [2750, 3650, 4750, 6000, 7500, 8950],
    hivernage: [1800, 2400, 3280, 4150, 4900, 5900],
    gueliz:    [1100, 1500, 1950, 2500, 3050, 3700],
    agdal:     [1700, 2270, 2950, 3750, 4650, 5550],
    targa:     [1300, 1700, 2800, 3550, 4400, 5300],
    ourika:    [2300, 3100, 4020, 6270, 7800, 9300],
    amelkis:   [1700, 2300, 4990, 6350, 7850, 9400],
    amizmiz:   [1300, 1700, 2800, 3550, 4400, 5300],
    fes:       [1300, 1700, 2800, 3550, 4400, 5300],
    barrage:   [1700, 2270, 2950, 3750, 4650, 5550],
    autre:     [1700, 2270, 2950, 3750, 4650, 5550],
  };
  const ZONE_LABELS = {
    palmeraie: "La Palmeraie", medina: "Médina", hivernage: "Hivernage",
    gueliz: "Guéliz / Centre-ville", agdal: "Agdal", targa: "Targa",
    amelkis: "Amelkis & Golf", ourika: "Route de l'Ourika",
    amizmiz: "Route d'Amizmiz", fes: "Route de Fès",
    barrage: "Route du Barrage", autre: "Marrakech (autre)"
  };
  const ZONES_BYPASS = ["taghazout", "agadir"];

  const AMENITIES = [
    { key: "private_pool", label: "Piscine privée",                  coef: 0.15, def: true  },
    { key: "heated_pool",  label: "Piscine chauffée",                coef: 0.10, def: false },
    { key: "aircon",       label: "Climatisation",                   coef: 0.05, def: true  },
    { key: "hammam",       label: "Hammam privatif",                 coef: 0.08, def: false },
    { key: "jacuzzi",      label: "Jacuzzi / spa",                   coef: 0.05, def: false },
    { key: "cinema",       label: "Salle de cinéma",                 coef: 0.07, def: false },
    { key: "gym",          label: "Salle de gym",                    coef: 0.04, def: false },
    { key: "tennis",       label: "Tennis ou padel",                 coef: 0.10, def: false },
    { key: "staff",        label: "Staff 24/7 (cuisinier+gardien)",  coef: 0.15, def: false },
    { key: "view",         label: "Vue Atlas / Palmeraie",           coef: 0.07, def: false },
    { key: "riad_charm",   label: "Architecture riad / kasbah",      coef: 0.08, def: false },
    { key: "garden",       label: "Jardin paysagé > 1000 m²",        coef: 0.05, def: true  },
  ];

  const DAYS_OCC = {
    "2": [22, 22, 26, 26, 21, 14, 12, 13, 18, 25, 25, 27],
    "3": [20, 21, 25, 25, 20, 13, 11, 12, 17, 24, 24, 26],
    "4": [18, 19, 23, 24, 18, 12, 10, 11, 16, 23, 23, 25],
    "5": [16, 17, 22, 22, 17, 11, 9,  10, 14, 21, 21, 24],
    "6": [14, 15, 20, 21, 15, 10, 8,  9,  13, 19, 19, 22],
    "7": [12, 13, 18, 19, 14, 9,  7,  8,  12, 17, 17, 20],
  };
  const SEASONALITY = [0.95, 1.05, 1.20, 1.25, 1.05, 0.70, 0.60, 0.65, 0.95, 1.20, 1.20, 1.40];
  const MED_PREMIUM = 0.35;
  const HIGH_PREMIUM = 0.35;

  // ─── HTML template ───
  const TEMPLATE = `
<div class="ew-card">
  <div class="ew-stepper">
    <div class="ew-step-dot ew-active" data-step="1"><span>1</span><em>Votre bien</em></div>
    <div class="ew-step-line" data-line="1"></div>
    <div class="ew-step-dot" data-step="2"><span>2</span><em>Amenities</em></div>
    <div class="ew-step-line" data-line="2"></div>
    <div class="ew-step-dot" data-step="3"><span>3</span><em>Résultat</em></div>
  </div>

  <form class="ew-form" novalidate>
    <!-- Step 1 -->
    <div class="ew-panel ew-active" data-panel="1">
      <h3 class="ew-h">Votre bien</h3>
      <p class="ew-sub">Données scrapées sur 384 villas Marrakech (mai 2026).</p>

      <label>Zone / Quartier
        <select name="zone" required>
          <option value="">Sélectionnez une zone</option>
          <option value="palmeraie">La Palmeraie</option>
          <option value="medina">Médina</option>
          <option value="hivernage">Hivernage</option>
          <option value="gueliz">Guéliz / Centre-ville</option>
          <option value="agdal">Agdal</option>
          <option value="targa">Targa</option>
          <option value="amelkis">Amelkis &amp; Golf</option>
          <option value="ourika">Route de l'Ourika</option>
          <option value="amizmiz">Route d'Amizmiz</option>
          <option value="fes">Route de Fès</option>
          <option value="barrage">Route du Barrage</option>
          <option value="autre">Autre (Marrakech)</option>
          <option disabled>── Souss-Massa ──</option>
          <option value="taghazout">Taghazout Bay</option>
          <option value="agadir">Agadir</option>
        </select>
      </label>

      <label>Type de bien
        <select name="propertyType" required>
          <option value="">Sélectionnez un type</option>
          <option value="villa">Villa</option>
          <option value="riad">Riad</option>
        </select>
      </label>

      <label>Nombre de chambres
        <select name="bedrooms" required>
          <option value="">Sélectionnez</option>
          <option value="2">2 chambres</option>
          <option value="3">3 chambres</option>
          <option value="4">4 chambres</option>
          <option value="5">5 chambres</option>
          <option value="6">6 chambres</option>
          <option value="7">7+ chambres</option>
        </select>
      </label>

      <div class="ew-bypass-box" data-bypass-box hidden>
        <b>Estimation Souss-Massa sur demande.</b><br>
        Notre calculateur instantané couvre actuellement Marrakech. Pour Taghazout Bay et Agadir, laissez-nous vos coordonnées — un expert vous envoie une estimation personnalisée sous 24h.
      </div>

      <div class="ew-nav">
        <button type="button" class="ew-btn ew-btn-primary" data-go="2">Suivant — Amenities</button>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="ew-panel" data-panel="2">
      <h3 class="ew-h">Standing &amp; amenities</h3>
      <p class="ew-sub">Coche les éléments présents — chacun ajuste l'ADR projeté.</p>
      <div class="ew-amen-grid" data-amen></div>
      <div class="ew-nav">
        <button type="button" class="ew-btn ew-btn-back" data-go="1">Retour</button>
        <button type="button" class="ew-btn ew-btn-primary" data-compute>Voir mon estimation</button>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="ew-panel" data-panel="3">
      <h3 class="ew-h">Votre estimation</h3>
      <p class="ew-sub" data-result-label>Basé sur 384 comparables Airbnb (mai 2026).</p>

      <div class="ew-result" data-result-block>
        <div class="ew-result-summary">
          <div class="ew-meta">
            <div class="ew-meta-row"><span>Zone</span><b data-fld="zone">—</b></div>
            <div class="ew-meta-row"><span>Type · Chambres</span><b data-fld="type">—</b></div>
            <div class="ew-meta-row"><span>ADR base marché</span><b data-fld="adrBase">—</b></div>
            <div class="ew-meta-row"><span>Multiplicateur amenities</span><b data-fld="mult">×1.00</b></div>
            <div class="ew-meta-row ew-meta-divider"><span>ADR effective</span><b data-fld="adrEff" class="ew-emphasis">—</b></div>
          </div>
          <div class="ew-occ">
            <div class="ew-occ-num" data-fld="occ">—</div>
            <div class="ew-occ-lbl">jours / an<br>d'occupation projetée</div>
          </div>
        </div>

        <div class="ew-chart-wrap">
          <div class="ew-chart-title">Saisonnalité — revenue brut par mois</div>
          <div data-chart></div>
          <div class="ew-chart-legend">
            <span><i class="ew-leg-low"></i>LOW</span>
            <span><i class="ew-leg-mid"></i>MEDIUM</span>
            <span><i class="ew-leg-high"></i>HIGH</span>
          </div>
        </div>

        <div class="ew-cards">
          <div class="ew-rc ew-rc-low">
            <div class="ew-rc-lbl">LOW</div>
            <div class="ew-rc-num" data-fld="low">—</div>
            <div class="ew-rc-sub">scénario conservateur</div>
          </div>
          <div class="ew-rc ew-rc-mid">
            <div class="ew-rc-lbl">MEDIUM</div>
            <div class="ew-rc-num" data-fld="med">—</div>
            <div class="ew-rc-sub" data-fld="medSub">scénario réaliste</div>
          </div>
          <div class="ew-rc ew-rc-high">
            <div class="ew-rc-lbl">HIGH</div>
            <div class="ew-rc-num" data-fld="high">—</div>
            <div class="ew-rc-sub">scénario optimiste</div>
          </div>
        </div>
      </div>

      <div class="ew-cta-box">
        <h4>Recevez le rapport détaillé par email</h4>
        <p>Saisonnalité mois par mois, comparables précis sur votre zone, charges &amp; rentabilité nette estimée. Un expert Havn Stays vous appelle dans les 24h pour affiner.</p>
      </div>

      <label>Nom complet
        <input type="text" name="fullName" placeholder="Votre nom" required>
      </label>
      <label>Email
        <input type="email" name="email" placeholder="votre@email.com" required>
      </label>
      <label>Téléphone / WhatsApp
        <input type="tel" name="phone" placeholder="+212 6 00 00 00 00" required>
      </label>
      <label>Message (optionnel)
        <textarea name="message" placeholder="Surface, année construction, particularités…"></textarea>
      </label>

      <div class="ew-honeypot" aria-hidden="true">
        <label>Website (laisser vide) <input type="text" name="website_url" tabindex="-1" autocomplete="off"></label>
      </div>

      <div class="ew-nav">
        <button type="button" class="ew-btn ew-btn-back" data-go="2">Retour</button>
        <button type="submit" class="ew-btn ew-btn-primary ew-btn-submit">Recevoir le rapport détaillé</button>
      </div>

      <p class="ew-disclaimer">L'estimation est indicative, basée sur les médianes Airbnb de votre zone et les multiplicateurs amenities. Une analyse précise (loyer optimal, calendrier, photos, listing) est offerte après contact.</p>
    </div>
  </form>
</div>
`;

  // ─── Mount ───
  function mount(target) {
    const root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) return;
    root.classList.add("ew-root");
    root.innerHTML = TEMPLATE;

    const $ = (sel, ctx = root) => ctx.querySelector(sel);
    const $$ = (sel, ctx = root) => Array.from(ctx.querySelectorAll(sel));
    const form = $(".ew-form");
    let currentStep = 1;
    let lastEstimation = null;

    // ── Build amenities grid
    const amenGrid = $("[data-amen]");
    AMENITIES.forEach((a) => {
      const wrap = document.createElement("label");
      wrap.className = "ew-amen-toggle" + (a.def ? " ew-active" : "");
      wrap.dataset.key = a.key;
      wrap.innerHTML =
        '<input type="checkbox" ' + (a.def ? "checked" : "") + '>' +
        '<span class="ew-check">✓</span>' +
        '<span class="ew-amen-label">' + a.label + '</span>' +
        '<span class="ew-amen-coef">+' + Math.round(a.coef * 100) + '%</span>';
      const cb = wrap.querySelector("input");
      cb.addEventListener("change", () => wrap.classList.toggle("ew-active", cb.checked));
      amenGrid.appendChild(wrap);
    });

    // ── Stepper navigation
    function goStep(n) {
      if (n > currentStep) {
        // Required field check on current step
        const required = $$(`[data-panel="${currentStep}"] [required]`);
        for (const el of required) {
          if (!el.value) {
            el.style.borderColor = "#e74c3c";
            el.focus();
            setTimeout(() => (el.style.borderColor = ""), 2000);
            return;
          }
        }
      }
      currentStep = n;
      $$("[data-panel]").forEach(p => p.classList.toggle("ew-active", parseInt(p.dataset.panel) === n));
      $$("[data-step]").forEach(d => {
        const sn = parseInt(d.dataset.step);
        d.classList.toggle("ew-active", sn === n);
        d.classList.toggle("ew-done", sn < n);
      });
      $$("[data-line]").forEach(l => {
        l.classList.toggle("ew-done", parseInt(l.dataset.line) < n);
      });
      // Scroll widget into view on mobile
      if (window.innerWidth < 768) {
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    $$("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => goStep(parseInt(btn.dataset.go)));
    });

    // ── Souss-Massa bypass
    const zoneSel = form.elements.zone;
    zoneSel.addEventListener("change", () => {
      const isBypass = ZONES_BYPASS.includes(zoneSel.value);
      $("[data-bypass-box]").hidden = !isBypass;
      const nextBtn = $('[data-panel="1"] [data-go="2"]');
      if (isBypass) {
        nextBtn.textContent = "Demander une estimation sur mesure";
        nextBtn.dataset.go = "3";
        $("[data-result-block]").style.display = "none";
        $("[data-result-label]").textContent =
          "Notre équipe analyse votre bien Souss-Massa et vous envoie une estimation personnalisée sous 24h.";
      } else {
        nextBtn.textContent = "Suivant — Amenities";
        nextBtn.dataset.go = "2";
        $("[data-result-block]").style.display = "";
        $("[data-result-label]").textContent =
          "Basé sur 384 comparables Airbnb (mai 2026).";
      }
    });

    // ── Helpers
    const fmtMad = n => Math.round(n).toLocaleString("fr-FR") + " MAD";
    const fmtEur = n => Math.round(n / 10.8).toLocaleString("fr-FR") + " €";

    // ── Compute & render result
    $("[data-compute]").addEventListener("click", () => {
      const zone = form.elements.zone.value;
      const propertyType = form.elements.propertyType.value;
      const bedroomsStr = form.elements.bedrooms.value;
      const bedrooms = bedroomsStr === "7" ? 7 : parseInt(bedroomsStr);
      if (!zone || !propertyType || !bedrooms) {
        goStep(1);
        return;
      }

      const checked = [];
      let multiplier = 1.0;
      AMENITIES.forEach(a => {
        const wrap = amenGrid.querySelector(`.ew-amen-toggle[data-key="${a.key}"]`);
        const cb = wrap.querySelector("input");
        if (cb.checked) {
          checked.push(a.key);
          multiplier *= 1 + a.coef;
        }
      });

      const rates = RATECARD[zone] || RATECARD.autre;
      const idx = Math.max(0, Math.min(5, bedrooms - 2));
      const adrBase = rates[idx];
      let adrEff = Math.round(adrBase * multiplier);
      if (propertyType === "riad") adrEff = Math.round(adrEff * 1.05);

      const days = DAYS_OCC[String(Math.min(7, Math.max(2, bedrooms)))];
      const totalDays = days.reduce((s, d) => s + d, 0);
      const weighted = days.reduce((s, d, i) => s + d * SEASONALITY[i], 0);

      const low = weighted * adrEff;
      const med = low * (1 + MED_PREMIUM);
      const high = med * (1 + HIGH_PREMIUM);

      const monthlyLow  = days.map((d, i) => d * adrEff * SEASONALITY[i]);
      const monthlyMed  = monthlyLow.map(v => v * (1 + MED_PREMIUM));
      const monthlyHigh = monthlyMed.map(v => v * (1 + HIGH_PREMIUM));

      lastEstimation = {
        zone, propertyType, bedrooms, amenities: checked,
        adr_base_mad: adrBase, adr_effective_mad: adrEff,
        amenity_multiplier: Math.round(multiplier * 1000) / 1000,
        nights_per_year: totalDays,
        low_annual_mad: Math.round(low),
        med_annual_mad: Math.round(med),
        high_annual_mad: Math.round(high),
      };

      const bedroomsLabel = bedrooms === 7 ? "7+" : String(bedrooms);
      $("[data-fld='zone']").textContent = ZONE_LABELS[zone] || zone;
      $("[data-fld='type']").textContent =
        (propertyType === "riad" ? "Riad" : "Villa") + " · " + bedroomsLabel + " chambres";
      $("[data-fld='adrBase']").textContent = fmtMad(adrBase) + " / nuit";
      $("[data-fld='mult']").textContent = "×" + multiplier.toFixed(2);
      $("[data-fld='adrEff']").textContent = fmtMad(adrEff) + " / nuit";
      $("[data-fld='occ']").textContent = totalDays + " j";
      $("[data-fld='low']").textContent = fmtMad(low);
      $("[data-fld='med']").textContent = fmtMad(med);
      $("[data-fld='high']").textContent = fmtMad(high);
      $("[data-fld='medSub']").textContent = "soit ~" + fmtEur(med) + " / an";
      $("[data-chart]").innerHTML = drawChart(monthlyLow, monthlyMed, monthlyHigh);

      goStep(3);
    });

    // ── Submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const required = $$(`[data-panel="3"] [required]`);
      for (const el of required) {
        if (!el.value) {
          el.style.borderColor = "#e74c3c";
          el.focus();
          setTimeout(() => (el.style.borderColor = ""), 2000);
          return;
        }
      }
      const btn = form.querySelector(".ew-btn-submit");
      const originalText = btn.textContent;
      btn.textContent = "Envoi en cours…";
      btn.disabled = true;

      const payload = Object.assign({
        full_name:   form.elements.fullName.value,
        email:       form.elements.email.value,
        phone:       form.elements.phone.value,
        message:     form.elements.message.value || null,
        website_url: form.elements.website_url.value || "",
      }, lastEstimation || {
        zone:          form.elements.zone.value,
        property_type: form.elements.propertyType.value,
        bedrooms:      parseInt(form.elements.bedrooms.value) || null,
      });

      const fmtStr = n => Math.round(Number(n) || 0).toLocaleString("fr-FR") + " MAD";
      const autoresponse = [
        "Bonjour " + (payload.full_name || "").split(" ")[0] + ",",
        "",
        "Merci pour votre demande d'estimation. Voici votre projection :",
        "",
        "  • Bien            : " + (payload.property_type || "—") + " · " + (payload.bedrooms || "?") + " chambres · " + (payload.zone || "—"),
        "  • ADR effective   : " + fmtStr(payload.adr_effective_mad) + " / nuit",
        "  • LOW    (conservateur) : " + fmtStr(payload.low_annual_mad) + " / an",
        "  • MEDIUM (réaliste)     : " + fmtStr(payload.med_annual_mad) + " / an",
        "  • HIGH   (optimiste)    : " + fmtStr(payload.high_annual_mad) + " / an",
        "",
        "Basé sur 384 comparables Airbnb (mai 2026) + amenities indiquées.",
        "Un expert Havn Stays vous contacte sous 24h pour affiner.",
        "",
        "Besoin d'un retour rapide ? hillal@medini-homes.com / WhatsApp",
        "",
        "L'équipe Havn Stays — https://havn-stays.com",
      ].join("\n");

      const fsFields = {
        Nom: payload.full_name, Email: payload.email, Telephone: payload.phone,
        Zone: payload.zone, Type: payload.property_type, Chambres: payload.bedrooms,
        Amenities: (payload.amenities || []).join(", "),
        "ADR effective": fmtStr(payload.adr_effective_mad),
        LOW: fmtStr(payload.low_annual_mad),
        MEDIUM: fmtStr(payload.med_annual_mad),
        HIGH: fmtStr(payload.high_annual_mad),
        Message: payload.message || "",
        _subject: "Nouveau lead Havn Stays — " + (payload.full_name || payload.email),
        _template: "table",
        _replyto: payload.email,
      };

      try {
        const calls = [
          fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
          fetch("https://formsubmit.co/ajax/hillal@medini-homes.com", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(Object.assign({}, fsFields, { _autoresponse: autoresponse })),
          }).catch(() => null),
          fetch("https://formsubmit.co/ajax/admin@medini-homes.com", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(Object.assign({}, fsFields, { _subject: fsFields._subject + " (cc)" })),
          }).catch(() => null),
        ];
        const [r] = await Promise.all(calls);
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.ok) {
          flash(root, "Merci ! Votre rapport détaillé est en route. On vous appelle sous 24h.", "ok");
          form.reset();
          AMENITIES.forEach(a => {
            const wrap = amenGrid.querySelector(`.ew-amen-toggle[data-key="${a.key}"]`);
            const cb = wrap.querySelector("input");
            cb.checked = a.def;
            wrap.classList.toggle("ew-active", a.def);
          });
          setTimeout(() => goStep(1), 1500);
        } else {
          throw new Error(data.error || "Erreur");
        }
      } catch (err) {
        flash(root, "Erreur d'envoi. Réessayez ou contactez-nous via WhatsApp.", "err");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // ─── Stacked monthly chart (SVG) ───
  function drawChart(low, med, high) {
    const W = 520, H = 180;
    const padL = 4, padR = 4, padT = 6, padB = 24;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const groupW = chartW / 12;
    const barW = groupW * 0.62;
    const labels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
    const max = Math.max.apply(null, high);
    const baseY = padT + chartH;
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">`;
    for (let i = 0; i < 12; i++) {
      const x = padL + i * groupW + (groupW - barW) / 2;
      const hLow  = (low[i] / max) * chartH;
      const hMed  = (med[i] / max) * chartH;
      const hHigh = (high[i] / max) * chartH;
      svg += `<rect x="${x.toFixed(1)}" y="${(baseY - hHigh).toFixed(1)}" width="${barW.toFixed(1)}" height="${(hHigh - hMed).toFixed(1)}" fill="#162230" rx="2"/>`;
      svg += `<rect x="${x.toFixed(1)}" y="${(baseY - hMed).toFixed(1)}" width="${barW.toFixed(1)}" height="${(hMed - hLow).toFixed(1)}" fill="#C5A55A"/>`;
      svg += `<rect x="${x.toFixed(1)}" y="${(baseY - hLow).toFixed(1)}" width="${barW.toFixed(1)}" height="${hLow.toFixed(1)}" fill="#F5F0EB"/>`;
      svg += `<text x="${(padL + i*groupW + groupW/2).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#999">${labels[i]}</text>`;
    }
    svg += `</svg>`;
    return svg;
  }

  // ─── Toast ───
  function flash(root, message, type) {
    let el = document.querySelector(".ew-flash");
    if (!el) {
      el = document.createElement("div");
      el.className = "ew-flash";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.dataset.type = type || "ok";
    el.classList.add("ew-flash-show");
    setTimeout(() => el.classList.remove("ew-flash-show"), 6000);
  }

  // ─── Auto-mount ───
  function autoMount() {
    document.querySelectorAll("[data-estimation-widget], #estimation-widget").forEach(mount);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }

  // Expose
  window.HavnEstimationWidget = { mount };
})();
