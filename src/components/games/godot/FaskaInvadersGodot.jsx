import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaInvadersGodot() {
  return (
    <GodotGameEmbed
      title="Faska Invaders Pro"
      src="/godot/faska-invaders/index.html"
      subtitle="Godot-4-Formation-Shooter mit Dive-Angriffen, Missionen, Medaillen, Deckungen, Eliten, Bossen, Heat, Dash, Charge-Beam, Overdrive, Powerups und Learncade-Antwortzielen."
      controls="A/D oder Pfeile fliegen · J Feuer · K halten Charge-Beam · Space Dash · I Overdrive · L Lernmodus · C Fach · R Neustart"
      fallbackPath="/game/space-invaders-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
