import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GRID_W = 11;
const GRID_H = 7;
const OBSTACLES = [
  { x: 4, y: 1 },
  { x: 6, y: 2 },
  { x: 2, y: 3 },
  { x: 8, y: 3 },
  { x: 9, y: 4 },
  { x: 5, y: 5 },
];

const SUBJECTS = ['Deutsch', 'Mathe', 'Englisch'];
const GAMES = [
  { id: 'taxi', label: 'Wort-Taxi', hint: 'Fahre zum Wort, dann zur passenden Antwort.' },
  { id: 'sort', label: 'Sortier-Dojo', hint: 'Ordne Karten in die richtige Gruppe.' },
  { id: 'sentence', label: 'Satzwerkstatt', hint: 'Baue Saetze oder Gleichungen in der richtigen Reihenfolge.' },
  { id: 'blitz', label: 'Blitzduell', hint: 'Kurze Fragen, direkte Rueckmeldung, Fehler kommen wieder.' },
];

const NORMAL_TAXI = [
  {
    id: 'arcade-park',
    passenger: 'Passagier',
    prompt: 'Bringe den Passagier zum Park.',
    pickup: { x: 1, y: 5 },
    zones: [
      { id: 'park', label: 'Park', x: 9, y: 1, correct: true },
      { id: 'markt', label: 'Markt', x: 2, y: 1 },
      { id: 'kino', label: 'Kino', x: 8, y: 5 },
    ],
  },
  {
    id: 'arcade-kino',
    passenger: 'Passagier',
    prompt: 'Bringe den Passagier zum Kino.',
    pickup: { x: 9, y: 5 },
    zones: [
      { id: 'schule', label: 'Schule', x: 1, y: 1 },
      { id: 'kino', label: 'Kino', x: 5, y: 1, correct: true },
      { id: 'park', label: 'Park', x: 9, y: 1 },
    ],
  },
];

const TAXI_TASKS = {
  Deutsch: [
    {
      id: 'de-leise',
      passenger: 'leise',
      prompt: 'Setze "leise" an die passende Stelle.',
      sentence: 'Mila liest leise im Zimmer.',
      pickup: { x: 1, y: 5 },
      zones: [
        { id: 'before', label: '__ Mila liest im Zimmer.', x: 2, y: 1 },
        { id: 'after-verb', label: 'Mila liest __ im Zimmer.', x: 8, y: 1, correct: true },
        { id: 'end', label: 'Mila liest im Zimmer __.', x: 8, y: 5 },
      ],
    },
    {
      id: 'de-hund',
      passenger: 'der Hund',
      prompt: 'Setze das Subjekt an die richtige Stelle.',
      sentence: 'Der Hund bellt im Garten.',
      pickup: { x: 9, y: 5 },
      zones: [
        { id: 'subject', label: '__ bellt im Garten.', x: 2, y: 1, correct: true },
        { id: 'middle', label: 'bellt __ im Garten.', x: 7, y: 1 },
        { id: 'end', label: 'bellt im Garten __.', x: 8, y: 5 },
      ],
    },
    {
      id: 'de-blau',
      passenger: 'blauen',
      prompt: 'Setze das Adjektiv vor das Nomen.',
      sentence: 'Tom malt einen blauen Stern.',
      pickup: { x: 1, y: 1 },
      zones: [
        { id: 'before-noun', label: 'Tom malt einen __ Stern.', x: 9, y: 1, correct: true },
        { id: 'after-noun', label: 'Tom malt einen Stern __.', x: 4, y: 5 },
        { id: 'start', label: '__ Tom malt einen Stern.', x: 9, y: 5 },
      ],
    },
  ],
  Mathe: [
    {
      id: 'ma-14',
      passenger: '14',
      prompt: 'Fahre das Ergebnis von 8 + 6 zum Ziel.',
      sentence: '8 + 6 = 14',
      pickup: { x: 1, y: 5 },
      zones: [
        { id: '12', label: '12', x: 2, y: 1 },
        { id: '14', label: '14', x: 8, y: 1, correct: true },
        { id: '16', label: '16', x: 8, y: 5 },
      ],
    },
    {
      id: 'ma-7',
      passenger: '7',
      prompt: 'Fahre das Ergebnis von 21 : 3 zum Ziel.',
      sentence: '21 : 3 = 7',
      pickup: { x: 9, y: 5 },
      zones: [
        { id: '6', label: '6', x: 1, y: 1 },
        { id: '7', label: '7', x: 5, y: 1, correct: true },
        { id: '9', label: '9', x: 9, y: 1 },
      ],
    },
    {
      id: 'ma-45',
      passenger: '45',
      prompt: 'Fahre das Ergebnis von 5 x 9 zum Ziel.',
      sentence: '5 x 9 = 45',
      pickup: { x: 1, y: 1 },
      zones: [
        { id: '35', label: '35', x: 8, y: 1 },
        { id: '40', label: '40', x: 4, y: 5 },
        { id: '45', label: '45', x: 9, y: 5, correct: true },
      ],
    },
  ],
  Englisch: [
    {
      id: 'en-apple',
      passenger: 'apple',
      prompt: 'Fahre die englische Uebersetzung von "Apfel" zum Ziel.',
      sentence: 'Apfel = apple',
      pickup: { x: 1, y: 5 },
      zones: [
        { id: 'apple', label: 'apple', x: 2, y: 1, correct: true },
        { id: 'school', label: 'school', x: 8, y: 1 },
        { id: 'blue', label: 'blue', x: 8, y: 5 },
      ],
    },
    {
      id: 'en-run',
      passenger: 'run',
      prompt: 'Fahre "rennen" zur englischen Antwort.',
      sentence: 'rennen = run',
      pickup: { x: 9, y: 5 },
      zones: [
        { id: 'read', label: 'read', x: 1, y: 1 },
        { id: 'run', label: 'run', x: 5, y: 1, correct: true },
        { id: 'rain', label: 'rain', x: 9, y: 1 },
      ],
    },
    {
      id: 'en-yellow',
      passenger: 'yellow',
      prompt: 'Fahre "gelb" zur englischen Antwort.',
      sentence: 'gelb = yellow',
      pickup: { x: 1, y: 1 },
      zones: [
        { id: 'young', label: 'young', x: 8, y: 1 },
        { id: 'yellow', label: 'yellow', x: 4, y: 5, correct: true },
        { id: 'yesterday', label: 'yesterday', x: 9, y: 5 },
      ],
    },
  ],
};

