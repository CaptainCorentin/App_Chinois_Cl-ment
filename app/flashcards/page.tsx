"use client";

import { useState } from "react";
import Flashcard from "@/components/Flashcard";
import vocabulaire from "@/data/vocabulaire.json";

export default function FlashcardsPage() {
  const [index, setIndex] = useState(0);
  const mot = vocabulaire[index];

  function suivant() {
    setIndex((i) => (i + 1) % vocabulaire.length);
  }

  function precedent() {
    setIndex((i) => (i - 1 + vocabulaire.length) % vocabulaire.length);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
      <p className="text-sm text-gray-500">
        Carte {index + 1} / {vocabulaire.length}
      </p>

      <Flashcard key={mot.id} mot={mot} />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={precedent}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 active:scale-95 transition"
        >
          ← Précédent
        </button>
        <button
          type="button"
          onClick={suivant}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 active:scale-95 transition"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
