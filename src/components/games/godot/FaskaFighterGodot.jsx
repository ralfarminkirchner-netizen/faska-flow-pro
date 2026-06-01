import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaFighterGodot() {
  return (
    <GodotGameEmbed
      title="Faska Fighter Pro"
      subtitle="Godot-4-1v1-Fighter mit Blocken, Low/Mid-Mixups, Dash, Supermeter, CPU-Druck, Fehler-Wiederholung und Learncade-Kristallen fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-fighter/index.html"
      controls="A/D oder Touch-Stick bewegen · W springen · S/zurueck/G blocken · J Jab · K Kick · U Low · I Super · Space Dash · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