const SORT_TASKS = {
  Deutsch: [
    { id: 'sort-de-1', card: 'springen', prompt: 'Welche Wortart ist das?', answer: 'Verb', choices: ['Nomen', 'Verb', 'Adjektiv'] },
    { id: 'sort-de-2', card: 'freundlich', prompt: 'Welche Wortart ist das?', answer: 'Adjektiv', choices: ['Nomen', 'Verb', 'Adjektiv'] },
    { id: 'sort-de-3', card: 'die Bruecke', prompt: 'Welche Wortart ist das?', answer: 'Nomen', choices: ['Nomen', 'Verb', 'Adjektiv'] },
    { id: 'sort-de-4', card: 'Schneeball', prompt: 'Was ist das?', answer: 'Kompositum', choices: ['Verb', 'Kompositum', 'Fragewort'] },
  ],
  Mathe: [
    { id: 'sort-ma-1', card: '18', prompt: 'Welche Aussage passt?', answer: 'gerade Zahl', choices: ['ungerade Zahl', 'gerade Zahl', 'kleiner als 10'] },
    { id: 'sort-ma-2', card: '7 x 4', prompt: 'Wohin gehoert das?', answer: 'Term', choices: ['Ergebnis', 'Term', 'Einheit'] },
    { id: 'sort-ma-3', card: '1/2', prompt: 'Welche Gruppe passt?', answer: 'Bruch', choices: ['Bruch', 'Primzahl', 'Subtraktion'] },
    { id: 'sort-ma-4', card: '100 cm', prompt: 'Welche Gruppe passt?', answer: 'Laenge', choices: ['Gewicht', 'Zeit', 'Laenge'] },
  ],
  Englisch: [
    { id: 'sort-en-1', card: 'house', prompt: 'Was bedeutet das?', answer: 'Haus', choices: ['Hund', 'Haus', 'heiss'] },
    { id: 'sort-en-2', card: 'green', prompt: 'Welche Gruppe passt?', answer: 'Farbe', choices: ['Tier', 'Farbe', 'Verb'] },
    { id: 'sort-en-3', card: 'to read', prompt: 'Welche Gruppe passt?', answer: 'Verb', choices: ['Nomen', 'Verb', 'Zahl'] },
    { id: 'sort-en-4', card: 'small', prompt: 'Was bedeutet das?', answer: 'klein', choices: ['klein', 'schnell', 'laut'] },
  ],
};

