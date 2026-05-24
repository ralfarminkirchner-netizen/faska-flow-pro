import { Compass, Grid3X3, RotateCw, Star } from "lucide-react";

export const QUEST_MIXER_MODES = [
  {
    id: "expedition",
    label: "Expedition",
    icon: Compass,
    color: "bg-emerald-500",
    description: "Wandere von Station zu Station.",
    target: 6,
  },
  {
    id: "puzzle",
    label: "Puzzle",
    icon: Grid3X3,
    color: "bg-amber-500",
    description: "Fülle das Aufgabenmosaik.",
    target: 8,
  },
  {
    id: "sternenlauf",
    label: "Sternenlauf",
    icon: Star,
    color: "bg-fuchsia-500",
    description: "Sammle eine helle Sternspur.",
    target: 7,
  },
  {
    id: "kartenwirbel",
    label: "Kartenwirbel",
    icon: RotateCw,
    color: "bg-sky-500",
    description: "Finde die richtige wirbelnde Karte.",
    target: 5,
  },
];
