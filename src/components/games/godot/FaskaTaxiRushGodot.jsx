import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaTaxiRushGodot() {
  return (
    <GodotGameEmbed
      title="Faska Taxi Rush Pro"
      subtitle="Godot-4-Crazy-Taxi mit Drift, Verkehr, Minimap, Wort-Fahrgaesten, Wiederholung falscher Aufgaben und Learncade-Auftraegen fuer Deutsch, Mathe und Englisch."
      src="/godot/faska-taxi-rush/index.html"
      controls="WASD/Pfeile fahren · Joystick links · Gas/Bremse/Drift/Boost rechts · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark starten"
    />
  );
}
