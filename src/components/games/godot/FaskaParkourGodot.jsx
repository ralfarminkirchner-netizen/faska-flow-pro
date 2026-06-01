import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaParkourGodot() {
  return (
    <GodotGameEmbed
      title="Faska Parkour Pro"
      subtitle="Godot-4-Flow-Platformer mit Coyote-Jump, Double-Jump, Dash-Charges, Grapple-Hooks, Gegner-Stomps, Checkpoints und Learncade-Gates fuer Wortarten, Mathe, Satzbau und Lesen."
      src="/godot/faska-parkour/index.html"
      controls="A/D oder Touch-Stick laufen · W springen · Space Dash · J Grapple · K Angriff · L Learncade · C Fach · R Neustart"
    />
  );
}
