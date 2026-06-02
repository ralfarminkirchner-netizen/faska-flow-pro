import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaGadgetQuestGodot() {
  return (
    <GodotGameEmbed
      title="Faska Gadget Quest Pro"
      src="/godot/faska-gadget-quest/index.html"
      subtitle="Normaler Action-Platformer zuerst: Stomp, Dash-Hits, Wrench-Chain, Blaster, Hover, Grapple, Combo-Multiplikator und dreiphasiger Bossbot plus optionale Learncade-Terminals."
      controls="WASD/Pfeile laufen · Space/W springen/hovern · Shift/X Dash/Hit · J Wrench-Combo · K Blaster · G Grapple · E Kaufen/Terminal · L Learncade · C/Tab Fach · R Neustart"
      fallbackPath="/game/gadget-quest-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
