import { pinyin } from "pinyin-pro";

/**
 * Génère le pinyin (avec tons) pour un texte en caractères chinois.
 * À utiser seulement quand le pinyin n'est pas déjà fourni dans les données JSON,
 * car pinyin-pro peut se tromper sur des caractères ambigus (plusieurs prononciations possibles).
 */
export function genererPinyin(texte: string): string {
  return pinyin(texte, { toneType: "symbol" });
}