const NORMAL_SORT = [
  { id: 'sort-arcade-1', card: 'roter Kern', prompt: 'Wirf den Kern in das rote Tor.', answer: 'Rot', choices: ['Blau', 'Rot', 'Gold'] },
  { id: 'sort-arcade-2', card: 'blauer Kern', prompt: 'Wirf den Kern in das blaue Tor.', answer: 'Blau', choices: ['Blau', 'Rot', 'Gold'] },
  { id: 'sort-arcade-3', card: 'goldener Kern', prompt: 'Wirf den Kern in das goldene Tor.', answer: 'Gold', choices: ['Blau', 'Rot', 'Gold'] },
];

const SENTENCE_TASKS = {
  Deutsch: [
    { id: 'sent-de-1', prompt: 'Baue den Satz.', answer: ['Mila', 'liest', 'leise', 'im', 'Zimmer'] },
    { id: 'sent-de-2', prompt: 'Baue den Satz.', answer: ['Der', 'kleine', 'Hund', 'rennt', 'schnell'] },
    { id: 'sent-de-3', prompt: 'Baue den Satz.', answer: ['Heute', 'bauen', 'wir', 'eine', 'Bruecke'] },
  ],
  Mathe: [
    { id: 'sent-ma-1', prompt: 'Baue die Gleichung.', answer: ['8', '+', '7', '=', '15'] },
    { id: 'sent-ma-2', prompt: 'Baue die Gleichung.', answer: ['24', '-', '9', '=', '15'] },
    { id: 'sent-ma-3', prompt: 'Baue die Gleichung.', answer: ['6', 'x', '4', '=', '24'] },
  ],
  Englisch: [
    { id: 'sent-en-1', prompt: 'Build the sentence.', answer: ['I', 'like', 'green', 'apples'] },
    { id: 'sent-en-2', prompt: 'Build the sentence.', answer: ['The', 'dog', 'runs', 'fast'] },
    { id: 'sent-en-3', prompt: 'Build the sentence.', answer: ['We', 'read', 'a', 'book'] },
  ],
};

const NORMAL_SENTENCE = [
  { id: 'sent-arcade-1', prompt: 'Baue die Kombo.', answer: ['Start', 'Drift', 'Boost', 'Ziel'] },
  { id: 'sent-arcade-2', prompt: 'Baue die Kombo.', answer: ['Sprung', 'Dash', 'Landung', 'Punkt'] },
  { id: 'sent-arcade-3', prompt: 'Baue die Kombo.', answer: ['Block', 'Konter', 'Treffer', 'Sieg'] },
];

const BLITZ_TASKS = {
  Deutsch: [
    { id: 'blitz-de-1', prompt: 'Welche Wortart ist "laufen"?', answer: 'Verb', choices: ['Nomen', 'Verb', 'Adjektiv'] },
    { id: 'blitz-de-2', prompt: 'Was ist ein Kompositum?', answer: 'Regenbogen', choices: ['laufen', 'Regenbogen', 'schnell'] },
    { id: 'blitz-de-3', prompt: 'Welche Frage passt zum Akkusativ?', answer: 'Wen oder was?', choices: ['Wer?', 'Wem?', 'Wen oder was?'] },
  ],
  Mathe: [
    { id: 'blitz-ma-1', prompt: '9 + 8 = ?', answer: '17', choices: ['15', '17', '18'] },
    { id: 'blitz-ma-2', prompt: '36 : 6 = ?', answer: '6', choices: ['5', '6', '8'] },
    { id: 'blitz-ma-3', prompt: 'Welche Zahl ist gerade?', answer: '24', choices: ['13', '21', '24'] },
  ],
  Englisch: [
    { id: 'blitz-en-1', prompt: 'Was heisst "Baum"?', answer: 'tree', choices: ['tree', 'train', 'town'] },
    { id: 'blitz-en-2', prompt: 'Was heisst "lesen"?', answer: 'to read', choices: ['to run', 'to read', 'to rain'] },
    { id: 'blitz-en-3', prompt: 'Was heisst "klein"?', answer: 'small', choices: ['slow', 'small', 'smart'] },
  ],
};

