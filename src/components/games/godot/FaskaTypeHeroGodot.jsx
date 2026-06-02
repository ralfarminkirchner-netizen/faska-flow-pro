import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaTypeHeroGodot() {
  return (
    <GodotGameEmbed
      title="Faska Type Hero Pro"
      subtitle="Godot-4-Typing-Arcade mit Timing-Zonen, Perfect-/Great-Hits, Overdrive, Boss-Aufgabenketten, Silben-, Wortarten-, Mathe- und Lesephasen sowie Fehler-Wiederholung."
      src="/godot/faska-type-hero/index.html"
      controls="Buchstaben/Zahlen oder Touch-Tastatur tippen · Karte anklicken zum Fokussieren · Space Overdrive · Enter abschicken · Backspace korrigieren · L Lernmodus/Arcade · R Neustart"
      fallbackPath="/game/type-hero-react"
      fallbackLabel="Type Hero 2D starten"
    />
  );
}
