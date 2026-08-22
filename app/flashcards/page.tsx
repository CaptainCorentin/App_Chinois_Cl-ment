"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/Flashcard";
import { getReviewSession, getStats, recordReview, type SessionItem } from "@/lib/progress";

export default function FlashcardsPage() {
  const [session, setSession] = useState<SessionItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [terminee, setTerminee] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    async function charger() {
      try {
        const stats = await getStats();
        const items = await getReviewSession(stats.dailyGoal);
        setSession(items);
      } catch {
        setErreur(
          "Impossible de charger la session de révision (vérifie la connexion à Supabase)."
        );
      }
    }
    charger();
  }, []);

  async function repondre(correct: boolean) {
    if (!session) return;
    const item = session[index];
    try {
      await recordReview(item, correct);
    } catch {
      setErreur("La réponse n'a pas pu être enregistrée.");
    }

    if (index + 1 < session.length) {
      setIndex(index + 1);
    } else {
      setTerminee(true);
    }
  }

  if (erreur) {
    return <p className="px-4 py-10 text-center text-red-600">{erreur}</p>;
  }

  if (session === null) {
    return <p className="px-4 py-10 text-center text-gray-500">Chargement de la session…</p>;
  }

  if (session.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
        <p className="text-gray-600">
          Aucune carte à réviser pour l'instant, bravo ! Reviens plus tard. 🎉
        </p>
      </div>
    );
  }

  if (terminee) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Session terminée 🎉</h1>
        <p className="text-gray-600">
          Tu as révisé {session.length} carte{session.length > 1 ? "s" : ""}. À bientôt !
        </p>
      </div>
    );
  }

  const item = session[index];

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
      <p className="text-sm text-gray-500">
        Carte {index + 1} / {session.length}
      </p>

      <Flashcard key={item.word.id} mot={item.word} onAnswer={repondre} />
    </div>
  );
}
