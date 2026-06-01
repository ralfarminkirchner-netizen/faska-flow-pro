import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaParkourGodot() {
  return (
    <GodotGameEmbed
      title="Faska Parkour Pro"
      subtitle="Godot-4-Flow-Platformer mit Coyote-Jump, Double-Jump, Dash, Grapple-Hooks, Gegner-Stomps, Checkpoints, Fehler-Wiederholung und Learncade-Gates fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-parkour/index.html"
      controls="A/D oder Touch-Stick laufen · W springen · Space Dash · J Grapple · K Angriff · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
