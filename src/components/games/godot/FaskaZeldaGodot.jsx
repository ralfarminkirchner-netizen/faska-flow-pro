import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaZeldaGodot() {
  return (
    <GodotGameEmbed
      title="Faska Zelda Pro"
      subtitle="16-Bit-Top-Down-Abenteuer mit normalem Quest-Modus, Truhen, Schluesseln, verriegelten Gates, Schwert, Schild, Dash, Bomben, Bosswaechter, Sternentor und zuschaltbaren Learncade-Schreinen fuer mehrere Faecher."
      src="/godot/faska-zelda/index.html"
      controls="WASD/Pfeile oder Joystick bewegen · J/Touch Hieb · K Schild · Space Dash · B Bombe · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
