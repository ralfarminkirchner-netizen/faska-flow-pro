import { DEMO_EPISODE, CURRICULUM, OFFERS, TRACE_NODES, FALLBACK_ASSETS, FALLBACK_ACTIVITIES } from "./data.js";
import { auditAsset } from "./assets.js";
import { statementsHTML, curriculumHTML, ledgerHTML, offersHTML, selectedOfferHTML, activitiesHTML, assetSummaryHTML, assetsHTML, traceInspectorHTML } from "./ui.js";

const STORAGE_KEY = "faska.documentation.alpha.v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const today = () => new Date().toISOString().slice(0, 10);

const initialState = () => ({
  version: 1,
  episode: null,
  curriculum: Object.fromEntries(CURRICULUM.map((item) => [item.id, "proposed"])),
  offersOrder: OFFERS.map((item) => item.id),
  selectedOffer: null,
  effects: [],
  assetReviews: {},
  assetRights: {},
  assetAudits: {},
  ledger: [{ id: uid(), at: new Date().toISOString(), actor: "system", type: "AlphaOpened", message: "Lokale FASKA-Lernspuren-Alpha geöffnet; keine Cloud-Verbindung aktiv." }]
});

const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.version === 1 ? { ...initialState(), ...saved } : initialState();
  } catch {
    return initialState();
  }
};

let state = loadState();
let assets = FALLBACK_ASSETS;
let activities = FALLBACK_ACTIVITIES;
let toastTimer;

const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const record = (type, message, actor = "human", data = {}) => {
  state.ledger.push({ id: uid(), at: new Date().toISOString(), actor, type, message, data });
  if (state.ledger.length > 250) state.ledger = state.ledger.slice(-250);
  persist();
  renderLedgers();
};

const toast = (message) => {
  const element = $("#toast");
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 3400);
};

const showView = (name, focus = true) => {
  $$(".nav").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  $$('[data-panel]').forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name));
  if (focus) {
    const heading = document.querySelector(`[data-panel="${name}"] h1`);
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }
  history.replaceState({}, "", `#${name}`);
};

