import generatedPremiumContent from "./premiumGameContent.js";

const optionSet = (answer, wrongs) => [...new Set([answer, ...wrongs])].slice(0, 4);

const collection = (id, label, icon, color, scene, rawItems) => ({
  id,
  label,
  icon,
  color,
  items: rawItems.map(([prompt, answer, wrongs, support, imageCue, challenge], index) => ({
    prompt,
    answer,
    options: optionSet(answer, wrongs),
    support,
    imageCue,
    scene,
    challenge: challenge || ["sehen", "denken", "handeln"][index % 3],
  })),
});

const deutsch = [
  collection("premium-bilderlesen", "Bilderlesen", "🖼️", "bg-orange-400", "language", [
    ["Im Bild steht eine Tasse auf dem Tisch. Welches Wort passt?", "Tasse", ["Tisch", "Fenster", "Schuh"], "Suche das Ding, das man halten kann.", "warme Tasse auf einem Holztisch", "Bildspur"],
    ["Ein Kind legt ein Buch in den Ranzen. Was passiert?", "Es packt ein Buch ein", ["Es gießt Blumen", "Es baut einen Turm", "Es schläft"], "Schau auf die Handlung.", "Buch und Ranzen", "Szenenlesen"],
    ["Auf der Wiese fliegt etwas Buntes. Welches Wort passt?", "Schmetterling", ["Stein", "Trommel", "Schal"], "Achte auf Flügel und Farben.", "bunter Schmetterling ueber Wiese", "Bildwort"],
    ["Neben der Lampe liegt ein Stift. Wo liegt der Stift?", "Neben der Lampe", ["Unter dem Bett", "Im Wasser", "Auf dem Dach"], "Das Ortswort ist wichtig.", "Stift neben kleiner Lampe", "Ortswort"],
    ["Ein roter Apfel liegt im Korb. Was ist rot?", "Der Apfel", ["Der Korb", "Das Blatt", "Der Tisch"], "Frage nach der Farbe.", "roter Apfel im Korb", "Detailblick"],
    ["Eine Glocke klingt leise. Welches Tun passt?", "klingt", ["rennt", "schwimmt", "malt"], "Suche das passende Verb.", "kleine goldene Glocke", "Verbspur"],
  ]),
  collection("premium-wortwerkstatt", "Wortwerkstatt", "🔤", "bg-rose-400", "language", [
    ["Welches Wort ist ein Nomen?", "Garten", ["laufen", "weich", "unter"], "Nomen kann man oft anfassen oder sich vorstellen.", "Garten mit Weg", "Wortart"],
    ["Welches Wort beschreibt, wie etwas ist?", "hell", ["Mond", "tanzt", "unter"], "Beschreibewoerter sind Adjektive.", "heller Mond", "Wortart"],
    ["Welches Wort sagt, was jemand tut?", "summt", ["Biene", "gelb", "die"], "Tu-Woerter sind Verben.", "Biene an Blume", "Verb"],
    ["Was ist ein zusammengesetztes Wort?", "Sonnenblume", ["Sonne", "Blume", "gelb"], "Zwei Woerter werden ein neues Wort.", "Sonnenblume", "Wortbau"],
    ["Welche Silben bauen Laterne?", "La-ter-ne", ["Lat-er-ne", "La-tern-e", "L-a-terne"], "Klopfe jede Silbe einmal.", "leuchtende Laterne", "Silben"],
    ["Welches Wort passt nicht in die Reihe?", "Trommel", ["Apfel", "Birne", "Banane"], "Drei Woerter gehoeren zum Obst.", "Obstkorb und Trommel", "Sortieren"],
  ]),
  collection("premium-geschichten", "Geschichtenpfad", "📚", "bg-violet-400", "language", [
    ["Mira findet einen verlorenen Handschuh. Was ist ein guter naechster Satz?", "Sie fragt, wem er gehoert.", ["Sie wirft ihn weg.", "Sie versteckt ihn.", "Sie malt ihn an."], "Eine Geschichte soll sinnvoll weitergehen.", "Handschuh auf Schulbank", "Erzaehlen"],
    ["Der Samen bekommt Wasser und Sonne. Was kommt als Naechstes?", "Ein kleiner Keim waechst.", ["Ein Fisch springt heraus.", "Der Schnee schmilzt im Zimmer.", "Eine Trommel klingt."], "Denke an Pflanzenwachstum.", "Samen mit Keim", "Reihenfolge"],
    ["Noa hoert ein Geraeusch hinter der Tuer. Welcher Satz macht neugierig?", "Leise oeffnet er die Tuer einen Spalt.", ["Er zaehlt bis zehn.", "Der Apfel ist rund.", "Die Schuhe sind blau."], "Ein spannender Satz fuehrt weiter.", "angelehnte Tuer mit Licht", "Spannung"],
    ["Im Satz fehlt ein Ende: Der Hund wedelt, weil ...", "er sich freut.", ["der Mond scheint.", "der Stein hart ist.", "das Buch liest."], "Das Ende soll zum Anfang passen.", "freudiger Hund", "Satzende"],
    ["Welche Ueberschrift passt zu einer Geschichte ueber Teilen?", "Der Baustein fuer zwei", ["Der schnelle Blitz", "Die kalte Suppe", "Das tiefe Meer"], "Eine Ueberschrift nennt den Kern.", "zwei Kinder mit Baustein", "Titel"],
    ["Was macht eine Geschichte freundlich?", "Figuren hoeren einander zu.", ["Alle schreien gleichzeitig.", "Niemand darf sprechen.", "Das Ende bleibt gemein."], "Freundlich heisst nicht langweilig.", "Kinderkreis", "Erzaehlton"],
  ]),
];

