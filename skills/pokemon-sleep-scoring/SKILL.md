---
name: pokemon-sleep-scoring
description: Calculate, explain, audit, or revise Pokémon Sleep helper scoring, strategic roles, team contribution, weekly hunt standards, and safe box-retention advice. Covers berry, ingredient, skill and all-rounder helpers, subskills, natures, ingredient routes, species models, Helping Bonus stacking, and final-form mapping. Do not use for event-news lookup unless scoring or team planning is also requested.
---

# Pokémon Sleep Scoring

Use one reproducible data flow. Do not recreate scoring tables inside a webpage or prose answer.

## Required workflow

1. Read [references/scoring-rules.md](references/scoring-rules.md) for every scoring task.
2. Read [references/main-skill-models.md](references/main-skill-models.md) when skill specialists, healers, special Pokémon, or team replacement values are involved.
3. Read [references/strategy-rules.md](references/strategy-rules.md) when evaluating strategic ingredient roles, Helping Bonus, weekly hunting, cultivation priority, or release safety.
4. Read [references/berry-selection-guide.md](references/berry-selection-guide.md) when judging strict berry-helper selection, Berry Burst or direct-Energy helpers used in berry slots, Helping Bonus team saturation, or speed-cap overflow.
5. Read [references/ingredient-selection-guide.md](references/ingredient-selection-guide.md) when judging ingredient-route graduation, AAA/ABB exceptions, temporary workers versus long-term cultivation, ingredient-panel strictness, or Lv.60 investment.
6. Read [references/skill-selection-guide.md](references/skill-selection-guide.md) when judging formal healers, ordinary or short-deployment tool skill helpers, role-specific Helping Bonus requirements, friendship-gauge exceptions, or Lv.50 versus Lv.70 investment timing.
7. Treat [scripts/scoring-core.js](scripts/scoring-core.js) as the executable source of truth for individual scoring. Use [scripts/box-scores.js](scripts/box-scores.js) for box-wide scores and legal-ceiling audits.
8. Treat [scripts/species-scores.js](scripts/species-scores.js) and the team-ranking scripts as the executable source for species and main-skill models. Never copy their old output back into a second handwritten table.

## Non-negotiable rules

- Separate mechanical score, strategic-role adjustment, cultivation advice, and release advice. Each answers a different question.
- Neutral nature is `0`; a harmful nature is negative. Preserve multiplicative interactions.
- Apply only legal Sub Skill Seed upgrades. When S and M coexist, keep both slots and score both.
- Ingredient-route coefficients affect only ingredient/all-rounder individual quality, never the species base score.
- Map an unevolved helper to its selected final form. Keep Mew and Darkrai pending until their all-rounder formula is confirmed.
- Helping Bonus stacks for every team member. Recompute each member from their own speed reduction and enforce the combined 35% speed-reduction cap.
- A strategic-role adjustment may fill a bounded verified role gap, but may not erase a poor individual, invent output, or duplicate value already expressed by the mechanical score.
- Never release automatically. Shiny collection, unique ingredient routes, strategic minimums, limited Pokémon, and invested individuals require explicit safeguards.
- Mark estimates and guide-derived judgments as provisional or strategic. Use Game8 qualitatively and verified RaenonX data quantitatively.

## Maintenance

When a rule changes, update the shared script and its matching reference in the same change. Rebuild the catalog and box snapshot, run all tests, and validate both the project copy and installed copy of this skill.

Common checks:

```powershell
node skills/pokemon-sleep-scoring/scripts/box-scores.js --self-test
node skills/pokemon-sleep-scoring/scripts/box-scores.js --format js --output box-scores.generated.js
node scripts/build-pokemon-catalog.js
```