const NORMAL_BLITZ = [
  { id: 'blitz-arcade-1', prompt: 'Welches Signal ist jetzt aktiv?', answer: 'Gruen', choices: ['Rot', 'Gruen', 'Blau'] },
  { id: 'blitz-arcade-2', prompt: 'Welche Spur ist frei?', answer: 'Mitte', choices: ['Links', 'Mitte', 'Rechts'] },
  { id: 'blitz-arcade-3', prompt: 'Welcher Bonus ist sicher?', answer: 'Schild', choices: ['Risiko', 'Schild', 'Falle'] },
];

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isBlocked(x, y) {
  return OBSTACLES.some((cell) => cell.x === x && cell.y === y);
}

function getPool(game, subject, mode) {
  if (game === 'taxi') return mode === 'learn' ? TAXI_TASKS[subject] : NORMAL_TAXI;
  if (game === 'sort') return mode === 'learn' ? SORT_TASKS[subject] : NORMAL_SORT;
  if (game === 'sentence') return mode === 'learn' ? SENTENCE_TASKS[subject] : NORMAL_SENTENCE;
  return mode === 'learn' ? BLITZ_TASKS[subject] : NORMAL_BLITZ;
}

function shuffleById(items, id) {
  return items
    .map((item, index) => ({ item, order: Math.sin((index + 1) * 97.13 + id.length * 11.7) }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.item);
}

function cellStyle(point) {
  return {
    left: `${((point.x + 0.5) / GRID_W) * 100}%`,
    top: `${((point.y + 0.5) / GRID_H) * 100}%`,
  };
}

export default function FaskaLearncadeEssentials() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('learn');
  const [subject, setSubject] = useState('Deutsch');
  const [game, setGame] = useState('taxi');
  const [cursor, setCursor] = useState({ taxi: 0, sort: 0, sentence: 0, blitz: 0 });
  const [repeatQueue, setRepeatQueue] = useState([]);
  const [taxi, setTaxi] = useState({ taskId: '', x: 1, y: 5, hasPassenger: false });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [message, setMessage] = useState('Waehle ein Spiel und starte die erste Runde.');
  const [mastery, setMastery] = useState({ Deutsch: 0, Mathe: 0, Englisch: 0 });
  const [sentenceState, setSentenceState] = useState({ key: '', picks: [] });

  const pool = useMemo(() => getPool(game, subject, mode), [game, subject, mode]);
  const repeatTask = repeatQueue.find((task) => task.game === game && task.subject === subject && task.mode === mode);
  const task = repeatTask?.payload ?? pool[cursor[game] % pool.length];
  const taskIsRepeat = Boolean(repeatTask);
  const taskKey = `${game}:${mode}:${subject}:${task.id}`;
  const activeTaxi = useMemo(
    () => (taxi.taskId === task.id ? taxi : { taskId: task.id, x: task.pickup?.x ?? 1, y: task.pickup?.y ?? 5, hasPassenger: false }),
    [taxi, task],
  );
  const sentencePick = sentenceState.key === taskKey ? sentenceState.picks : [];
  const sentenceOptions = useMemo(() => {
    if (game !== 'sentence') return [];
    return shuffleById(task.answer, task.id);
  }, [game, task]);

  const completeTask = useCallback((success, feedback) => {
    setMessage(feedback);
    if (success) {
      setScore((value) => value + 120 + streak * 12 + (taskIsRepeat ? 40 : 0));
      setStreak((value) => value + 1);
      setMastery((value) => ({ ...value, [subject]: value[subject] + 1 }));
      setRepeatQueue((queue) => queue.filter((entry) => entry.payload.id !== task.id));
      setCursor((value) => ({ ...value, [game]: value[game] + 1 }));
      setTaxi({ taskId: '', x: 1, y: 5, hasPassenger: false });
      setSentenceState({ key: '', picks: [] });
      return;
    }

    setStreak(0);
    setHearts((value) => Math.max(1, value - 1));
    setMastery((value) => ({ ...value, [subject]: Math.max(0, value[subject] - 1) }));
    setRepeatQueue((queue) => {
      if (queue.some((entry) => entry.payload.id === task.id)) return queue;
      return [...queue.slice(-5), { game, subject, mode, payload: task }];
    });
  }, [game, mode, streak, subject, task, taskIsRepeat]);

  const moveTaxi = useCallback((dx, dy) => {
    if (game !== 'taxi') return;
    setTaxi((value) => {
      const base = value.taskId === task.id ? value : { taskId: task.id, x: task.pickup?.x ?? 1, y: task.pickup?.y ?? 5, hasPassenger: false };
      const next = {
        ...base,
        x: Math.max(0, Math.min(GRID_W - 1, base.x + dx)),
        y: Math.max(0, Math.min(GRID_H - 1, base.y + dy)),
      };
      if (isBlocked(next.x, next.y)) return base;
      return next;
    });
  }, [game, task]);

  const taxiAction = useCallback(() => {
    if (game !== 'taxi') return;
    if (!activeTaxi.hasPassenger && sameCell(activeTaxi, task.pickup)) {
      setTaxi({ ...activeTaxi, taskId: task.id, hasPassenger: true });
      setMessage(`Aufgenommen: ${task.passenger}. Jetzt zum richtigen Ziel fahren.`);
      return;
    }
    if (!activeTaxi.hasPassenger) {
      setMessage('Erst zum Wort oder Passagier fahren.');
      return;
    }
    const zone = task.zones.find((item) => sameCell(activeTaxi, item));
    if (!zone) {
      setMessage('Fahre auf ein Ziel-Feld und druecke Aktion.');
      return;
    }
    completeTask(Boolean(zone.correct), zone.correct ? `Richtig: ${task.sentence ?? task.prompt}` : `Falsches Ziel: ${zone.label}`);
  }, [activeTaxi, completeTask, game, task]);

  useEffect(() => {
    if (game !== 'taxi') return undefined;
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) moveTaxi(0, -1);
      if (['arrowdown', 's'].includes(key)) moveTaxi(0, 1);
      if (['arrowleft', 'a'].includes(key)) moveTaxi(-1, 0);
      if (['arrowright', 'd'].includes(key)) moveTaxi(1, 0);
      if (key === ' ' || key === 'enter') {
        event.preventDefault();
        taxiAction();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game, moveTaxi, taxiAction]);

  const answerChoice = (choice) => {
    completeTask(choice === task.answer, choice === task.answer ? `Richtig: ${choice}` : `Noch einmal: ${choice}`);
  };

  const addSentenceToken = (token, index) => {
    if (sentencePick.some((item) => item.index === index)) return;
    setSentenceState((value) => ({
      key: taskKey,
      picks: value.key === taskKey ? [...value.picks, { token, index }] : [{ token, index }],
    }));
  };

  const checkSentence = () => {
    const built = sentencePick.map((item) => item.token).join(' ');
    const target = task.answer.join(' ');
    completeTask(built === target, built === target ? `Richtig: ${target}` : `Noch einmal ordnen: ${target}`);
  };

  const resetRun = () => {
    setScore(0);
    setStreak(0);
    setHearts(5);
    setCursor({ taxi: 0, sort: 0, sentence: 0, blitz: 0 });
    setRepeatQueue([]);
    setMastery({ Deutsch: 0, Mathe: 0, Englisch: 0 });
    setSentenceState({ key: '', picks: [] });
    setTaxi({ taskId: '', x: 1, y: 5, hasPassenger: false });
    setMessage('Neue Runde gestartet.');
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setMessage(nextMode === 'learn' ? 'Lernmodus aktiv.' : 'Normalmodus aktiv.');
  };

  const selectSubject = (nextSubject) => {
    setSubject(nextSubject);
    setMessage(`${nextSubject} ausgewaehlt.`);
  };

  const selectGame = (nextGame) => {
    setGame(nextGame);
    setMessage(GAMES.find((item) => item.id === nextGame)?.hint ?? '');
  };

  return (
    <div className="learncade-shell">
      <header className="learncade-topbar">
        <div>
          <p className="eyebrow">FASKA 64 Abschluss</p>
          <h1>Faska Lernpark</h1>
        </div>
        <div className="top-actions">
          <button type="button" onClick={() => navigate('/game/faska64-godot')}>3D-Prototyp</button>
          <button type="button" onClick={resetRun}>Neu</button>
          <button type="button" onClick={() => navigate('/')}>Zurueck</button>
        </div>
      </header>

      <main className="learncade-layout">
        <section className="play-surface" aria-label="Spielfeld">
          <div className="mode-row" aria-label="Spielmodus">
            <button type="button" className={mode === 'arcade' ? 'active' : ''} onClick={() => selectMode('arcade')}>Normal</button>
            <button type="button" className={mode === 'learn' ? 'active' : ''} onClick={() => selectMode('learn')}>Lernen</button>
          </div>

          <div className="game-tabs" aria-label="Minispiele">
            {GAMES.map((item) => (
              <button key={item.id} type="button" className={game === item.id ? 'active' : ''} onClick={() => selectGame(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {mode === 'learn' && (
            <div className="subject-row" aria-label="Fach">
              {SUBJECTS.map((item) => (
                <button key={item} type="button" className={subject === item ? 'active' : ''} onClick={() => selectSubject(item)}>
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="mission-strip">
            <span>{taskIsRepeat ? 'Wiederholung' : mode === 'learn' ? subject : 'Arcade'}</span>
            <strong>{task.prompt}</strong>
          </div>

          {game === 'taxi' && (
            <TaxiBoard task={task} taxi={activeTaxi} onAction={taxiAction} />
          )}

          {game === 'sort' && (
            <ChoiceArena task={task} onAnswer={answerChoice} />
          )}

          {game === 'sentence' && (
            <SentenceArena
              task={task}
              options={sentenceOptions}
              picked={sentencePick}
              onPick={addSentenceToken}
              onCheck={checkSentence}
              onReset={() => setSentenceState({ key: taskKey, picks: [] })}
            />
          )}

          {game === 'blitz' && (
            <BlitzArena task={task} onAnswer={answerChoice} />
          )}

          <p className="message-line">{message}</p>

          {game === 'taxi' && (
            <div className="touch-controls" aria-label="Touchsteuerung">
              <div className="dpad">
                <button type="button" onClick={() => moveTaxi(0, -1)}>U</button>
                <button type="button" onClick={() => moveTaxi(-1, 0)}>L</button>
                <button type="button" onClick={() => moveTaxi(1, 0)}>R</button>
                <button type="button" onClick={() => moveTaxi(0, 1)}>D</button>
              </div>
              <button type="button" className="action-button" onClick={taxiAction}>Aktion</button>
            </div>
          )}
        </section>

        <aside className="score-panel" aria-label="Fortschritt">
          <div className="stat-line"><span>Score</span><strong>{score}</strong></div>
          <div className="stat-line"><span>Combo</span><strong>{streak}</strong></div>
          <div className="stat-line"><span>Herzen</span><strong>{hearts}</strong></div>
          <div className="mastery-list">
            {SUBJECTS.map((item) => (
              <div key={item}>
                <span>{item}</span>
                <div><i style={{ width: `${Math.min(100, mastery[item] * 12)}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="queue-box">
            <span>Wiederholungen</span>
            <strong>{repeatQueue.length}</strong>
          </div>
        </aside>
      </main>

      <style>{`
        .learncade-shell {
          min-height: 100dvh;
          color: #f8fafc;
          background:
            linear-gradient(180deg, rgba(8, 13, 25, .94), rgba(9, 20, 33, .98)),
            repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 1px, transparent 1px 64px);
          font-family: Inter, system-ui, sans-serif;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .learncade-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px clamp(16px, 4vw, 44px) 10px;
        }
        .eyebrow {
          margin: 0 0 2px;
          color: #67e8f9;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        h1 {
          margin: 0;
          font-size: clamp(28px, 5vw, 54px);
          line-height: 1;
          letter-spacing: 0;
        }
        button {
          border: 1px solid rgba(226, 232, 240, .18);
          background: rgba(15, 23, 42, .82);
          color: #f8fafc;
          font-weight: 900;
          cursor: pointer;
        }
        .top-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }
        .top-actions button {
          min-height: 38px;
          padding: 0 12px;
          border-radius: 8px;
        }
        .learncade-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 16px;
          padding: 8px clamp(16px, 4vw, 44px) 120px;
        }
        .play-surface {
          min-width: 0;
        }
        .mode-row,
        .game-tabs,
        .subject-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 9px;
        }
        .mode-row button,
        .game-tabs button,
        .subject-row button {
          min-height: 36px;
          border-radius: 8px;
          padding: 0 12px;
        }
        .mode-row .active,
        .game-tabs .active,
        .subject-row .active {
          background: #f8fafc;
          color: #0f172a;
          border-color: #f8fafc;
        }
        .mission-strip {
          min-height: 64px;
          display: grid;
          gap: 4px;
          align-content: center;
          padding: 12px 14px;
          border: 1px solid rgba(148, 163, 184, .24);
          background: rgba(2, 6, 23, .55);
          border-radius: 8px;
        }
        .mission-strip span {
          color: #facc15;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .mission-strip strong {
          font-size: clamp(16px, 2vw, 21px);
          line-height: 1.25;
        }
        .taxi-board {
          position: relative;
          margin-top: 12px;
          width: min(100%, 980px);
          aspect-ratio: 11 / 7;
          min-height: 390px;
          overflow: hidden;
          border: 2px solid rgba(125, 211, 252, .62);
          border-radius: 8px;
          background:
            linear-gradient(90deg, rgba(148, 163, 184, .12) 1px, transparent 1px),
            linear-gradient(rgba(148, 163, 184, .12) 1px, transparent 1px),
            linear-gradient(135deg, #164e63, #14532d 55%, #713f12);
          background-size: calc(100% / 11) calc(100% / 7), calc(100% / 11) calc(100% / 7), 100% 100%;
          box-shadow: 0 16px 40px rgba(0,0,0,.28);
        }
        .road {
          position: absolute;
          inset: 20% 4%;
          border: 18px solid rgba(30, 41, 59, .72);
          border-radius: 46%;
          transform: rotate(-8deg);
        }
        .obstacle,
        .pickup,
        .zone,
        .taxi {
          position: absolute;
          transform: translate(-50%, -50%);
        }
        .obstacle {
          width: 7%;
          height: 10%;
          border-radius: 8px;
          background: rgba(15, 23, 42, .72);
          border: 1px solid rgba(226, 232, 240, .18);
        }
        .pickup {
          min-width: 112px;
          padding: 8px 10px;
          border-radius: 8px;
          background: #facc15;
          color: #1f2937;
          font-weight: 1000;
          text-align: center;
          box-shadow: 4px 4px 0 rgba(0,0,0,.34);
        }
        .zone {
          width: min(22%, 210px);
          min-height: 54px;
          display: grid;
          place-items: center;
          padding: 8px;
          border-radius: 8px;
          background: rgba(248, 250, 252, .9);
          color: #0f172a;
          border: 3px solid rgba(14, 165, 233, .7);
          font-size: 13px;
          font-weight: 1000;
          text-align: center;
          box-shadow: 4px 4px 0 rgba(0,0,0,.25);
        }
        .taxi {
          width: 58px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: ${taxi.hasPassenger ? '#22c55e' : '#facc15'};
          color: #111827;
          border: 3px solid #fff7ed;
          font-weight: 1000;
          box-shadow: 0 0 0 4px rgba(0,0,0,.18), 4px 4px 0 rgba(0,0,0,.34);
          transition: left .12s linear, top .12s linear, background .15s ease;
        }
        .arena {
          margin-top: 12px;
          min-height: 390px;
          display: grid;
          align-content: center;
          gap: 18px;
          padding: clamp(16px, 4vw, 34px);
          border: 2px solid rgba(125, 211, 252, .5);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(15, 23, 42, .9), rgba(12, 74, 110, .66));
        }
        .big-card {
          justify-self: center;
          min-width: min(420px, 100%);
          padding: 26px;
          border-radius: 8px;
          background: #f8fafc;
          color: #0f172a;
          text-align: center;
          font-size: clamp(28px, 7vw, 58px);
          font-weight: 1000;
          box-shadow: 8px 8px 0 rgba(0,0,0,.24);
        }
        .choice-grid,
        .token-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .choice-grid button,
        .token-grid button,
        .sentence-actions button {
          min-height: 54px;
          border-radius: 8px;
          font-size: 16px;
          padding: 8px 10px;
        }
        .built-sentence {
          min-height: 66px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 1px dashed rgba(226, 232, 240, .34);
          border-radius: 8px;
          color: #e0f2fe;
          font-weight: 900;
        }
        .sentence-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .message-line {
          min-height: 28px;
          color: #cbd5e1;
          font-weight: 800;
          line-height: 1.35;
        }
        .score-panel {
          display: grid;
          align-content: start;
          gap: 10px;
        }
        .stat-line,
        .queue-box {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          border-radius: 8px;
          background: rgba(2, 6, 23, .62);
          border: 1px solid rgba(148, 163, 184, .24);
        }
        .stat-line span,
        .queue-box span,
        .mastery-list span {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .stat-line strong,
        .queue-box strong {
          font-size: 24px;
        }
        .mastery-list {
          display: grid;
          gap: 10px;
          padding: 14px;
          border-radius: 8px;
          background: rgba(2, 6, 23, .62);
          border: 1px solid rgba(148, 163, 184, .24);
        }
        .mastery-list div div {
          height: 8px;
          margin-top: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(148, 163, 184, .18);
        }
        .mastery-list i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #38bdf8);
        }
        .touch-controls {
          position: fixed;
          left: 18px;
          right: 18px;
          bottom: 16px;
          z-index: 20;
          display: none;
          justify-content: space-between;
          pointer-events: none;
        }
        .dpad {
          display: grid;
          grid-template-columns: repeat(3, 42px);
          grid-template-rows: repeat(3, 42px);
          gap: 4px;
          pointer-events: auto;
        }
        .dpad button,
        .action-button {
          border-radius: 50%;
          min-width: 42px;
          min-height: 42px;
          background: rgba(248, 250, 252, .9);
          color: #0f172a;
          box-shadow: 3px 3px 0 rgba(0,0,0,.35);
        }
        .dpad button:nth-child(1) { grid-column: 2; grid-row: 1; }
        .dpad button:nth-child(2) { grid-column: 1; grid-row: 2; }
        .dpad button:nth-child(3) { grid-column: 3; grid-row: 2; }
        .dpad button:nth-child(4) { grid-column: 2; grid-row: 3; }
        .action-button {
          align-self: end;
          width: 64px;
          height: 64px;
          pointer-events: auto;
        }
        @media (max-width: 860px) {
          .learncade-topbar,
          .learncade-layout {
            padding-left: 12px;
            padding-right: 12px;
          }
          .learncade-layout {
            grid-template-columns: 1fr;
            padding-bottom: 18px;
          }
          .top-actions button {
            min-height: 34px;
            padding: 0 9px;
          }
          .taxi-board {
            min-height: 260px;
          }
          .choice-grid,
          .token-grid {
            grid-template-columns: 1fr;
          }
          .score-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .mastery-list {
            grid-column: 1 / -1;
          }
          .touch-controls {
            display: flex;
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            margin-top: 10px;
          }
          .pickup {
            min-width: 82px;
            font-size: 12px;
          }
          .zone {
            width: 26%;
            min-height: 48px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

function TaxiBoard({ task, taxi, onAction }) {
  return (
    <div className="taxi-board" onDoubleClick={onAction}>
      <div className="road" />
      {OBSTACLES.map((cell) => (
        <div key={`${cell.x}-${cell.y}`} className="obstacle" style={cellStyle(cell)} />
      ))}
      {!taxi.hasPassenger && (
        <div className="pickup" style={cellStyle(task.pickup)}>
          {task.passenger}
        </div>
      )}
      {task.zones.map((zone) => (
        <div key={zone.id} className="zone" style={cellStyle(zone)}>
          {zone.label}
        </div>
      ))}
      <div className="taxi" style={cellStyle(taxi)}>
        TAXI
      </div>
    </div>
  );
}

function ChoiceArena({ task, onAnswer }) {
  return (
    <div className="arena">
      <div className="big-card">{task.card}</div>
      <div className="choice-grid">
        {task.choices.map((choice) => (
          <button key={choice} type="button" onClick={() => onAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

function SentenceArena({ task, options, picked, onPick, onCheck, onReset }) {
  return (
    <div className="arena">
      <div className="built-sentence">
        {picked.length === 0 ? '...' : picked.map((item) => item.token).join(' ')}
      </div>
      <div className="token-grid">
        {options.map((token, index) => {
          const used = picked.some((item) => item.index === index);
          return (
            <button key={`${token}-${index}`} type="button" disabled={used} onClick={() => onPick(token, index)}>
              {used ? ' ' : token}
            </button>
          );
        })}
      </div>
      <div className="sentence-actions">
        <button type="button" onClick={onReset}>Reset</button>
        <button type="button" onClick={onCheck} disabled={picked.length !== task.answer.length}>Pruefen</button>
      </div>
    </div>
  );
}

function BlitzArena({ task, onAnswer }) {
  return (
    <div className="arena">
      <div className="big-card" style={{ fontSize: 'clamp(22px, 4vw, 38px)' }}>{task.prompt}</div>
      <div className="choice-grid">
        {task.choices.map((choice) => (
          <button key={choice} type="button" onClick={() => onAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
