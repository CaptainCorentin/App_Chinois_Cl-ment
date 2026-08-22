"use client";

import { useState } from "react";
import SpeakButton from "./SpeakButton";

type Mot = {
  id: string;
  hanzi: string;
  pinyin: string;
  traduction: string;
};

export default function Flashcard({ mot }: { mot: Mot }) {
  const [revele, setRevele] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm w-full max-w-sm">
      <span className="text-6xl font-medium">{mot.hanzi}</span>

      {revele ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-lg text-gray-500">{mot.pinyin}</span>
          <span className="text-xl font-semibold text-gray-900">{mot.traduction}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setRevele(true)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white active:scale-95 transition"
        >
          Révéler
        </button>
      )}

      <SpeakButton text={mot.hanzi} />
    </div>
  );
}
