import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaSoulsGodot() {
  return (
    <GodotGameEmbed
      title="Faska Souls Pro"
      subtitle="Godot-4-Soulslike-Bossarena mit Rollen-Iframes, Schildblock, Konterfenster, Heilflaschen, Minions, Phasenwechsel und Learncade-Runen fuer Wortarten, Mathe, Satzbau und Englisch."
      src="/godot/faska-souls/index.html"
      controls="WASD/Pfeile oder Touch-Stick bewegen · J Angriff · K Block · Space Rolle · H Heilflasche · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/souls-react"
      fallbackLabel="Souls 2D starten"
    />
  );
}
