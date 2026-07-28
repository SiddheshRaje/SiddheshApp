# Siddhesh Raje — Portfolio

A Next.js (App Router) portfolio site for a front-end developer working across
Blockchain and AI. Career history is rendered as a literal chain of "blocks",
each one hash-linked to the last.

## Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Self-hosted fonts via @fontsource (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
- lucide-react / framer-motion (installed, ready if you want to extend animations)

## Run locally

    npm install
    npm run dev

Then open http://localhost:3000

## Build for production

    npm run build
    npm start

## Editing your content

All resume content lives in one place: src/data/resume.ts
Update your profile, experience, projects, education, certifications, and
skills there — the whole site re-renders from that file.

Your resume PDF is served from public/Siddhesh_Raje_Resume.pdf and linked
from the "Resume.pdf" button in the nav bar. Replace that file to update the
downloadable resume.

## Deploying