const mathe = [
  collection("premium-materialbank", "Materialbank", "🧮", "bg-amber-400", "math", [
    ["Drei Zehnerstaebe und vier Einer ergeben welche Zahl?", "34", ["43", "304", "7"], "Zehner zuerst, dann Einer.", "Montessori-Zehnerstaebe und Einer", "Perlen"],
    ["Zwei Hunderter, fuenf Zehner und sechs Einer ergeben?", "256", ["265", "526", "206"], "Lege die Stellen nebeneinander.", "Hunderterplatte und Zehner", "Stellenwert"],
    ["Welche Zahl ist um 10 groesser als 48?", "58", ["49", "38", "68"], "Nur die Zehnerstelle waechst.", "Zahlenleiter", "Zehnersprung"],
    ["Welche Zahl ist die Haelfte von 18?", "9", ["8", "10", "12"], "Teile 18 gerecht in zwei gleiche Gruppen.", "geteilte Perlen", "Halbieren"],
    ["Welche Aufgabe passt zu 4 Reihen mit je 3 Perlen?", "4 x 3", ["4 + 4", "3 - 4", "12 x 4"], "Reihen mal Perlen pro Reihe.", "Perlenrechteck", "Multiplikation"],
    ["Welche Zahl liegt zwischen 399 und 401?", "400", ["390", "410", "499"], "Zaehle genau einen Schritt weiter.", "Zahlenbruecke", "Nachbarzahl"],
  ]),
  collection("premium-knobelkarten", "Knobelkarten", "🧩", "bg-sky-400", "math", [
    ["Im Korb liegen 8 Muscheln. 3 kommen dazu. Wie viele sind es?", "11", ["10", "12", "5"], "Plus bedeutet: Es wird mehr.", "Muschelkorb", "Plus"],
    ["12 Kinder teilen sich in 3 gleiche Gruppen. Wie viele pro Gruppe?", "4", ["3", "6", "9"], "Jede Gruppe bekommt gleich viel.", "Gruppenkreise", "Teilen"],
    ["Welche Form hat genau sechs Ecken?", "Sechseck", ["Dreieck", "Kreis", "Quadrat"], "Zaehle die Ecken.", "Sechseck-Mosaik", "Geometrie"],
    ["Was ist laenger: 1 Meter oder 30 Zentimeter?", "1 Meter", ["30 Zentimeter", "beides gleich", "keins"], "Ein Meter sind 100 Zentimeter.", "Messband", "Messen"],
    ["Welche Zahl fehlt: 6, 12, 18, __, 30?", "24", ["20", "22", "26"], "Die Reihe springt immer um 6.", "Zahlentreppen", "Muster"],
    ["Welche Menge ist groesser?", "7 Sterne", ["5 Sterne", "beide gleich", "2 Sterne"], "Vergleiche die Anzahlen.", "Sternegruppen", "Vergleichen"],
  ]),
  collection("premium-formenatelier", "Formenatelier", "🔷", "bg-indigo-400", "math", [
    ["Welche Form passt zu einer Uhr?", "Kreis", ["Dreieck", "Wuerfel", "Pyramide"], "Der Rand ist rund.", "runde Uhr", "Formblick"],
    ["Welche Form passt zu einem Buchdeckel?", "Rechteck", ["Kugel", "Kreis", "Kegel"], "Zwei lange und zwei kurze Seiten.", "offenes Buch", "Alltagsform"],
    ["Welcher Koerper hat sechs gleiche Flaechen?", "Wuerfel", ["Kugel", "Zylinder", "Kegel"], "Denke an einen Spielwuerfel.", "Holzwuerfel", "Koerper"],
    ["Welche Form kann rollen und hat keine Ecke?", "Kugel", ["Quader", "Pyramide", "Wuerfel"], "Ein Ball kann rollen.", "Ball auf Teppich", "Koerper"],
    ["Welche Linie ist gerade?", "Lineal-Kante", ["Schneckenhaus", "Welle", "Spirale"], "Gerade heisst ohne Kurve.", "Lineal", "Linien"],
    ["Was passt zu Symmetrie?", "Beide Seiten sehen gleich aus.", ["Eine Seite fehlt.", "Alles ist durcheinander.", "Nur eine Ecke zaehlt."], "Falte ein Blatt in Gedanken.", "Schmetterlingsfluegel", "Symmetrie"],
  ]),
];

