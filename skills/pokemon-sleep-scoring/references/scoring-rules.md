# Unified scoring rules

## Data flow

The project has one score pipeline:

`verified species data -> mechanical species model -> bounded strategic adjustment -> shared individual core -> final score -> cultivation/retention advice`

- `scripts/scoring-core.js`: subskills, legal seed upgrades, slot timing, nature and ingredient route.
- `scripts/species-scores.js`: berry, ingredient and skill species mechanics.
- `pokemon-strategy.js` at project root: strategic roles and guide minimums.
- `scripts/box-scores.js`: final-form mapping and box snapshot.
- Root `pokemon-scoring.js`: thin browser/Node adapter; it must not own another scoring table.

## Final score

For berry, ingredient and skill specialists:

`final = adjusted species score × 75% + individual score × 25%`

The adjusted species score is the mechanical score plus any bounded strategic-role adjustment, clamped to 0–100. The tooltip must disclose the mechanical score, strategic adjustment, adjusted score, individual score and all components.

All-rounders remain pending until their model is confirmed.

## Individual score

Slot levels are `10 / 25 / 50 / 70 / 80` with weights `25% / 25% / 25% / 15% / 10%`.

1. Apply the highest legal Sub Skill Seed state.
2. Score every slot for the helper's role.
3. Preserve S+M as two independent slots.
4. Put multiplicative interaction value on the later relevant slot.
5. Normalize actual weighted output by the best legal five-slot build for the same role.
6. Calculate `individual before route = clamp(subskill percent × 70% + signed nature percent × 30%, 0, 100)`.
7. For ingredient specialists only, multiply by the ingredient-route coefficient.

Current legal benchmark builds:

- Berry: Berry Finding S, Helping Bonus, Helping Speed M, Helping Speed S, Skill Trigger M.
- Ingredient: Helping Bonus, Ingredient Finder S, Ingredient Finder M, Helping Speed M, Helping Speed S.
- Skill: Helping Bonus, Skill Trigger S, Skill Trigger M, Helping Speed M, Helping Speed S.

Always derive the legal ceiling with `scoring-core.js`; never assume five copies of a best skill.

## Subskill role values

The executable values live only in `scoring-core.js`. Important confirmed anchors are:

| Subskill | Berry | Ingredient | Skill |
|---|---:|---:|---:|
| Berry Finding S | 100 | 25 provisional | 10 provisional |
| Helping Bonus | 75 | 75 | 75 |
| Helping Speed M / S | 47 / 22 | 45 / 21 | 45 / 21 |
| Ingredient Finder M / S | dynamic negative | 100 / 50 | 0 / 0 |
| Skill Trigger M / S | 30 / 15 provisional | 25 / 12.5 provisional | 100 / 50 |
| Skill Level Up M / S | 8 / 4 provisional | 8 / 4 provisional | 8 / 4 |
| Inventory Up L / M / S | 8 / 5 / 3 provisional | 25 / 12 / 6 provisional | 0 / 0 |

Resource skills are deliberately modest: Sleep EXP Bonus 20, Energy Recovery Bonus 12, Dream Shard Bonus 10, Research EXP Bonus 8.

For berry specialists, Ingredient Finder is negative and must use the final form's ingredient rate. Helping Speed, role probability, and Berry Finding interactions are multiplicative.

## Nature

Use `scripts/nature-scores.js`. Neutral is `0`, benefits are positive, penalties are negative. The best relevant nature is normalized to `100` before its 30% individual weight. Do not hide a baseline in the nature component.

## Ingredient route

Only ingredient specialists and future all-rounders use this coefficient:

| Route | Coefficient |
|---|---:|
| AAA | 1.00 |
| ABB | 0.85 |
| ABA | 0.80 |
| AAB / AAC | 0.70 |
| ABC or unlisted | 0.50 |

This is a long-term Lv.70 route judgment. It changes individual quality, not species mechanics.

## Mechanical species models

- Ingredient species: production 80%, final-form inventory 10%, main-skill synergy 10%. Production is ingredient-count efficiency 60% and base-strength efficiency 40%. Use the confirmed eight-hour unattended model and the evolved carry limit.
- Berry species: Lv.70 berry production 90% and main-skill synergy 10%. Production includes interval, ingredient-rate berry loss, base berry count and Lv.70 berry strength. Keep full-bag Sneaky Snacking as a separate scenario, never as the primary score.
- Both roles use main-skill type fit 50%, trigger efficiency 40%, natural main-skill level 10%.
- Skill species use the team-calibrated model described in `main-skill-models.md`.

## Cultivation and retention separation

Scores measure potential. Cultivation advice also considers account stage, strategic role, direct superiors, stability, operation cost and team fit. Retention compares the same final form: ordinary helpers have four practical slots, limited special helpers one. Rank 5 or rank 2 respectively may become a release candidate only after the safeguards in `strategy-rules.md`.
