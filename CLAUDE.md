# Wizify OF — Site internet

Site vitrine public de l'organisme de formation Wizify (DDA / IOBSP, Qualiopi).

## Périmètre

Site marketing public — distinct de `wizify-of/` qui est l'outillage interne (LMS Qualiobee + Frappe + ScormStack via n8n).

## Maquette

`design/of-v2.pen` — fichier Penpot v2 (v2.11), ~568 KB.

5 pages designées (1440 desktop, auto-layout vertical) :

1. **OF — Accueil** : Nav · Hero (avec `[CMS: video_positionnement]`) · Social Proof · Avant/Après · Formations · Pédagogie · Pour Qui · Financement · Témoignages + FAQ · Newsletter · Footer
2. **OF — Catalogue** : header + filtres + grille de formations + bannière sur-mesure
3. **OF — Formation Template** : breadcrumb · hero · objectifs · public/prérequis · programme · modalités · organisation · accessibilité handicap · tarifs/financement · formateurs · résultats Qualiopi (Ind. 2/23/24) · avis (`[CMS: Témoignages formation]`) · encadré légal Qualiopi Ind. 1 · sticky bar mobile
4. **OF — À Propos** : hero · histoire · valeurs · équipe · engagements Qualiopi · chiffres clés · partenaires & certifications
5. **OF — Mentions Légales & CGV** : mentions · CGV formation · règlement · infos légales · confidentialité · RGPD · cookies

Composant : `CardFormation` (380px — badge, titre, durée, modalité, public, OPCO, CTA).

## Règles de transposition

Maquette = pixel perfect (cf. mémoire `feedback_pixel_perfect_maquette.md`). Reprendre valeurs exactes (positions, paddings, contenus textes), pas seulement la structure.

## Stack

- **Next.js 16** (App Router, src/, Turbopack)
- **React 19**
- **Tailwind v4** (via `@tailwindcss/postcss`)
- **TypeScript strict**

Choisi pour cohérence avec `wizify-of/` et future intégration Bridge OF + Supabase (mêmes types, même client SSR).

## Conventions

- `src/app/` : routes App Router
- `src/components/` : composants partagés (Nav, Footer, FormationCard…)
- `src/components/sections/` : sections de page (Hero, AvantApres…)
- Tokens design exposés en variables CSS dans `src/app/globals.css` (couleurs, fonts, radii) — extraits du `.pen`.