const sachunterricht = [
  collection("premium-forscherbilder", "Forscherbilder", "🔎", "bg-emerald-400", "world", [
    ["Ein Blatt hat braune, trockene Raender. Was braucht die Pflanze vielleicht?", "Wasser", ["Schnee", "Sand", "Laerm"], "Pflanzen brauchen Pflege.", "Pflanze mit trockenem Blatt", "Forschen"],
    ["Du siehst Spuren im weichen Boden. Was kann man tun?", "Genau beobachten", ["Darauf stampfen", "Wegwischen", "Schnell wegrennen"], "Forscher schauen ruhig und genau.", "Spuren im Matsch", "Beobachten"],
    ["Eine Schnecke hat ihr Haus dabei. Was schuetzt es?", "Den weichen Koerper", ["Die Sonne", "Den Regen", "Den Weg"], "Das Haus ist Schutz.", "Schnecke auf Blatt", "Tierwissen"],
    ["Warum sammeln Bienen Nektar?", "Sie machen daraus Nahrung.", ["Sie bauen Steine.", "Sie kochen Suppe.", "Sie malen Blumen."], "Bienen besuchen Blueten.", "Biene auf Bluete", "Naturkreislauf"],
    ["Was ist bei Gewitter sicherer?", "Drinnen bleiben", ["Unter einem Baum warten", "Im Wasser schwimmen", "Auf ein Feld laufen"], "Sicherheit kommt zuerst.", "Gewitter am Fenster", "Wetter"],
    ["Was hilft einem Igel im Herbst?", "Laubhaufen liegen lassen", ["Alle Blaetter wegsaugen", "Sehr laute Musik", "Kein Versteck"], "Manche Tiere brauchen ruhige Ecken.", "Laubhaufen", "Naturpflege"],
  ]),
  collection("premium-experimente", "Mini-Experimente", "🧪", "bg-cyan-400", "world", [
    ["Was pruefst du mit einer Lupe?", "Kleine Details", ["Laute Toene", "Geschmack", "Gewicht allein"], "Eine Lupe macht Kleines groesser.", "Lupe ueber Blatt", "Werkzeug"],
    ["Was passiert oft mit Eis in warmer Hand?", "Es schmilzt", ["Es wird groesser", "Es wird Holz", "Es klingt"], "Waerme veraendert Eis.", "Eiswuerfel", "Zustand"],
    ["Welche Frage passt zu einem Experiment?", "Was veraendert sich?", ["Wer gewinnt?", "Warum bin ich laut?", "Welche Farbe mag ich nie?"], "Forscherfragen sind genau.", "Experimenttisch", "Frage"],
    ["Was braucht ein Samen zum Wachsen?", "Erde, Wasser und Licht", ["Nur Dunkelheit", "Nur Steine", "Nur Papier"], "Pflanzen brauchen mehrere Dinge.", "Samenstation", "Wachsen"],
    ["Was zeigt ein Schatten?", "Wo Licht blockiert wird", ["Wie laut es ist", "Wie suess etwas ist", "Wie schwer Musik ist"], "Schatten entsteht durch Licht.", "Schattenfigur", "Licht"],
    ["Warum sortieren Forscher Fundstuecke?", "Damit sie Muster erkennen", ["Damit alles verschwindet", "Damit nichts passt", "Damit es lauter wird"], "Ordnen hilft beim Denken.", "Naturtablett", "Sortieren"],
  ]),
  collection("premium-weltreise", "Weltreise", "🗺️", "bg-lime-400", "world", [
    ["Wo lebt ein Kamel besonders gut?", "In trockenen warmen Gegenden", ["Im ewigen Eis", "Nur im Aquarium", "Im Baumhaus"], "Denke an Wasser, Waerme und Koerperbau.", "Wuestenszene", "Lebensraum"],
    ["Warum haben Fische Flossen?", "Zum Schwimmen", ["Zum Graben", "Zum Fliegen", "Zum Klettern"], "Flossen helfen im Wasser.", "klarer Teich", "Tierkoerper"],
    ["Was passt zum Wald?", "Baeume, Moos und viele Verstecke", ["Nur Sandduenen", "Nur Eisplatten", "Nur Ampeln"], "Ein Lebensraum hat typische Dinge.", "Waldlichtung", "Lebensraum"],
    ["Was veraendert sich im Fruehling?", "Viele Pflanzen treiben aus.", ["Alle Blaetter fallen.", "Seen frieren immer zu.", "Es wird jeden Tag dunkel."], "Fruehling ist Wachstumszeit.", "Fruehlingsknospen", "Jahreszeit"],
    ["Warum ist sauberes Wasser wichtig?", "Menschen, Tiere und Pflanzen brauchen es.", ["Nur Steine brauchen es.", "Es ist egal.", "Es macht Laerm."], "Wasser ist Lebensgrundlage.", "Bach mit Steinen", "Umwelt"],
    ["Was zeigt eine Karte?", "Orte und Wege", ["Gerueche", "Traeume", "Musik allein"], "Karten helfen beim Orientieren.", "bunte Karte", "Orientierung"],
  ]),
];

