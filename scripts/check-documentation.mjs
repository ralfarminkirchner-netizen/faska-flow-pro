#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const json = (path) => JSON.parse(read(path));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const requiredFiles = [
  "public/documentation/index.html",
  "public/documentation/styles.css",
  "public/documentation/app.js",
  "public/documentation/data.js",
  "public/documentation/ui.js",
  "public/documentation/assets.js",
  "public/documentation/sw.js",
  "public/documentation/manifest.webmanifest",
  "public/catalog/learning-activities/deutsch-party-brett.json",
  "public/catalog/visual-assets/animal-friends.json",
  "public/catalog/visual-assets/animal-friends-audit.json",
  "scripts/audit-animal-friends.py",
  "supabase/migrations/202607240001_faska_documentation_v0.sql"
];

for (const file of requiredFiles) check(existsSync(resolve(root, file)), `Fehlende Datei: ${file}`);

const index = read("public/documentation/index.html");
const app = read("public/documentation/app.js");
const ui = read("public/documentation/ui.js");
const data = read("public/documentation/data.js");
const migration = read("supabase/migrations/202607240001_faska_documentation_v0.sql");
const activity = json("public/catalog/learning-activities/deutsch-party-brett.json");
const animals = json("public/catalog/visual-assets/animal-friends.json");
const animalAudit = json("public/catalog/visual-assets/animal-friends-audit.json");
const manifest = json("public/documentation/manifest.webmanifest");

check(manifest.start_url === "/documentation/", "PWA start_url muss /documentation/ sein.");
check(manifest.scope === "/documentation/", "PWA scope muss /documentation/ sein.");
check(activity.activity.integrationMode === "external_adapter", "Legacy-Spiel muss external_adapter bleiben.");
check(activity.activity.evidence.runtime !== "confirmed", "Runtime darf ohne Laufzeittest nicht als bestätigt gelten.");
check(Array.isArray(activity.activity.prohibitedIntegration) && activity.activity.prohibitedIntegration.length >= 3, "Legacy-Manifest benötigt explizite Integrationsverbote.");
check(animals.collection.automaticAcceptance === false, "Animal Friends dürfen niemals automatisch akzeptiert werden.");
check(Array.isArray(animals.assets) && animals.assets.length === 11, "Animal-Friends-Katalog soll 11 bekannte Motive enthalten.");
check(animalAudit.automaticAcceptance === false, "Der technische Audit darf keine automatische Freigabe behaupten.");
check(animalAudit.summary?.total === 11, "Der technische Audit muss alle 11 Motive abdecken.");
check(animalAudit.summary?.candidate === 9 && animalAudit.summary?.rework === 2 && animalAudit.summary?.unavailable === 0, "Audit-Summary muss 9 technische Kandidaten, 2 Nachbearbeitungen und 0 fehlende Dateien ausweisen.");

const animalIds = animals.assets.map((asset) => asset.id);
const auditedAnimalIds = Object.keys(animalAudit.audits || {});
check(new Set(animalIds).size === animalIds.length, "Animal-Friends-IDs müssen eindeutig sein.");
check(auditedAnimalIds.length === animalIds.length && animalIds.every((id) => auditedAnimalIds.includes(id)), "Audit und Asset-Katalog müssen dieselben 11 Motive enthalten.");
for (const asset of animals.assets) {
  check(asset.reviewStatus === "review_required", `${asset.id}: initialer reviewStatus muss review_required sein.`);
  check(asset.rightsStatus === "creator_confirmation_required", `${asset.id}: Rechtebestätigung muss anfangs offen sein.`);
  check(asset.path.startsWith("/animal-friends/"), `${asset.id}: Pfad muss im getrennten Animal-Friends-Bereich liegen.`);
  check(animalAudit.audits?.[asset.id]?.humanDecisionRequired === true, `${asset.id}: technische Vorprüfung muss menschliche Entscheidung verlangen.`);
}
check(animalAudit.audits?.["ella-elefant"]?.recommendation === "rework", "Ella Elefant muss wegen des Saumindikators als Nachbearbeitung markiert bleiben.");
check(animalAudit.audits?.["balu-hund"]?.recommendation === "rework", "Balu Hund muss wegen des Saumindikators als Nachbearbeitung markiert bleiben.");
for (const id of animalIds.filter((item) => !["ella-elefant", "balu-hund"].includes(item))) {
  check(animalAudit.audits?.[id]?.recommendation === "candidate", `${id}: erwarteter technischer Kandidatenstatus fehlt.`);
}
check(app.includes('/catalog/visual-assets/animal-friends-audit.json'), "Die Alpha muss den versionierten technischen Audit laden.");
check(app.includes('audit.recommendation !== "candidate"'), "Die Alpha muss technisch auffällige Cutouts vor menschlicher Freigabe blockieren.");

const officialCurriculumUrls = [...data.matchAll(/url:\s*"([^"]+)"/g)].map((match) => match[1]);
check(officialCurriculumUrls.length >= 5, "Demo benötigt mindestens fünf begründete Curriculumkandidaten.");
for (const url of officialCurriculumUrls) {
  check(url.startsWith("https://www.bildungsplaene-bw.de/"), `Curriculumquelle ist nicht offiziell: ${url}`);
}

const usedIds = [...app.matchAll(/\$\("#([A-Za-z0-9_-]+)"\)/g)].map((match) => match[1]);
const staticAndGeneratedMarkup = `${index}\n${ui}`;
for (const id of new Set(usedIds)) {
  check(staticAndGeneratedMarkup.includes(`id="${id}"`), `DOM-ID #${id} wird verwendet, aber nicht in index.html oder ui.js erzeugt.`);
}

const forbiddenPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /OPENAI_API_KEY\s*=/,
  /Wahrscheinlichkeit\s+für\s+ADHS/i,
  /global(?:er|e)?\s+(?:Lern|Kompetenz|Entwicklungs)score/i
];
const scanned = [index, app, ui, data, migration, JSON.stringify(activity), JSON.stringify(animals), JSON.stringify(animalAudit)].join("\n");
for (const pattern of forbiddenPatterns) check(!pattern.test(scanned), `Verbotenes Muster gefunden: ${pattern}`);

const tables = [...migration.matchAll(/create table public\.([a-z0-9_]+)/g)].map((match) => match[1]);
const rlsTables = new Set([...migration.matchAll(/alter table public\.([a-z0-9_]+) enable row level security/g)].map((match) => match[1]));
for (const table of tables) check(rlsTables.has(table), `RLS fehlt für public.${table}`);

check(migration.includes("transition_events_append_only"), "Transition-Ledger benötigt Append-only-Trigger.");
check(migration.includes("automatic_acceptance boolean not null default false check (not automatic_acceptance)"), "Datenbank muss automatische Asset-Freigabe verhindern.");
check(index.includes("Episode ≠ Ereignis") && index.includes("Lehrplanbezug ≠ Kompetenznachweis"), "Schutzansicht muss die zentralen Nichtgleichsetzungen zeigen.");

if (failures.length) {
  console.error(`Dokumentationsprüfung fehlgeschlagen (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Dokumentationsprüfung bestanden: ${requiredFiles.length} Dateien, ${animals.assets.length} Tiermotive (${animalAudit.summary.candidate} technische Kandidaten, ${animalAudit.summary.rework} Nachbearbeitungen), ${tables.length} RLS-Tabellen.`);
