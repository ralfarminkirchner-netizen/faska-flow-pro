import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaSoulsGodot() {
  return (
    <GodotGameEmbed
      title="Faska Souls Pro"
      subtitle="Godot-4-Soulslike-Bossarena mit Normalmodus zuerst, Light/Heavy-Angriffen, Rollen-Iframes, Schildblock, Parry-Fenster, Riposte, Rally-Heal, Heilflaschen, Minions, Slash/Thrust/Slam-Telegraphs, Phasenwechsel und zuschaltbaren Learncade-Runen."
      src="/godot/faska-souls/index.html"
      controls="WASD/Pfeile oder Touch-Stick bewegen · J Light · U Heavy · K Block/Parry · Space Rolle · H Heilflasche · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/souls-react"
      fallbackLabel="Souls 2D starten"
    />
  );
}