const ethik = [
  collection("premium-herzfragen", "Herzfragen", "💛", "bg-pink-400", "heart", [
    ["Ein Kind sagt: Ich will nicht mitmachen. Was ist achtsam?", "Nachfragen und die Grenze achten", ["Es auslachen", "Es schubsen", "Es zwingen"], "Ein Nein darf ernst genommen werden.", "ruhige Kindergruppe", "Grenze"],
    ["Jemand weint leise. Was kann helfen?", "Sanft fragen, ob Hilfe gewuenscht ist", ["Sofort anfassen", "Laut rufen", "Weglaufen"], "Trost braucht Erlaubnis und Ruhe.", "weiches Trostlicht", "Trost"],
    ["Du bist sehr wuetend. Was ist ein sicherer erster Schritt?", "Atmen und Abstand nehmen", ["Etwas werfen", "Jemanden beleidigen", "Alles kaputt machen"], "Gefuehle duerfen da sein, Handlungen brauchen Schutz.", "Atempause", "Selbstregulation"],
    ["Zwei Kinder wollen dasselbe Spielzeug. Was ist fair?", "Abwechseln oder gemeinsam planen", ["Wegreissen", "Verstecken", "Schimpfen"], "Fair heisst: Alle werden gesehen.", "Bausteine zwischen zwei Kindern", "Fairness"],
    ["Ein Geheimnis fuehlt sich schwer und unsicher an. Was ist gut?", "Mit einer vertrauten erwachsenen Person sprechen", ["Allein bleiben", "Nichts sagen duerfen", "Sich schuldig fuehlen"], "Bei Unsicherheit darf man Hilfe holen.", "Licht im Zimmer", "Sicherheit"],
    ["Was ist Mut?", "Etwas versuchen, obwohl es kribbelt", ["Nie Angst haben", "Immer gewinnen", "Andere klein machen"], "Mut und Angst koennen gleichzeitig da sein.", "kleine Buehne", "Mut"],
  ]),
  collection("premium-miteinander", "Miteinander-Werkstatt", "🤝", "bg-emerald-400", "heart", [
    ["Was zeigt gutes Zuhoeren?", "Blick, Ruhe und nachfragen", ["Unterbrechen", "Weglaufen", "Lachen"], "Zuhoeren ist ein Geschenk.", "Gespraechskreis", "Empathie"],
    ["Ein Fehler passiert. Was hilft beim Reparieren?", "Entschuldigen und neu versuchen", ["Leugnen", "Beschuldigen", "Wegschauen"], "Fehler koennen repariert werden.", "zerbrochener Turm wird neu gebaut", "Reparatur"],
    ["Was ist ein freundlicher Stopp-Satz?", "Stopp, ich moechte das nicht.", ["Du bist gemein!", "Ich hasse alles!", "Verschwinde fuer immer!"], "Klar und ruhig kann stark sein.", "Handzeichen", "Grenzwort"],
    ["Was macht eine Gruppe stark?", "Jede Person darf etwas beitragen", ["Nur eine Person bestimmt alles", "Niemand hoert zu", "Alle lachen ueber Fehler"], "Gemeinsam wird mehr moeglich.", "Teamteppich", "Kooperation"],
    ["Du merkst: Ich brauche Pause. Was darfst du tun?", "Eine Pause nehmen und Bescheid sagen", ["Einfach verschwinden", "Andere erschrecken", "Mich zwingen"], "Pausen helfen dem Nervensystem.", "Ruheinsel", "Achtsamkeit"],
    ["Was ist ein gutes Kompliment?", "Du hast dir Muehe gegeben.", ["Du bist nur gut, wenn du gewinnst.", "Alle anderen sind schlecht.", "Du musst perfekt sein."], "Komplimente koennen Druck vermeiden.", "Sonnenkarte", "Sprache"],
  ]),
  collection("premium-tiefe-fragen", "Tiefe Fragen", "🕯️", "bg-indigo-400", "heart", [
    ["Wenn etwas traurig ist: Darf Traurigkeit da sein?", "Ja, sie darf da sein und braucht Begleitung.", ["Nein, sie ist verboten.", "Nur Erwachsene duerfen traurig sein.", "Man muss sie wegdruecken."], "Gefuehle sind Signale, keine Fehler.", "kleine Kerze", "Gefuehl"],
    ["Was hilft, wenn Gedanken sehr laut werden?", "Langsam atmen und Hilfe holen", ["Alles allein schaffen muessen", "Noch schneller denken", "Sich verstecken fuer immer"], "Laute Gedanken brauchen oft Ruhe und Verbindung.", "Sternenhimmel", "Beruhigung"],
    ["Was kann man tun, wenn man sich schuldig fuehlt?", "Mit einer sicheren Person sprechen und sortieren", ["Sich selbst beschimpfen", "Nie wieder reden", "Alles vergessen muessen"], "Schuldgefuehle brauchen Klarheit, nicht Strafe.", "Gesprächsplatz", "Verstehen"],
    ["Was bedeutet Vertrauen?", "Ich darf sicher sein und ernst genommen werden.", ["Ich muss alles tun.", "Ich darf nie Nein sagen.", "Ich darf keine Fragen stellen."], "Vertrauen hat mit Sicherheit zu tun.", "Bruecke im Morgenlicht", "Sicherheit"],
    ["Was hilft nach einem Streit?", "Zeit, Zuhoeren und Wiedergutmachen", ["Gewinnen muessen", "Immer recht haben", "Nie mehr reden"], "Reparatur braucht manchmal kleine Schritte.", "reparierte Papierbruecke", "Konflikt"],
    ["Was kann Hoffnung sein?", "Ein kleiner naechster guter Schritt", ["Ein Zauber, der alles sofort loest", "Ein Befehl", "Ein Wettbewerb"], "Hoffnung darf klein anfangen.", "kleiner gruenender Samen", "Hoffnung"],
  ]),
];

