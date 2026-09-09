# Character card design

## Brief

A Path of Exile 2-inspired character panel for Jeffery Patterson's real portfolio stats. Retain the seven disciplines, six technologies, and project totals. Keep the floating launcher, native modal behavior, and smoothly looping bubbles inside the bars. No avatar, extra controls, ambient bubbles, orbital graphics, or rainbow palette.

Reference: https://mobalytics.gg/poe-2/guides/user-interface (game UI and resource-meter screenshots). This is an original interface borrowing material and information-design cues, not copied game art.

## Tokens

- Obsidian `#0c0e10`: panel foundation.
- Iron `#121518`: inset surfaces and bevels.
- Green metal `#536a43`: structural frame and engraved details.
- Site accent `#c4f080`: headings and key totals.
- Foreground `#eff0ec`: readable foreground.
- Liquid green `#a3d074`: a single shared fill color for project experience.

Type: Georgia for the character name, panel headings, skill names, and numbers. Locally bundled Geist for small explanatory text. Serif type and material depth carry the fantasy reference; monospace chrome is removed.

## Layout

A centered character dossier, with a shallow identity header above a wider attributes column and a narrower equipment panel. Names align left and counts right for scanning. Equipment is a recessed inventory surface, not a second copy of the stats panel. The footer consolidates totals.

```text
+---------------- Character ----------------x+
| [engraved seal] Jeffery Patterson | archive |
|                 Software engineer |   61    |
+--------------------------------------------+
| Core attributes         | Equipped stack   |
| Name                 07 | [sigil] TypeScript|
| [green liquid========= ] |        40 projects|
| ... seven disciplines   | ... six tools    |
+--------------------------------------------+
| 94 technologies | 5 open source | 7 domains |
|       Actual counts, not skill ratings      |
+--------------------------------------------+
```

## Critique before implementation

The previous rounded charcoal card, neon numbers, numbered sections, badge, and background effects could belong to any futuristic dashboard. This revision replaces them with a consistent physical metaphor: an engraved character ledger. Ornament belongs to the frame and seal. The skill meters provide the one sustained animated feature. A common color means all bars encode the same quantity; width, labels, and actual counts carry the differences.

The outline is rectangular with shallow bevels, not identical rounded rectangles. No invented levels or rarity labels. Bubbles remain small and contained; their closed circular paths have matching endpoints. Reduced motion shows completed values immediately. Desktop and mobile screenshots are part of the final review.

## Visual review

Reviewed the rendered desktop and mobile panels. The frame, seal, headings, and equipment slots share one green-metal treatment. The bars use one green liquid and keep their round bubbles contained. The ambient particles, orbital rings, colored washes, numbered sections, and neon counter glows are removed. Mobile stacks the equipment beneath the full-width attributes, with every total reachable by scrolling. Browser checks verify the final values, shared fill color, loop continuity, focus restoration, cleanup, and reduced motion.

The card shares the site background, foreground, and accent CSS tokens. The user requested the existing green theme; metal details now use moss-green shadows and pale green highlights. Layout and motion remain unchanged.
