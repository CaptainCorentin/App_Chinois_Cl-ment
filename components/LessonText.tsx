import SpeakButton from "./SpeakButton";

type Mot = {
  hanzi: string;
  pinyin: string;
};

type Lecon = {
  id: string;
  titre: string;
  traduction: string;
  mots: Mot[];
};

export default function LessonText({ lecon }: { lecon: Lecon }) {
  const texteComplet = lecon.mots.map((m) => m.hanzi).join("");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">{lecon.titre}</h2>
        <SpeakButton text={texteComplet} />
      </div>

      <div className="mb-6 flex flex-wrap gap-x-3 gap-y-4">
        {lecon.mots.map((mot, index) => (
          <span key={index} className="flex flex-col items-center">
            <span className="text-xs text-gray-400">{mot.pinyin}</span>
            <span className="text-2xl">{mot.hanzi}</span>
          </span>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Traduction</p>
        <p className="text-gray-800">{lecon.traduction}</p>
      </div>
    </div>
  );
}