const musik = [
  collection("premium-klangbilder", "Klangbilder", "🎨", "bg-fuchsia-400", "music", [
    ["Welcher Klang passt zu Regentropfen?", "Glockenspiel", ["Tuba", "Bassdrum", "Laute Hupe"], "Helle kurze Toene koennen tropfen.", "Regentropfen auf Fenster", "Klangbild"],
    ["Welches Instrument klingt oft gestrichen?", "Geige", ["Trommel", "Rassel", "Triangel"], "Der Bogen streicht ueber Saiten.", "Geige mit Bogen", "Instrument"],
    ["Was bedeutet piano in der Musik?", "leise", ["laut", "schnell", "hoeher"], "Piano heisst leise.", "leise Klangwelle", "Dynamik"],
    ["Was bedeutet forte?", "laut", ["langsam", "kurz", "traurig"], "Forte hat Kraft.", "kraeftige Klangwelle", "Dynamik"],
    ["Welcher Klang passt zu einem Wiegenlied?", "sanft und ruhig", ["hart und hektisch", "sehr schrill", "stampfend"], "Wiegenlieder beruhigen.", "Mond und Noten", "Stimmung"],
    ["Welches Instrument hat Tasten?", "Klavier", ["Floete", "Trommel", "Gitarre"], "Man drueckt Tasten.", "Klavier", "Instrument"],
  ]),
  collection("premium-rhythmuslabor", "Rhythmuslabor", "🥁", "bg-amber-400", "music", [
    ["Welches Muster passt: klatsch - pause - klatsch?", "ta - ruhe - ta", ["ta - ta - ta", "ruhe - ruhe - ta", "ta - ta - ruhe"], "Eine Pause ist auch Musik.", "Rhythmuskarten", "Rhythmus"],
    ["Was ist ein Takt?", "Ein geordneter Abschnitt in der Musik", ["Ein sehr lauter Ton", "Ein Instrument", "Ein Bild"], "Takte ordnen Musik.", "Taktstriche", "Ordnung"],
    ["Was macht ein Dirigent?", "Er gibt Einsatz und Tempo", ["Er malt die Wand", "Er stimmt nur die Trommel", "Er versteckt Noten"], "Haende zeigen viel.", "Dirigierbewegung", "Orchester"],
    ["Was bedeutet schneller werden?", "accelerando", ["piano", "legato", "staccato"], "Das Tempo nimmt zu.", "laufende Noten", "Tempo"],
    ["Was bedeutet langsam?", "adagio", ["forte", "presto", "laut"], "Adagio ist ruhig langsam.", "ruhiger Fluss", "Tempo"],
    ["Was ist eine Wiederholung im Rhythmus?", "Ein Muster kommt noch einmal", ["Alles ist neu", "Es wird still fuer immer", "Nur ein Ton bleibt"], "Muster helfen beim Mitmachen.", "Musterband", "Muster"],
  ]),
  collection("premium-orchester", "Orchesterreise", "🎻", "bg-rose-400", "music", [
    ["Welche Instrumentengruppe hat Saiten?", "Streicher", ["Blechblaeser", "Schlagwerk", "Tasten allein"], "Geige und Cello haben Saiten.", "Streichergruppe", "Familie"],
    ["Welche Gruppe bläst Luft durch ein Mundstueck?", "Blechblaeser", ["Streicher", "Schlagwerk", "Tasten"], "Trompete und Posaune gehoeren dazu.", "Trompete", "Familie"],
    ["Was gehoert zum Schlagwerk?", "Trommel", ["Floete", "Geige", "Cello"], "Man schlaegt, schuettelt oder streicht manche Schlaginstrumente.", "Trommelset", "Instrument"],
    ["Welche Stimme klingt meist tief?", "Bass", ["Sopran", "Fluesterstimme", "Pfeifen"], "Bass ist tief.", "tiefe Klanglinie", "Stimme"],
    ["Was ist ein Duett?", "Zwei musizieren zusammen", ["Vierzig schweigen", "Ein Ton allein", "Ein Bild klingt"], "Duo bedeutet zwei.", "zwei Musikstaender", "Ensemble"],
    ["Was ist Improvisieren?", "Musik im Moment erfinden", ["Alles auswendig vergessen", "Nie zuhoeren", "Nur die Uhr anschauen"], "Erfinden kann trotzdem aufmerksam sein.", "freie Noten", "Kreativitaet"],
  ]),
];

