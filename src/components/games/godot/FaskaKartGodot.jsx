import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaKartGodot() {
  return (
    <GodotGameEmbed
      title="Faska Kart Godot"
      src="/godot/faska-kart/index.html"
      controls="WASD/Pfeile fahren · Space Drift · Shift/E/Q Item · L Learncade · R Neustart"
    />
  );
}
