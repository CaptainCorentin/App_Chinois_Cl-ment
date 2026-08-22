import { supabase } from "./supabase";
import { nextSrsState } from "./srs";
import vocabulaire from "@/data/vocabulaire.json";

export type Word = {
  id: string;
  hanzi: string;
  pinyin: string;
  traduction: string;
};

export type WordProgressRow = {
  word_id: string;
  attempts_count: number;
  success_count: number;
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  due_at: string;
  last_reviewed_at: string | null;
};

export type SessionItem = {
  word: Word;
  progress: WordProgressRow | null;
};

function todayStr(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Construit une session de révision : les mots dus aujourd'hui (SRS) en priorité,
 * complétés par des mots jamais vus jusqu'à atteindre l'objectif quotidien.
 */
export async function getReviewSession(dailyGoal: number): Promise<SessionItem[]> {
  const nowIso = new Date().toISOString();

  const { data: dueRows, error: dueError } = await supabase
    .from("word_progress")
    .select("*")
    .lte("due_at", nowIso)
    .order("due_at", { ascending: true });
  if (dueError) throw dueError;

  const { data: knownRows, error: knownError } = await supabase
    .from("word_progress")
    .select("word_id");
  if (knownError) throw knownError;

  const knownIds = new Set((knownRows ?? []).map((r) => r.word_id));
  const vocabById = new Map(vocabulaire.map((w) => [w.id, w]));

  const dueItems: SessionItem[] = (dueRows ?? [])
    .filter((row) => vocabById.has(row.word_id))
    .map((row) => ({ word: vocabById.get(row.word_id)!, progress: row as WordProgressRow }));

  const remainingSlots = Math.max(0, dailyGoal - dueItems.length);
  const newItems: SessionItem[] = vocabulaire
    .filter((w) => !knownIds.has(w.id))
    .slice(0, remainingSlots)
    .map((word) => ({ word, progress: null }));

  return [...dueItems, ...newItems];
}

/**
 * Enregistre la réponse à une carte : met à jour l'état SRS du mot,
 * journalise la révision, et met à jour le streak du jour.
 */
export async function recordReview(item: SessionItem, correct: boolean): Promise<void> {
  const { word, progress } = item;

  const previousState = progress
    ? {
        repetitions: progress.repetitions,
        easeFactor: progress.ease_factor,
        intervalDays: progress.interval_days,
      }
    : { repetitions: 0, easeFactor: 2.5, intervalDays: 0 };

  const next = nextSrsState(previousState, correct);

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + next.intervalDays);

  const attempts = (progress?.attempts_count ?? 0) + 1;
  const successes = (progress?.success_count ?? 0) + (correct ? 1 : 0);

  const { error: upsertError } = await supabase.from("word_progress").upsert({
    word_id: word.id,
    attempts_count: attempts,
    success_count: successes,
    repetitions: next.repetitions,
    ease_factor: next.easeFactor,
    interval_days: next.intervalDays,
    due_at: dueAt.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  });
  if (upsertError) throw upsertError;

  const { error: logError } = await supabase
    .from("review_log")
    .insert({ word_id: word.id, correct });
  if (logError) throw logError;

  await updateStreak();
}

async function updateStreak(): Promise<void> {
  const { data: stats, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !stats) return;

  const today = todayStr();
  if (stats.last_activity_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = stats.last_activity_date === todayStr(yesterday);

  const newStreak = wasYesterday ? stats.current_streak + 1 : 1;
  const longestStreak = Math.max(stats.longest_streak, newStreak);

  await supabase
    .from("user_stats")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq("id", 1);
}

export type Stats = {
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  reviewsToday: number;
  wordsStarted: number;
  totalWords: number;
  wordsMastered: number;
  accuracy: number | null;
};

export async function getStats(): Promise<Stats> {
  const { data: stats } = await supabase.from("user_stats").select("*").eq("id", 1).single();

  const { data: progressRows } = await supabase
    .from("word_progress")
    .select("attempts_count, success_count, repetitions");

  const today = todayStr();
  const { count: reviewsToday } = await supabase
    .from("review_log")
    .select("*", { count: "exact", head: true })
    .gte("reviewed_at", `${today}T00:00:00`);

  const rows = progressRows ?? [];
  const totalAttempts = rows.reduce((sum, r) => sum + r.attempts_count, 0);
  const totalSuccess = rows.reduce((sum, r) => sum + r.success_count, 0);
  const wordsMastered = rows.filter((r) => r.repetitions >= 3).length;

  return {
    currentStreak: stats?.current_streak ?? 0,
    longestStreak: stats?.longest_streak ?? 0,
    dailyGoal: stats?.daily_goal ?? 20,
    reviewsToday: reviewsToday ?? 0,
    wordsStarted: rows.length,
    totalWords: vocabulaire.length,
    wordsMastered,
    accuracy: totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : null,
  };
}

export async function updateDailyGoal(goal: number): Promise<void> {
  await supabase.from("user_stats").update({ daily_goal: goal }).eq("id", 1);
}
