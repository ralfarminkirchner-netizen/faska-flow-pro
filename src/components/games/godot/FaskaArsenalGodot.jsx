import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaArsenalGodot() {
  return (
    <GodotGameEmbed
      title="Faska Arsenal Pro"
      subtitle="Godot-4-Arena-Shooter nach Quake/Unreal-Prinzip mit schnellem Strafing, Dash-I-Frames, Flow-Multiplikator, Pulse/Scatter/Rail/Rocket, Stagger-Treffern, Seeker-Gegnern, Bossphasen, Rocket-Jumps, Jump-Pads, Mega-/Quad-Pickups, Kontrollpunkten und Learncade-Saeulen."
      src="/godot/faska-arsenal/index.html"
      controls="WASD/Pfeile strafen · Maus zielen · Klick/J/Space feuern · K/X Dash · C/Right Click Waffe · 1-4 Direktwahl · Shift Boost · L Learncade · F Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
