"use client";

import { useEffect, useState } from "react";
import { getStats, updateDailyGoal, type Stats } from "@/lib/progress";

export default function ProgresPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [objectifSaisi, setObjectifSaisi] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);

  async function recharger() {
    const s = await getStats();
    setStats(s);
    setObjectifSaisi(String(s.dailyGoal));
  }

  useEffect(() => {
    recharger();
  }, []);

  async function enregistrerObjectif() {
    const valeur = parseInt(objectifSaisi, 10);
    if (!Number.isFinite(valeur) || valeur < 1) return;
    setEnregistrement(true);
    await updateDailyGoal(valeur);
    await recharger();
    setEnregistrement(false);
  }

  if (!stats) {
    return <p className="px-4 py-10 text-center text-gray-500">Chargement…</p>;
  }

  const progressionObjectif = Math.min(100, Math.round((stats.reviewsToday / stats.dailyGoal) * 100));

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Progrès</h1>

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        <StatCard label="Streak actuel" value={`${stats.currentStreak} 🔥`} />
        <StatCard label="Meilleur streak" value={`${stats.longestStreak} 🔥`} />
        <StatCard label="Mots commencés" value={`${stats.wordsStarted} / ${stats.totalWords}`} />
        <StatCard label="Mots maîtrisés" value={`${stats.wordsMastered}`} />
        <StatCard label="Taux de réussite" value={stats.accuracy !== null ? `${stats.accuracy}%` : "—"} />
        <StatCard label="Révisions aujourd'hui" value={`${stats.reviewsToday}`} />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Objectif du jour</span>
          <span className="text-sm text-gray-500">
            {stats.reviewsToday} / {stats.dailyGoal}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-gray-900 transition-all"
            style={{ width: `${progressionObjectif}%` }}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label htmlFor="objectif" className="text-sm text-gray-600">
            Nouvel objectif :
          </label>
          <input
            id="objectif"
            type="number"
            min={1}
            value={objectifSaisi}
            onChange={(e) => setObjectifSaisi(e.target.value)}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={enregistrerObjectif}
            disabled={enregistrement}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white active:scale-95 transition disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
