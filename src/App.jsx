import { lazy, Suspense, useState, useEffect } from "react";
import Landing from "./components/Landing";
import FaskaFlowApp from "./FaskaFlowApp";

const GameEngineHub = lazy(() => import("./components/games/GameEngineHub"));

// Liest die aktive "Welt" aus der URL.
// 'flow' | 'arcade' | null (= Startseite). Alte Links (?mode=game-engine) bleiben gültig.
const getWorldFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const app = params.get("app");
  if (app === "flow" || app === "arcade") return app;
  if (params.get("mode") === "game-engine") return "arcade";
  return null;
};

const setWorldInUrl = (world) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("mode"); // Alt-Parameter aufräumen
  if (world) {
    url.searchParams.set("app", world);
  } else {
    url.searchParams.delete("app");
    url.searchParams.delete("game");
  }
  window.history.pushState({}, "", url);
};

function ArcadeFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl font-bold animate-pulse">
      Lade Arcade …
    </div>
  );
}

export default function App() {
  const [world, setWorld] = useState(() => getWorldFromUrl());

  useEffect(() => {
    const sync = () => setWorld(getWorldFromUrl());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const go = (next) => {
    setWorldInUrl(next);
    setWorld(next);
  };

  if (world === "arcade") {
    return (
      <Suspense fallback={<ArcadeFallback />}>
        <GameEngineHub onExit={() => go(null)} />
      </Suspense>
    );
  }

  if (world === "flow") {
    return (
      <FaskaFlowApp
        onExitToHome={() => go(null)}
        onOpenArcade={() => go("arcade")}
      />
    );
  }

  return (
    <Landing
      onSelectFlow={() => go("flow")}
      onSelectArcade={() => go("arcade")}
    />
  );
}