export const PREMIUM_GAME_CONTENT = {
  deutsch,
  mathe,
  sachunterricht,
  ethik,
  musik,
};

export const getPremiumCollections = (subject) => PREMIUM_GAME_CONTENT[subject] || [];

const generatedCollectionMeta = {
  deutsch: ["premium-sprachfundus", "Premium-Sprachfundus", "📚", "bg-orange-500", "language"],
  mathe: ["premium-zahlenfundus", "Premium-Zahlenfundus", "🧮", "bg-sky-500", "math"],
  sachunterricht: ["premium-forscherfundus", "Premium-Forscherfundus", "🔬", "bg-emerald-500", "world"],
  ethik: ["premium-herzfundus", "Premium-Herzfundus", "🫶", "bg-pink-500", "heart"],
  musik: ["premium-klangfundus", "Premium-Klangfundus", "🎼", "bg-fuchsia-500", "music"],
};

export const getGeneratedPremiumCollection = (subject) => {
  const items = generatedPremiumContent[subject] || [];
  const [id, label, icon, color, scene] = generatedCollectionMeta[subject] || ["premium-fundus", "Premium-Fundus", "✦", "bg-slate-600", "default"];

  return {
    id,
    label,
    icon,
    color,
    items: items.map((item, index) => ({
      ...item,
      prompt: item.prompt,
      answer: item.answer,
      options: optionSet(item.answer, item.options || []),
      support: item.support,
      imageCue: item.imageCue,
      scene: item.scene || scene,
      challenge: item.challenge || `premium-${index + 1}`,
    })),
  };
};

export const withPremiumCollections = (subject, baseCollections = []) => [
  ...baseCollections,
  ...getPremiumCollections(subject),
  getGeneratedPremiumCollection(subject),
];
