export const DEMO_EPISODE = {
  neutralObservation: "N. baute aus Karton eine Murmelbahn. Nachdem die Kugel in einer Kurve wiederholt herausfiel, veränderte N. die Seitenwand dreimal. Anschließend erklärte N. einem anderen Kind, die Kugel drücke in der Kurve nach außen und die Wand müsse höher sein. Nach dem Hinzukommen mehrerer Kinder wechselte N. den Arbeitsplatz und setzte die Tätigkeit dort fort.",
  childQuote: "Die Kugel drückt nach außen. Die Wand muss höher sein.",
  interpretation: "Die Episode könnte auf eine Verbindung von praktischem Erproben, Überarbeiten und sprachlichem Begründen hinweisen. Der selbst gewählte Ortswechsel könnte eine situative Strategie zur Fortsetzung der Tätigkeit gewesen sein.",
  alternatives: [
    "Der Ortswechsel könnte durch Platzmangel oder einen Materialkonflikt ausgelöst worden sein.",
    "Die Gruppe könnte einen eigenen Arbeitsplan unterbrochen haben.",
    "Die Veränderung der Seitenwand könnte durch Nachahmung, Zufall oder eine andere Beobachtung angeregt worden sein."
  ],
  boundary: "Aus dieser Episode dürfen weder eine stabile Eigenschaft, eine Diagnose noch ein allgemeiner Kompetenzstand von N. abgeleitet werden."
};

export const CURRICULUM = [
  {
    id: "su-bauten",
    subject: "Sachunterricht",
    code: "3.1.3.3",
    title: "Bauten und Konstruktionen",
    version: "BP2016",
    evidence: "N. konstruierte eine Murmelbahn und veränderte ein Bauteil nach beobachteter Wirkung.",
    url: "https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/SU/IK/1-2/03/03"
  },
  {
    id: "su-experimente",
    subject: "Sachunterricht",
    code: "3.1.6",
    title: "Experimente",
    version: "BP2016",
    evidence: "Die Kugel wurde wiederholt rollen gelassen; eine Bedingung wurde mehrfach verändert.",
    url: "https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/SU/IK/1-2/06"
  },
  {
    id: "ma-problemloesen",
    subject: "Mathematik",
    code: "2.3",
    title: "Probleme mathematisch lösen",
    version: "BP2016.V2 · 29.02.2024",
    evidence: "Ein wiederkehrendes Problem wurde praktisch untersucht und ein Lösungsweg mehrfach überarbeitet.",
    url: "https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/M.V2/PK/2.3"
  },
  {
    id: "ma-groessen",
    subject: "Mathematik",
    code: "3.1.2",
    title: "Mit Größen umgehen",
    version: "BP2016.V2 · 29.02.2024",
    evidence: "Wandhöhe und Kurvenform können als Größenbeziehungen sichtbar und messbar gemacht werden.",
    url: "https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/M.V2/IK/1-2/02"
  },
  {
    id: "de-sprechen",
    subject: "Deutsch",
    code: "2.1",
    title: "Sprechen und Zuhören",
    version: "BP2016.V2 · 29.02.2024",
    evidence: "N. erklärte einem anderen Kind eine beobachtete Wirkung und begründete eine Veränderung.",
    url: "https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/D.V2/PK/2.1"
  }
];

