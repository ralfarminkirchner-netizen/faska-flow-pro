const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export { esc };

const statement = (kind, title, status, content, list = false) => `
  <section class="statement" data-kind="${esc(kind)}">
    <header><span>${esc(title)}</span><span class="pill ${kind}">${esc(status)}</span></header>
    ${list ? `<ul>${content.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p>${esc(content)}</p>`}
  </section>`;

export function statementsHTML(episode) {
  return `
    <div class="panel-head"><div><p class="eyebrow">Typentrennung</p><h2>Was ist welcher Aussageart zugeordnet?</h2></div><span class="pill ${episode.status === "reviewed" ? "accepted" : "draft"}">${episode.status === "reviewed" ? "menschlich geprüft" : "Entwurf"}</span></div>
    ${statement("observed", "Direkte Beobachtung", "beobachtet", episode.neutralObservation)}
    ${statement("quote", "Wörtliche Äußerung", "berichtete Rede", episode.childQuote)}
    ${statement("hypothesis", "Mögliche Deutung", "Hypothese", episode.interpretation)}
    ${statement("alternative", "Alternative Erklärungen", "offen", episode.alternatives, true)}
    ${statement("boundary", "Grenze", "darf nicht gefolgert werden", episode.boundary)}
    <div class="source"><strong>Quellenanker</strong><p>${esc(episode.source.role)} · ${esc(episode.source.date)} · ${esc(episode.source.place)}. Das Originaldiktat bleibt separat erhalten.</p></div>`;
}

export function curriculumHTML(candidates, states) {
  return candidates.map((item) => {
    const state = states[item.id] || "proposed";
    const label = state === "accepted" ? "übernommen" : state === "rejected" ? "verworfen" : "Kandidat";
    return `<article class="candidate" data-state="${state}">
      <div class="panel-head"><div><h3>${esc(item.subject)} · ${esc(item.code)}</h3><div class="meta">${esc(item.title)} · ${esc(item.version)}</div></div><span class="pill ${state === "accepted" ? "accepted" : state === "rejected" ? "rejected" : "proposal"}">${label}</span></div>
      <p class="evidence"><strong>Evidenz:</strong> ${esc(item.evidence)}</p>
      <p><a href="${esc(item.url)}" target="_blank" rel="noreferrer">Offizielle Quelle öffnen</a></p>
      <div class="actions"><button type="button" data-curriculum-action="accepted" data-curriculum-id="${item.id}">übernehmen</button><button type="button" data-curriculum-action="rejected" data-curriculum-id="${item.id}">verwerfen</button><button type="button" data-curriculum-action="proposed" data-curriculum-id="${item.id}">offenlassen</button></div>
    </article>`;
  }).join("");
}

export function ledgerHTML(entries = []) {
  if (!entries.length) return `<p class="muted">Noch keine lokalen Ereignisse.</p>`;
  return [...entries].reverse().map((entry) => `
    <div class="ledger-entry">
      <time datetime="${esc(entry.at)}">${esc(new Date(entry.at).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }))}</time>
      <strong>${esc(entry.type)}</strong>
      <span>${esc(entry.message)}</span>
    </div>`).join("");
}

export function offersHTML(offers) {
  return offers.map((offer, index) => `<article class="offer">
    <p class="eyebrow">Richtung ${index + 1} · ${esc(offer.kind)}</p>
    <h2>${esc(offer.title)}</h2>
    <p>${esc(offer.summary)}</p>
    <div class="tags">${offer.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
    <button class="primary small" type="button" data-offer-id="${offer.id}">als Erprobung öffnen</button>
  </article>`).join("");
}

export function selectedOfferHTML(offer) {
  return `<div class="panel-head"><div><p class="eyebrow">Gewählte Erprobung</p><h2>${esc(offer.title)}</h2></div><button class="secondary small" type="button" data-clear-offer>Auswahl lösen</button></div>
    <div class="offer-detail"><div><h3>Vorbereitete Umgebung</h3><p>${esc(offer.setup)}</p></div><div><h3>Beobachtungsfrage</h3><p>${esc(offer.question)}</p></div><div><h3>Grenze</h3><p>${esc(offer.boundary)}</p></div></div>
    <label>Spätere Wirkung oder Reaktion<textarea id="effectText" rows="3" placeholder="Nur Beobachtbares eintragen; Deutungen ausdrücklich markieren."></textarea></label>
    <div class="actions"><select id="offerResponse"><option value="accepted">angenommen</option><option value="adapted">verändert angenommen</option><option value="declined">nicht angenommen</option><option value="postponed">aufgeschoben</option></select><button class="primary" type="button" data-prepare-effect>Als neue Episode vorbereiten</button></div>`;
}

export function activitiesHTML(activities) {
  return activities.map((activity) => `<article class="activity"><div class="panel-head"><div><h3>${esc(activity.title)}</h3><p>${esc(activity.sourceRepository || "lokaler Katalog")}</p></div><span class="pill proposal">${esc(activity.auditStatus || "Kandidat")}</span></div><p>${esc(activity.summary || "")}</p><div class="tags">${(activity.learningDomains || []).map((tag) => `<span>${esc(tag)}</span>`).join("")}</div><p><strong>Trennung:</strong> ${(activity.prohibitedIntegration || []).map(esc).join(" · ")}</p></article>`).join("");
}

export function assetSummaryHTML(assets, reviews, rights) {
  const visual = assets.filter((asset) => reviews[asset.id] === "accepted").length;
  const confirmed = assets.filter((asset) => rights[asset.id]).length;
  const usable = assets.filter((asset) => reviews[asset.id] === "accepted" && rights[asset.id]).length;
  const rework = assets.filter((asset) => reviews[asset.id] === "rework").length;
  return `<span>${assets.length} Motive</span><span>${visual} visuell freigegeben</span><span>${confirmed} Rechte bestätigt</span><span>${usable} verwendbar</span><span>${rework} nachbearbeiten</span>`;
}

export function assetsHTML(assets, reviews, rights, audits) {
  return assets.map((asset) => {
    const review = reviews[asset.id] || asset.reviewStatus || "review_required";
    const audit = audits[asset.id];
    const rightsOk = Boolean(rights[asset.id]);
    const usable = review === "accepted" && rightsOk;
    return `<article class="asset" data-review="${review}">
      <div class="asset-image"><img src="${esc(asset.path)}" alt="${esc(asset.name)}" loading="lazy"></div>
      <div class="asset-body"><div class="panel-head"><div><h3>${esc(asset.name)}</h3><p class="muted">${usable ? "für Demo-Material verwendbar" : "noch nicht verwendbar"}</p></div><span class="pill ${review === "accepted" ? "accepted" : review === "rejected" ? "rejected" : "proposal"}">${esc(review)}</span></div>
      ${audit ? `<div class="metrics"><div class="metric">Transparenz: ${esc(audit.labels.transparency)}</div><div class="metric">Motivfläche: ${esc(audit.labels.visible)}</div><div class="metric">Randkontakt: ${esc(audit.labels.edge)}</div><div class="metric">Saumindikator: ${esc(audit.labels.halo)}</div></div><p class="muted">Vorprüfung: ${esc(audit.recommendation)}${audit.notes.length ? ` · ${esc(audit.notes.join(" "))}` : " · keine automatische Auffälligkeit"}</p>` : `<p class="muted">Noch nicht automatisch vorgeprüft.</p>`}
      <p class="muted">Rechte: ${rightsOk ? "menschlich bestätigt" : "Bestätigung erforderlich"}</p>
      <div class="asset-actions"><button type="button" data-asset-id="${asset.id}" data-asset-review="accepted">sauber</button><button type="button" data-asset-id="${asset.id}" data-asset-review="rework">nachbearbeiten</button><button type="button" data-asset-id="${asset.id}" data-asset-review="rejected">ablehnen</button><button type="button" data-asset-id="${asset.id}" data-rights-toggle>${rightsOk ? "Rechte zurücknehmen" : "Rechte bestätigen"}</button></div></div>
    </article>`;
  }).join("");
}

export function traceInspectorHTML(node) {
  return `<p class="eyebrow">Ausgewählter Knoten</p><h2>${esc(node.title)}</h2><p>${esc(node.text)}</p><dl><div><dt>Status</dt><dd>${esc(node.status)}</dd></div><div><dt>Quelle</dt><dd>Originaldiktat / Episodenentwurf</dd></div><div><dt>Geltungsbereich</dt><dd>${esc(node.scope)}</dd></div><div><dt>Revision</dt><dd>durch neue Episode möglich</dd></div></dl><div class="warning"><strong>Projektion ist nicht Person</strong><p>Die Bildsprache ist wählbar, rücksetzbar und keine Aussage darüber, wie ein Kind „ist“.</p></div>`;
}
