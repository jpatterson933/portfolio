# Portfolio refresh

The portfolio now presents the wider body of work in the local repositories, with a searchable directory and a consistent content model.

## Epic: Make the body of work easy to understand and explore

### Story: Understand the engineer and the work

As a visitor, I can see who Jeffery is, what he builds, and representative projects before browsing the full catalog.

Acceptance criteria:

- The introduction identifies the engineer, location, and focus.
- Six featured projects cover platforms, AI products, developer tools, and operations.
- Project names describe their purpose; client and organization identities are generalized.
- Contact and professional profile links are accessible from the page.

### Story: Find relevant projects

As a visitor, I can narrow the portfolio by a topic, category, type, or technology.

Acceptance criteria:

- Search matches names, descriptions, types, categories, and technology tags.
- Search terms are case-insensitive and whitespace-separated terms combine with AND.
- Category, type, technology, and search filters work together.
- Counts reflect the filtered results; changing filters resets the visible batch.
- Empty results offer recovery; clearing filters restores the full catalog.
- Show more reveals the next batch without losing the selected filters.

### Story: Understand the technical breadth

As a visitor, I can see technologies grouped by their use and how many listed projects use each one.

Acceptance criteria:

- Counts derive from the project data.
- Duplicate technologies within a project and duplicate project slugs fail validation.
- Project classification separates prototypes, experiments, internal tools, products, and writing.

### Story: Browse on different devices

As a visitor, I can use the site on a phone, with a keyboard, or with reduced motion enabled.

Acceptance criteria:

- Controls have labels, category buttons expose pressed state, and result counts announce changes.
- Layouts work from 320px through desktop without horizontal overflow.
- A skip link, visible focus, semantic headings, and section navigation are present.
- Reduced-motion preferences disable smooth scrolling and transitions.

### Story: Maintain trustworthy content

As the owner, I can trace the catalog back to local source material and extend it without repeating data across sections.

Acceptance criteria:

- Every reviewed repository appears in the source mapping, grouping notes, or exclusions. Identifying source labels use descriptive aliases.
- Unfinished infrastructure is described by implemented behavior, not its aspirational name.
- Clones, empty folders, and insufficiently documented sketches do not become claimed products.
- Existing framework choices, named exports, strict typing, and schema validation are preserved.
- No dependency on sibling repositories, secrets, local datasets, or external font downloads at runtime or build time.

## Validation record

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; statically prerendered homepage.
- `npm run test:browser`: passed against the production server on local port 3100.
- Browser checks covered all 61 catalog entries, combined filters, empty-state recovery, pagination, section links, keyboard navigation, and reduced motion.
- No horizontal overflow at 320, 390, 768, 1024, or 1440 pixels.
- Desktop and mobile screenshots were inspected.
- Google Font downloads were replaced with bundled Geist files and their license.

The repeatable browser suite is `npm run test:browser` against a running local server. External website availability and the behavior of the source projects themselves were not tested.
