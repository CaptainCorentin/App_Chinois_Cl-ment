import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-center gap-6 border-b border-gray-200 bg-white/80 backdrop-blur px-4 py-3">
      <Link href="/" className="text-sm font-semibold text-gray-900">
        中文 App
      </Link>
      <Link href="/flashcards" className="text-sm font-medium text-gray-600 hover:text-gray-900">
        Flashcards
      </Link>
      <Link href="/lecons" className="text-sm font-medium text-gray-600 hover:text-gray-900">
        Leçons
      </Link>
      <Link href="/progres" className="text-sm font-medium text-gray-600 hover:text-gray-900">
        Progrès
      </Link>
    </nav>
  );
}
