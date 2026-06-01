import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaTypeHeroGodot() {
  return (
    <GodotGameEmbed
      title="Faska Type Hero Pro"
      subtitle="Godot-4-Word-Blaster mit adaptiven Wortarten-, Mathe- und Lesephasen, Fehler-Wiederholung, Mastery-Anzeige, Focus-Burst, Prefix-Lock-on und Touch-Tastatur."
      src="/godot/faska-type-hero/index.html"
      controls="Buchstaben/Zahlen oder Touch-Tastatur tippen · Karte anklicken zum Fokussieren · Enter abschicken · Backspace korrigieren · L Lernmodus · R Neustart"
      fallbackPath="/game/type-hero-react"
      fallbackLabel="Type Hero 2D starten"
    />
  );
}
