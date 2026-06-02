import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaParkourGodot() {
  return (
      <GodotGameEmbed
      title="Faska Parkour Pro"
      subtitle="Normaler Flow-Platformer zuerst: Coyote-Jump, Double-Jump, Dash, Wall-Kick, Grapple, Gegner-Stomps, Runen, Checkpoints, Flow-Multiplikator und optionale Learncade-Gates."
      src="/godot/faska-parkour/index.html"
      controls="A/D oder Touch-Stick laufen · W springen/Wall-Kick · Space Dash · J Grapple · K Angriff · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
