import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaGadgetQuestGodot() {
  return (
    <GodotGameEmbed
      title="Faska Gadget Quest Pro"
      src="/godot/faska-gadget-quest/index.html"
      subtitle="Ratchet-&-Astrobot-inspirierter Godot-Platformer mit Gadgets, Upgrades, Kisten, Gegnern, Bossbot, Ressourcen und faecherflexiblen Learncade-Terminals."
      controls="WASD/Pfeile laufen · Space/W springen/hovern · Shift/X Dash · J Wrench · K Blaster · G Grapple · E Kaufen/Terminal · L Learncade · C/Tab Fach · R Neustart"
      fallbackPath="/game/gadget-quest-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