export const OFFERS = [
  {
    id: "compare-curves",
    kind: "build",
    title: "Zwei Kurven bauen",
    summary: "Zwei Formen werden praktisch verglichen, ohne eine richtige Lösung vorzugeben.",
    tags: ["Bauen", "Sachunterricht", "Revision"],
    setup: "Kartonstreifen, zwei Kugeln und leicht veränderbare Seitenwände bereitstellen. Die Ausgangsformen dürfen vom Kind selbst gewählt werden.",
    question: "Welche Veränderung wird gewählt, und was wird danach beobachtet?",
    boundary: "Aus der gewählten Bauweise wird keine allgemeine Begabung oder Lernpräferenz abgeleitet."
  },
  {
    id: "measure-walls",
    kind: "measure",
    title: "Wandhöhen untersuchen",
    summary: "Wandhöhen werden markiert oder gemessen und mit dem beobachteten Verlauf verbunden.",
    tags: ["Messen", "Mathematik", "Experiment"],
    setup: "Lineal, Klebestreifen und eine einfache Tabelle anbieten. Freie Skizzen bleiben gleichwertig möglich.",
    question: "Welche Mess- oder Vergleichsform wird selbstständig genutzt?",
    boundary: "Die Nutzung eines Messwerkzeugs ist kein umfassender Kompetenznachweis."
  },
  {
    id: "tell-the-build",
    kind: "language",
    title: "Bauweg erzählen",
    summary: "Aus Fotos, Skizzen oder Bauteilen kann eine Anleitung, Bildergeschichte oder Erklärung entstehen.",
    tags: ["Sprache", "Erzählen", "Dokumentieren"],
    setup: "Drei leere Karten, Stifte und optional Fotos des Bauwegs bereitlegen. Diktat oder Audioaufnahme zulassen.",
    question: "Welche Reihenfolge und welche Begründungen werden für die Darstellung gewählt?",
    boundary: "Schriftliche Länge wird nicht mit Verständnis gleichgesetzt."
  },
  {
    id: "move-the-curve",
    kind: "movement",
    title: "Die Kurve mit Körper oder Klang zeigen",
    summary: "Bewegung, Rhythmus oder Klang verkörpern Beschleunigung, Richtungswechsel und Begrenzung.",
    tags: ["Bewegung", "Musik", "Modell"],
    setup: "Freie Bodenfläche oder einfache Klanginstrumente anbieten; keine vorgeschriebene Choreografie.",
    question: "Welche Aspekte der Kugelbewegung werden hervorgehoben oder ausgelassen?",
    boundary: "Die Darstellung ist ein Modell und nicht mit dem physikalischen Vorgang identisch."
  },
  {
    id: "cooperative-track-game",
    kind: "social",
    title: "Kooperatives Bahnkarten-Spiel",
    summary: "Mehrere Kinder kombinieren Kurvenkarten und verhandeln, wie eine Kugelbahn fortgesetzt wird.",
    tags: ["Brettspiel", "Kooperation", "Planen"],
    setup: "Wenige kuratierte Bahnkarten, Tiermarker und eine gemeinsame Zielkarte verwenden. Es gibt keine versteckte Einzelwertung.",
    question: "Wie werden verschiedene Bauideen verbunden, getrennt oder verworfen?",
    boundary: "Kooperation wird situativ beobachtet und nicht als feste soziale Eigenschaft bewertet."
  },
  {
    id: "protected-pause",
    kind: "pause",
    title: "Ruhen lassen und später zurückkehren",
    summary: "Die Bahn bleibt sichtbar oder wird mit einem Wiederaufnahmeanker geparkt.",
    tags: ["Aufschub", "Re-Entry", "Nichtintervention"],
    setup: "Foto, letzter Stand, offene Frage und nächster möglicher Handgriff werden gemeinsam festgehalten.",
    question: "Wird die Tätigkeit später wieder aufgenommen, verändert oder bewusst beendet?",
    boundary: "Nicht-Wiederaufnahme wird nicht als Scheitern oder fehlendes Interesse interpretiert."
  }
];

export const TRACE_NODES = {
  source: { title: "Aus Karton bauen", text: "N. begann mit einer selbst gewählten Konstruktion aus Karton.", status: "direkt beobachtet", scope: "diese Episode" },
  revision: { title: "Dreimal verändern", text: "Die Seitenwand wurde nach wiederholtem Herausfallen der Kugel mehrfach verändert.", status: "direkt beobachtet", scope: "diese Episode" },
  explain: { title: "Vermutung erklären", text: "Eine beobachtete Wirkung wurde einem anderen Kind sprachlich erklärt.", status: "berichtete Äußerung", scope: "diese Episode" },
  context: { title: "Ort selbst wechseln", text: "Nach dem Hinzukommen weiterer Kinder wurde der Arbeitsplatz gewechselt und weitergebaut.", status: "direkt beobachtet", scope: "diese Episode" },
  question: { title: "Was trägt die Kurve?", text: "Offene Anschlussfrage für weitere Erkundungen; noch keine Aufgabe.", status: "Vorschlag", scope: "möglicher Anschluss" }
};

export const FALLBACK_ASSETS = [
  ["ella-elefant", "Ella Elefant"], ["pino-pinguin", "Pino Pinguin"], ["mika-katze", "Mika Katze"],
  ["balu-hund", "Balu Hund"], ["kiki-kaenguru", "Kiki Känguru"], ["bruno-baer", "Bruno Bär"],
  ["luna-hase", "Luna Hase"], ["fina-fuchs", "Fina Fuchs"], ["roni-waschbaer", "Roni Waschbär"],
  ["dari-reh", "Dari Reh"], ["nuri-fledermaus", "Nuri Fledermaus"]
].map(([id, name]) => ({ id, name, path: `/animal-friends/${id}.webp`, reviewStatus: "review_required", rightsStatus: "creator_confirmation_required" }));

export const FALLBACK_ACTIVITIES = [{
  id: "deutsch-party-brett",
  title: "Deutsch Party Brett",
  sourceRepository: "ralfarminkirchner-netizen/deutsch-party-brett",
  auditStatus: "candidate_runtime_test_required",
  summary: "Eigenständiges Sprach-Brettspiel mit modularen Minispielen; Anschluss nur über einen begrenzten Aktivitätsadapter.",
  learningDomains: ["Deutsch", "Sprechen", "Lesen", "Schreiben"],
  prohibitedIntegration: ["Punkte als Kompetenznachweis", "Übernahme von Spielprofilen in die Dokumentation"]
}];
