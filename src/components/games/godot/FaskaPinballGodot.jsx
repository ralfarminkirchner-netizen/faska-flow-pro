import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaPinballGodot() {
  return (
    <GodotGameEmbed
      title="Faska Pinball Pro"
      src="/godot/faska-pinball/index.html"
      subtitle="Godot-4-Flipper mit Ballphysik, Flippern, Bumpern, Dropbank, Ramp-/Orbit-Shots, Magnet-Lock, Multiball, Wizard-Jackpot und Learncade-Targets."
      controls="A/Links linker Flipper · D/Rechts rechter Flipper · Space Plunger · N Nudge · L Lernmodus · C Fach · R Neustart"
      fallbackPath="/game/pinball-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
