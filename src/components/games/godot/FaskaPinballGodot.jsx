import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaPinballGodot() {
  return (
    <GodotGameEmbed
      title="Faska Pinball Pro"
      src="/godot/faska-pinball/index.html"
      subtitle="Godot-4-Flipper mit Skill-Shot, Ball-Save, Combo-Fenster, laufenden Missionen, Dropbank, Ramp-/Orbit-Shots, Magnet-Lock, Multiball, Super-Jackpot, Nudge/Tilt-Risiko und Learncade-Missionen."
      controls="A/Links linker Flipper · D/Rechts rechter Flipper · Space Plunger/Skill-Shot · N Nudge mit Tilt-Risiko · L Lernmodus · C Fach · R Neustart"
      fallbackPath="/game/pinball-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
