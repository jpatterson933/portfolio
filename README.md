# Jeffery Patterson Portfolio

A responsive portfolio of software, tools, experiments, and writing. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Zod.

## Development

```bash
npm ci
npm run dev
```

Open http://localhost:3000. The site requires no credentials or external services. Geist fonts are bundled locally so builds do not depend on Google Fonts.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

To run browser checks against a production build, start the server in a separate terminal:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000
npm run test:browser
npm run test:character-stats
```

Set `PORTFOLIO_BASE_URL` to test another local port. The browser checks cover search, combined filters, empty-state recovery, pagination, keyboard navigation, section links, and responsive overflow. Puppeteer provides the browser.

The character stats checks cover lazy loading, graphics fallback, modal keyboard behavior, mobile layout, reduced motion, and renderer cleanup. Set `PORTFOLIO_SCREENSHOT_DIR` to save preview screenshots.

## Character stats

The floating **See character stats** button opens a character sheet with a continuously animated 3D hologram. Counts come from the portfolio catalog. Attribute bars represent project counts relative to the largest category, not proficiency ratings.

`src/app/modules/character-stats/` owns the data schema, derived stats, dialog, styles, Babylon.js scene, and GPU shaders. The scene loads only when the sheet opens. It uses WebGPU when available, falls back to WebGL, and preserves the readable stats if neither works. Closing the sheet releases graphics resources. Reduced-motion users get a static projection.

### Railway

Use `npm ci`, `npm run build`, and `npm run start`. Next.js uses Railway's `PORT` environment variable. Rendering runs in the visitor's browser; the server needs no GPU or separate graphics service.

The `prebuild` and `predev` scripts copy version-matched WebGPU compiler assets from the installed Babylon.js package into `public/character-stats/vendor/`. These generated files are ignored by Git and served locally, with no runtime CDN dependency. If deploying a custom standalone image, copy `public/` and `.next/static/` alongside the standalone server, including these generated assets.

## Content

- `src/app/data/portfolio.ts`: profile and project content, validated at import.
- `src/app/data/schemas.ts`: project categories, types, and validation rules.
- `src/app/lib/projects.ts`: shared filtering, technology counts, and project links.
- `src/app/components/`: reusable page sections and controls.
- `src/app/globals.css`: shared layout, colors, typography, and responsive rules.
- `docs/repository-review.md`: source mapping, grouped repositories, and exclusions.
- `docs/portfolio-refresh.md`: scope, user stories, and acceptance criteria.

To add a project, supply a unique kebab-case `slug`, use its approved public display name, choose a category and type, and add a concise description and verified technologies. Use `featured: true` to include it in Selected Work. Skills, counts, and filters derive from the same data.

Generalize client and organization names in project titles, slugs, descriptions, and links. Keep employer attribution and technology/vendor names where they describe your background or the tools used.

Only add public links supported by the source material that do not reveal a generalized client or project. Package versions describe the reviewed checkout, not a live registry check. Avoid inferred ownership, release status, usage numbers, or business impact.

## Conventions

- PascalCase component filenames and exported components; camelCase functions and variables.
- Zod schemas as validation boundaries, with inferred TypeScript types.
- Server components by default; client state limited to interactive controls.
- Named exports, `@/` imports, small components, and shared pure functions.
- Use `feat(scope): description`, `fix(scope): description`, or `docs(scope): description` for future commits. Branch names use `codex/` plus a short kebab-case description; include a real issue identifier when one exists.
- Describe work as an epic with outcome-focused stories and testable acceptance criteria. No fabricated ticket IDs.

## Other artifacts

Run `npm run resume` with Node.js 22.6 or newer to regenerate `Jeffery_Patterson_Resume.pdf`. Use `npm run resume -- --output /path/to/resume.pdf` for a separate copy. The generator embeds the bundled Geist font, needs no external assets, and rejects content that exceeds one US Letter page before replacing the PDF.

Edit the résumé content in `scripts/generate-resume.ts`. Employment dates are explicit, with AE Studio listed as current. Project names remain generalized where needed. The résumé is curated separately from the website catalog, so changing a project does not automatically change the PDF. The older PDF under `assets/media/` is a separate artifact.

The bundled Geist fonts retain their SIL Open Font License in `src/app/fonts/OFL.txt`.
