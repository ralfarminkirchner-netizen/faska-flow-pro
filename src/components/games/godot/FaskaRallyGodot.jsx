import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaRallyGodot() {
  return (
    <GodotGameEmbed
      title="Faska Rally Godot"
      src="/godot/faska-rally/index.html"
      controls="WASD/Pfeile fahren · Space Boost · L Learncade · R Neustart"
    />
  );
}
