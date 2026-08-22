import { createClient } from "@supabase/supabase-js";

// Valeurs de repli pour ne jamais faire échouer le build si les variables
// d'environnement ne sont pas encore configurées (ex: premier déploiement
// Vercel avant l'ajout des clés) — les appels réseau échoueront alors
// proprement à l'exécution et sont déjà gérés par les pages appelantes.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
);
