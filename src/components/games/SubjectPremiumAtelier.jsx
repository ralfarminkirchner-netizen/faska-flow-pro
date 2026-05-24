import PremiumPictureBook from "../PremiumPictureBook";
import DeepLearningQuest from "./DeepLearningQuest";
import PremiumQuestBoard from "./PremiumQuestBoard";
import { SUBJECT_VARIANT_CONTENT } from "../../data/learningContent";
import { withPremiumCollections } from "../../data/premiumGamePack";

const SETTINGS = {
  deutsch: {
    picture: "deutsch",
    title: "Sprach-Premium-Atelier",
    accent: "bg-amber-500",
    scene: "Deutsch · Buchstabenlichtung",
  },
  mathe: {
    picture: "mathe",
    title: "Zahlen-Premium-Atelier",
    accent: "bg-sky-500",
    scene: "Mathe · Zahlenwerkstatt",
  },
  sachunterricht: {
    picture: "welt",
    title: "Forscher-Premium-Atelier",
    accent: "bg-emerald-500",
    scene: "Welt · Forscherpfad",
  },
  ethik: {
    picture: "miteinander",
    title: "Miteinander-Premium-Atelier",
    accent: "bg-pink-500",
    scene: "Miteinander · Herzgarten",
  },
  musik: {
    picture: "musik",
    title: "Klang-Premium-Atelier",
    accent: "bg-fuchsia-500",
    scene: "Musik · Klangnest",
  },
};

export default function SubjectPremiumAtelier({ subject, onCorrect, onWrong }) {
  const cfg = SETTINGS[subject] || SETTINGS.deutsch;
  const collections = withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject]);

  return (
    <div className="flex flex-col gap-7">
      <DeepLearningQuest
        subject={subject}
        title={cfg.title.replace("Premium-Atelier", "Denk-Abenteuer")}
        collections={collections}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
      <PremiumPictureBook scene={cfg.picture} />
      <PremiumQuestBoard
        title={cfg.title}
        collections={collections}
        accent={cfg.accent}
        scene={cfg.scene}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    </div>
  );
}