const downloadJSON = (name, value) => {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

const genericStructure = (original) => ({
  neutralObservation: original.trim(),
  childQuote: "Keine wörtliche Äußerung sicher extrahiert.",
  interpretation: "Diese lokale Alpha führt für freie Eingaben keine KI-Analyse aus. Eine spätere Modellantwort müsste als begrenzter, prüfbarer Vorschlag gespeichert werden.",
  alternatives: ["Weitere Kontextangaben könnten die Episode verändern.", "Die sichtbare Tätigkeit kann mehrere situative Erklärungen besitzen."],
  boundary: "Aus einer einzelnen, frei eingegebenen Episode dürfen keine stabilen Eigenschaften, Diagnosen oder Kompetenzstände abgeleitet werden."
});

function structureEpisode() {
  const original = $("#observation").value.trim();
  if (!original) {
    toast("Bitte zuerst eine konkrete Beobachtung eingeben.");
    return;
  }
  const demoLike = /Murmelbahn|Kugel|Karton/i.test(original);
  const structured = demoLike ? DEMO_EPISODE : genericStructure(original);
  state.episode = {
    id: state.episode?.id || uid(),
    createdAt: new Date().toISOString(),
    status: "draft",
    original,
    ...structured,
    source: {
      date: $("#observedAt").value || today(),
      place: $("#place").value.trim() || "nicht angegeben",
      people: $("#people").value.trim() || "nicht angegeben",
      role: $("#role").value
    },
    authorizedCurriculum: []
  };
  state.curriculum = Object.fromEntries(CURRICULUM.map((item) => [item.id, "proposed"]));
  persist();
  record("EpisodeDrafted", demoLike ? "Murmelbahn-Demo regelbasiert in Aussagearten getrennt." : "Freie Eingabe als unanalysierter Episodenentwurf gesichert.", "system-alpha", { episodeId: state.episode.id });
  renderEpisode();
  showView("episode");
  toast("Episodenentwurf erstellt. Alle Deutungen bleiben prüfbar.");
}

function renderEpisode() {
  const empty = $("#episodeEmpty");
  const content = $("#episodeContent");
  if (!state.episode) {
    empty.hidden = false;
    content.hidden = true;
    return;
  }
  empty.hidden = true;
  content.hidden = false;
  $("#statementCards").innerHTML = statementsHTML(state.episode);
  $("#curriculum").innerHTML = curriculumHTML(CURRICULUM, state.curriculum);
  const badge = $("#episodeStatus");
  badge.textContent = state.episode.status === "reviewed" ? "menschlich geprüft" : "Entwurf";
  badge.className = `pill ${state.episode.status === "reviewed" ? "accepted" : "draft"}`;
  renderLedgers();
}

function setCurriculumState(id, next) {
  if (!state.episode) return toast("Zuerst eine Episode strukturieren.");
  const item = CURRICULUM.find((candidate) => candidate.id === id);
  if (!item) return;
  state.curriculum[id] = next;
  if (state.episode.status === "reviewed") state.episode.status = "draft";
  persist();
  record("CurriculumCandidateReviewed", `${item.subject} ${item.code}: ${next}.`, "human", { candidateId: id, state: next });
  renderEpisode();
}

function openReview() {
  if (!state.episode) return toast("Noch keine Episode vorhanden.");
  $$(".reviewCheck").forEach((box) => { box.checked = false; });
  $("#confirmReview").disabled = true;
  const dialog = $("#reviewDialog");
  typeof dialog.showModal === "function" ? dialog.showModal() : dialog.setAttribute("open", "");
}

function confirmReview() {
  if (!state.episode || $$(".reviewCheck").some((box) => !box.checked)) return;
  state.episode.status = "reviewed";
  state.episode.reviewedAt = new Date().toISOString();
  state.episode.authorizedCurriculum = CURRICULUM.filter((item) => state.curriculum[item.id] === "accepted").map((item) => item.id);
  persist();
  record("EpisodeReviewed", `Episode menschlich geprüft; ${state.episode.authorizedCurriculum.length} Bildungsplanbezüge übernommen.`, "human");
  $("#reviewDialog").close?.();
  renderEpisode();
  toast("Episode als menschlich geprüft markiert.");
}

function renderLedgers() {
  const episodeEntries = state.episode ? state.ledger.filter((entry) => !entry.data?.episodeId || entry.data.episodeId === state.episode.id) : [];
  $("#episodeLedger").innerHTML = ledgerHTML(episodeEntries);
  $("#globalLedger").innerHTML = ledgerHTML(state.ledger);
}

function orderedOffers() {
  return state.offersOrder.map((id) => OFFERS.find((offer) => offer.id === id)).filter(Boolean);
}

function renderOffers() {
  $("#offerGrid").innerHTML = offersHTML(orderedOffers());
  const panel = $("#selectedOffer");
  const selected = OFFERS.find((offer) => offer.id === state.selectedOffer);
  panel.hidden = !selected;
  if (selected) panel.innerHTML = selectedOfferHTML(selected);
}

function selectOffer(id) {
  state.selectedOffer = id;
  persist();
  const offer = OFFERS.find((item) => item.id === id);
  if (offer) record("OfferSelected", `Erprobung geöffnet: ${offer.title}.`, "human", { offerId: id });
  renderOffers();
  $("#selectedOffer").scrollIntoView({ behavior: "smooth", block: "center" });
}

function prepareEffect() {
  const offer = OFFERS.find((item) => item.id === state.selectedOffer);
  if (!offer) return;
  const text = $("#effectText")?.value.trim();
  const response = $("#offerResponse")?.value || "accepted";
  if (!text) return toast("Bitte zuerst eine beobachtbare Reaktion oder Wirkung notieren.");
  const effect = { id: uid(), offerId: offer.id, response, observation: text, at: new Date().toISOString() };
  state.effects.push(effect);
  $("#observation").value = `${offer.title}: ${text}`;
  $("#observedAt").value = today();
  persist();
  record("EffectObservationPrepared", `Reaktion auf „${offer.title}“ als neue Episode vorbereitet (${response}).`, "human", { effectId: effect.id });
  showView("capture");
  $("#observation").focus();
  toast("Wirkungsbeobachtung als neue Episode vorbereitet.");
}

function renderTrace(nodeId = "revision") {
  const node = TRACE_NODES[nodeId] || TRACE_NODES.revision;
  $("#traceInspector").innerHTML = traceInspectorHTML(node);
  $$("#trace > button[data-node]").forEach((button) => button.classList.toggle("selected", button.dataset.node === nodeId));
  const usable = assets.find((asset) => state.assetReviews[asset.id] === "accepted" && state.assetRights[asset.id]);
  const animal = $("#traceAnimal");
  const animalTheme = $("#theme").value === "animal";
  animal.hidden = !(animalTheme && usable);
  animal.innerHTML = animalTheme && usable ? `<img src="${usable.path}" alt="${usable.name}">` : "";
  if (animalTheme && !usable) $("#traceCaption").textContent = "Tierwelt gewählt: Erst ein Motiv visuell freigeben und die Rechte bestätigen.";
  else $("#traceCaption").textContent = "Spurzusammenhang: Konstruktion → Überarbeitung → Erklärung → Umgebungsanpassung.";
}

async function loadCatalogs() {
  try {
    const response = await fetch("/catalog/learning-activities/deutsch-party-brett.json");
    if (response.ok) activities = [(await response.json()).activity];
  } catch { /* Offline-Fallback */ }
  try {
    const response = await fetch("/catalog/visual-assets/animal-friends.json");
    if (response.ok) assets = (await response.json()).assets;
  } catch { /* Offline-Fallback */ }
  renderActivities();
  renderAssets();
  renderTrace();
}

function renderActivities() {
  $("#activities").innerHTML = activitiesHTML(activities);
}

function renderAssets() {
  $("#assetSummary").innerHTML = assetSummaryHTML(assets, state.assetReviews, state.assetRights);
  $("#assetGrid").innerHTML = assetsHTML(assets, state.assetReviews, state.assetRights, state.assetAudits);
}

async function auditAllAssets() {
  const button = $("#auditAssets");
  button.disabled = true;
  button.textContent = "Prüfung läuft …";
  record("AssetAuditStarted", `${assets.length} Motive werden lokal vorgeprüft. Keine automatische Freigabe.`, "system-alpha");
  const results = await Promise.all(assets.map(async (asset) => [asset.id, await auditAsset(asset)]));
  state.assetAudits = { ...state.assetAudits, ...Object.fromEntries(results) };
  persist();
  renderAssets();
  record("AssetAuditCompleted", "Lokale Qualitätsindikatoren berechnet; menschliche Entscheidungen unverändert.", "system-alpha");
  button.disabled = false;
  button.textContent = "Vorprüfung erneut starten";
  toast("Vorprüfung abgeschlossen. Kein Motiv wurde automatisch akzeptiert.");
}

function reviewAsset(id, decision) {
  const asset = assets.find((item) => item.id === id);
  if (!asset) return;
  state.assetReviews[id] = decision;
  if (decision !== "accepted") state.assetRights[id] = false;
  persist();
  record("AssetReviewRecorded", `${asset.name}: ${decision}.`, "human", { assetId: id });
  renderAssets();
  renderTrace();
}

function toggleAssetRights(id) {
  const asset = assets.find((item) => item.id === id);
  if (!asset) return;
  if (state.assetReviews[id] !== "accepted" && !state.assetRights[id]) return toast("Zuerst die visuelle Freistellung als sauber prüfen.");
  const next = !state.assetRights[id];
  if (next && !confirm(`Bestätigst du für „${asset.name}“ die erforderlichen Nutzungsrechte für diese schulische Demo?`)) return;
  state.assetRights[id] = next;
  persist();
  record(next ? "AssetRightsConfirmed" : "AssetRightsWithdrawn", `${asset.name}: Rechtebestätigung ${next ? "gesetzt" : "zurückgenommen"}.`, "human", { assetId: id });
  renderAssets();
  renderTrace();
}

function resetDemo() {
  if (!confirm("Lokale Episoden, Entscheidungen, Prüfungen und das Ereignisprotokoll dieser Demo löschen?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = initialState();
  $("#observation").value = "N. hat aus Karton eine Murmelbahn gebaut. Die Kugel ist in der Kurve wiederholt herausgefallen. N. hat die Seitenwand dreimal verändert und einem anderen Kind erklärt, dass die Kugel nach außen drückt. Als mehrere Kinder kamen, wechselte N. den Tisch und baute dort weiter.";
  $("#observedAt").value = today();
  renderAll();
  showView("capture");
  toast("Lokale Demo zurückgesetzt.");
}

function renderAll() {
  renderEpisode();
  renderOffers();
  renderActivities();
  renderAssets();
  renderLedgers();
  renderTrace();
}

function bindEvents() {
  $$(".nav").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
  $("#newObservation").addEventListener("click", () => { showView("capture"); $("#observation").focus(); });
  $("#structure").addEventListener("click", structureEpisode);
  $("#speak").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) return toast("Sprachausgabe wird von diesem Browser nicht unterstützt.");
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance($("#observation").value);
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    speechSynthesis.speak(utterance);
  });
  $("#curriculum").addEventListener("click", (event) => {
    const button = event.target.closest("[data-curriculum-action]");
    if (button) setCurriculumState(button.dataset.curriculumId, button.dataset.curriculumAction);
  });
  $("#reviewEpisode").addEventListener("click", openReview);
  $$(".reviewCheck").forEach((box) => box.addEventListener("change", () => { $("#confirmReview").disabled = $$(".reviewCheck").some((item) => !item.checked); }));
  $("#confirmReview").addEventListener("click", confirmReview);
  $("#exportEpisode").addEventListener("click", () => state.episode ? downloadJSON(`faska-episode-${state.episode.id}.json`, { episode: state.episode, curriculum: state.curriculum, relevantEvents: state.ledger }) : toast("Noch keine Episode vorhanden."));
  $("#offerGrid").addEventListener("click", (event) => { const button = event.target.closest("[data-offer-id]"); if (button) selectOffer(button.dataset.offerId); });
  $("#selectedOffer").addEventListener("click", (event) => {
    if (event.target.closest("[data-clear-offer]")) { state.selectedOffer = null; persist(); renderOffers(); }
    if (event.target.closest("[data-prepare-effect]")) prepareEffect();
  });
  $("#shuffleOffers").addEventListener("click", () => { state.offersOrder = [...state.offersOrder].sort(() => Math.random() - 0.5); persist(); record("OfferSetReordered", "Die sechs Möglichkeiten wurden neu angeordnet; kein Gewinner wurde bestimmt.", "system-alpha"); renderOffers(); });
  $("#zoom").addEventListener("change", (event) => { $("#trace").dataset.zoom = event.target.value; record("ProjectionZoomChanged", `Zoom-Ebene: ${event.target.value}.`, "human"); });
  $("#theme").addEventListener("change", (event) => { $("#trace").dataset.theme = event.target.value; record("ProjectionThemeChanged", `Verkörperung: ${event.target.value}.`, "human"); renderTrace(); });
  $("#trace").addEventListener("click", (event) => { const button = event.target.closest("button[data-node]"); if (button) renderTrace(button.dataset.node); });
  $("#print").addEventListener("click", () => window.print());
  $("#auditAssets").addEventListener("click", auditAllAssets);
  $("#assetGrid").addEventListener("click", (event) => {
    const review = event.target.closest("[data-asset-review]");
    const rights = event.target.closest("[data-rights-toggle]");
    if (review) reviewAsset(review.dataset.assetId, review.dataset.assetReview);
    if (rights) toggleAssetRights(rights.dataset.assetId);
  });
  $("#downloadLedger").addEventListener("click", () => downloadJSON("faska-local-ledger.json", state.ledger));
  $("#reset").addEventListener("click", resetDemo);
}

async function init() {
  $("#observedAt").value = state.episode?.source?.date || today();
  if (state.episode) {
    $("#observation").value = state.episode.original;
    $("#place").value = state.episode.source.place;
    $("#people").value = state.episode.source.people;
    $("#role").value = state.episode.source.role;
  }
  bindEvents();
  renderAll();
  await loadCatalogs();
  const requested = location.hash.replace("#", "");
  if ($(`[data-panel="${requested}"]`)) showView(requested, false);
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) navigator.serviceWorker.register("./sw.js").catch(() => {});
}

init();
