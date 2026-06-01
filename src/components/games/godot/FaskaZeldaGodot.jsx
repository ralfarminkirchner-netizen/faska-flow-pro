import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaZeldaGodot() {
  return (
    <GodotGameEmbed
      title="Faska Zelda Pro"
      subtitle="16-Bit-Top-Down-Abenteuer mit Schwert, Schild, Dash, Bomben, Bosswaechter, Sternentor, Fehler-Wiederholung und Learncade-Schreinen fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-zelda/index.html"
      controls="WASD/Pfeile oder Joystick bewegen · J/Touch Hieb · K Schild · Space Dash · B Bombe · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
