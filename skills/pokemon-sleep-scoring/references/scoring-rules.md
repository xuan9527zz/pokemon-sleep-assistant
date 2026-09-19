# Unified scoring rules

## Data flow

The project has one evaluation pipeline:

`selected final form -> user S/A/B/C tier + shared individual core + graduation rules -> cultivation/retention advice`

- `scripts/scoring-core.js`: subskills, legal seed upgrades, slot timing, nature and ingredient route.
- `scripts/species-tiers.js`: user-maintained species tier; unlisted final forms default to C.
- `scripts/species-scores.js`: internal berry, ingredient and skill production diagnostics for team/island/event calculations, not a displayed species score.
- `pokemon-strategy.js` at project root: strategic roles and guide minimums.
- `scripts/box-scores.js`: final-form mapping and box snapshot.
- Root `pokemon-scoring.js`: thin browser/Node adapter; it must not own another scoring table.

## Displayed evaluation

For berry, ingredient, skill and all-rounder helpers, display three separate results:

`species tier (S/A/B/C) + individual quality (0–100) + graduation status`

Do not calculate or display a 75/25 combined percentage. `finalScore` remains only as a compatibility alias for `individualScore` in existing data consumers and must equal it exactly. Sorting by species strength uses tier order first, then individual quality.

The user tier table is authoritative for hunt priority. Any final form not listed there is C until the user changes it. Mew is dynamic: Berry Burst is S; every other selected All-Mighty skill is B. Production engines may still calculate ordinary production and main-skill effects for team planning, but those values do not mutate the tier.

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
- The old equal-average all-rounder benchmark remains available only for historical diagnostics; it is not the current mythical individual denominator.

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

For Mew and Darkrai, calculate three independent channel scores with the ordinary berry, ingredient and skill tables. Normalize each channel against the legal benchmark restricted to the same currently opened subskill slots. Unopened Eureka Seed slots are unknown potential, not zero-value subskills. Apply the ingredient-route coefficient only to the ingredient channel, then use the explicitly selected focus channel or, in automatic mode, the strongest adjusted channel. The tooltip must disclose all three channel scores and which one supplied the individual score.

For berry specialists, Ingredient Finder is negative and must use the final form's ingredient rate. Helping Speed, role probability, and Berry Finding interactions are multiplicative.

## Nature

Use `scripts/nature-scores.js`. For ordinary helpers, neutral is `0`, benefits are positive, penalties are negative. The best relevant nature is normalized to `100` before its 30% individual weight. Do not hide a baseline in the nature component.

Mew and Darkrai are exceptions because their Nature is fixed for every researcher and Eureka Seeds cannot reroll it. Preserve and display the fixed Nature, but do not reserve 30 individual points for an impossible better roll. Their mythical individual score is the selected channel's opened-slot subskill quality instead.

## Ingredient route

Ingredient specialists use this coefficient on their individual score. All-rounders use it only on their ingredient channel:

| Route | Coefficient |
|---|---:|
| AAA | 1.00 |
| ABB | 0.85 |
| ABA | 0.80 |
| AAB / AAC | 0.70 |
| ABC or unlisted | 0.50 |

This is a long-term Lv.70 route judgment. It changes individual quality, not the species tier.

These coefficients remain provisional display inputs. The course-derived selection layer separately enforces route eligibility: AAB/AAC are Lv.30 workers with an Lv.59 investment ceiling, unverified ABB requires species production evidence, and a high numeric individual score cannot restore a long-term graduation or core-cultivation label.

## Internal production models

- Ingredient species: production 80%, final-form inventory 10%, main-skill synergy 10%. Production is ingredient-count efficiency 60% and base-strength efficiency 40%. Use the confirmed eight-hour unattended model and the evolved carry limit.
- Berry species: Lv.70 berry production 90% and main-skill synergy 10%. Production includes interval, ingredient-rate berry loss, base berry count and Lv.70 berry strength. Keep full-bag Sneaky Snacking as a separate scenario, never as the primary score.
- Both roles use main-skill type fit 50%, trigger efficiency 40%, natural main-skill level 10%.
- Skill species use the team-calibrated model described in `main-skill-models.md`.
- All-rounder production diagnostics use the shared skill-team slot anchor, but include their own ordinary berry/ingredient production and current main-skill variant. Their individual score exposes separate berry, ingredient and skill channels so a specialized Eureka Seed build is not diluted by two roles it was not built to fill.

These models remain necessary for current-team production, island recommendations, and event simulation. They are diagnostics and calculators, not a user-facing species score and not an input to the individual percentage.

## Cultivation and retention separation

Tier measures hunt priority; individual quality measures the panel. Cultivation advice also considers account stage and the course-derived Lv.50/Lv.60 qualification gate. Failing that gate caps the cultivation label without rewriting the tier or individual quality. Retention compares the same final form: ordinary helpers have four practical slots, limited special helpers one. Rank 5 or rank 2 respectively may become a release candidate only after the safeguards in `strategy-rules.md`.
