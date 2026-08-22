import LessonText from "@/components/LessonText";
import lecons from "@/data/lecons.json";

export default function LeconsPage() {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Leçons</h1>

      {lecons.map((lecon) => (
        <LessonText key={lecon.id} lecon={lecon} />
      ))}
    </div>
  );
}
