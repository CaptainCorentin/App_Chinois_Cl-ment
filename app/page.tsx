import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900">中文 App</h1>
      <p className="max-w-md text-gray-600">
        Entraîne-toi au chinois avec des flashcards et de courtes leçons, directement dans ton navigateur.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs sm:flex-row">
        <Link
          href="/flashcards"
          className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-center font-medium text-white active:scale-95 transition"
        >
          Flashcards
        </Link>
        <Link
          href="/lecons"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-medium text-gray-900 active:scale-95 transition"
        >
          Leçons
        </Link>
      </div>
    </div>
  );
}
