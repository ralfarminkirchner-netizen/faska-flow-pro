import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loadProgress, saveProgress, getDailySeed } from "../utils/storage";
import { playPop, playSparkle } from "../utils/sounds";

const TASK_POOL = [
  { id: "math_1", title: "Zahlen-Zauber", desc: "Lege 3 Zahlen mit den goldenen Perlen.", fach: "mathe" },
  { id: "deutsch_1", title: "Silben-Suppe", desc: "Braue 5 neue Wörter im Labor.", fach: "deutsch" },
  { id: "ethik_1", title: "Herz-Knoten", desc: "Löse einen Konflikt-Knoten.", fach: "ethik" },
  { id: "sach_1", title: "Natur-Forscher", desc: "Setze 3 Tiere in dein Ökosystem.", fach: "sachunterricht" },
  { id: "musik_1", title: "Klang-Meister", desc: "Erstelle einen neuen Beat.", fach: "musik" },
  { id: "ethik_2", title: "Gefühls-Mix", desc: "Entdecke 2 neue komplexe Gefühle.", fach: "ethik" },
  { id: "math_2", title: "Große Zahlen", desc: "Baue eine Zahl über 1000.", fach: "mathe" }
];

export default function DailyJourney({ onTaskClick }) {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);

  useEffect(() => {
    const seed = getDailySeed();
    const progress = loadProgress() || {};
    const today = new Date().toISOString().split("T")[0];
    
    // Pick 3 stable tasks for today based on seed
    const picked = [];
    let s = seed;
    for (let i = 0; i < 3; i++) {
        s = (s * 16807) % 2147483647;
        const idx = s % TASK_POOL.length;
        picked.push(TASK_POOL[idx]);
    }
    setDailyTasks(picked);

    if (progress.lastDailyDate === today) {
        setCompletedToday(progress.completedTasks || []);
    } else {
        // New day, reset
        saveProgress({ lastDailyDate: today, completedTasks: [] });
    }
  }, []);

  const toggleTask = (taskId) => {
    const isDone = completedToday.includes(taskId);
    let newVal;
    if (isDone) {
        newVal = completedToday.filter(id => id !== taskId);
    } else {
        newVal = [...completedToday, taskId];
        playSparkle();
    }
    setCompletedToday(newVal);
    saveProgress({ completedTasks: newVal });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-4 border-white shadow-xl max-w-md w-full"
    >
      <h3 className="font-hand text-3xl font-bold text-slate-800 mb-2">Deine Reise heute</h3>
      <p className="font-hand text-xl text-slate-500 mb-6">Lerne jeden Tag ein bisschen mehr.</p>
      
      <div className="flex flex-col gap-4">
        {dailyTasks.map((task, idx) => {
          const isCompleted = completedToday.includes(task.id);
          return (
            <motion.div
              key={task.id + idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between
                ${isCompleted ? 'bg-emerald-100 border-emerald-300 opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}
              onClick={() => onTaskClick(task.fach)}
            >
              <div className="flex items-center gap-4">
                <div 
                  onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-400'}`}
                >
                  {isCompleted && "✓"}
                </div>
                <div>
                  <p className="font-hand text-xl font-bold text-slate-800 leading-none">{task.title}</p>
                  <p className="font-sans text-xs text-slate-500 mt-1">{task.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
