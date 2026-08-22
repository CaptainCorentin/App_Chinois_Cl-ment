"use client";

export default function SpeakButton({ text }: { text: string }) {
  function parler() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("La lecture audio n'est pas supportée par ce navigateur.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      onClick={parler}
      type="button"
      aria-label="Écouter la prononciation"
      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 active:scale-95 transition hover:bg-red-100"
    >
      🔊 écouter
    </button>
  );
}
