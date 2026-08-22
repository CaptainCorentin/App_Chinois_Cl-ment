# App Chinois Clément

Application web (Next.js) pour s'entraîner au chinois, inspirée de Du Chinese.

## Fonctionnalités

- **Flashcards** : caractère chinois → révéler le pinyin + la traduction française, avec lecture audio (Web Speech API, `lang="zh-CN"`).
- **Leçons** : texte court en caractères simplifiés avec pinyin mot-par-mot et traduction française.
- Vocabulaire et leçons stockés dans des fichiers JSON dans `/data` (pas de base de données).

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Ajouter du vocabulaire ou des leçons

Éditer `data/vocabulaire.json` et `data/lecons.json`. Le pinyin peut être généré automatiquement avec `pinyin-pro` (voir `lib/pinyin.ts`) si besoin.

## Déploiement

Le projet est prêt pour un déploiement sur [Vercel](https://vercel.com) (aucune configuration supplémentaire nécessaire).
