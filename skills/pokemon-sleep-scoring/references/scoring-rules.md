# Unified scoring rules

## One pipeline

`selected final form -> user species tier -> role output multiplier -> individual grade -> cultivation matrix`

- `scripts/scoring-core.js` is the only individual formula source.
- `scripts/species-tiers.js` is the user-maintained species S/A/B/C table; unlisted final forms default to C.
- Root `pokemon-scoring.js` maps catalog records and Berry Burst roles into the core.
- `scripts/box-scores.js` only builds the initial box snapshot.
- Team, island and event production calculators keep their verified mechanics; the individual multiplier does not replace them.

Never reintroduce a species percentage or a species/individual combined score.

## Shared individual baseline

Display `species tier + individual grade + output multiplier`.

The output multiplier uses the same final form as its own blank baseline (`1.00`): same ingredient route, level, main-skill level, collection timing and team assumptions. Only nature and ordinary subskills change. Count all five known ordinary subskill slots as long-term potential, even when they unlock later.

Show both:

- current multiplier: current nature and subskills;
- potential multiplier: highest legal Sub Skill Seed upgrades plus Plain Mint only when neutralizing the current nature improves output.

The individual grade uses potential multiplier. Non-output resource subskills and Skill Level Up S/M are `1.00` in this role multiplier. Helping Bonus contributes its 5% self-speed effect; its additional team value is handled by team calculators.

## Role formulas

### Skill and recovery helpers

Compare expected triggers per day, including help speed, trigger probability, pity and timely collection.

- With Helping Bonus: S `>=2.00`; A `1.70–<2.00`; B `1.60–<1.70`; otherwise C.
- Without Helping Bonus: never S; A `>=1.84`; B `1.75–<1.84`; otherwise C.

All ordinary skill helpers use this table. Berry Burst is evaluated as a berry role instead.

### Ingredient helpers

Compare target/natural ingredient production: help speed × ingredient probability. Main-skill output is excluded.

- With Helping Bonus: S `>=1.90`; A `1.70–<1.90`; B `1.60–<1.70`; otherwise C.
- Without Helping Bonus: S `>=2.00`; A `1.75–<2.00`; B `1.63–<1.75`; otherwise C.
- AAA uses the resulting grade.
- ABB can never exceed B, but is not raised to B if the multiplier is C.
- Other mixed routes are C for long-term individual evaluation.

### Conventional berry helpers

Compare natural berry energy only. Ingredient Finder and ingredient-up Nature are negative; ingredient-down Nature is positive. Main-skill probability and Skill Level Up are neutral.

Berry Finding S is required; without it the grade is C.

- With Helping Bonus: S `>=2.00`; A `1.84–<2.00`; B `1.70–<1.84`; otherwise C.
- Without Helping Bonus: never S; A `>=2.00`; B `1.84–<2.00`; otherwise C.

### Berry Burst

Treat main-skill IDs 17, 21 and 35 as berry-position helpers. Compare total berry energy from natural berry helps plus skill-generated berries. Berry Finding S is required.

- S `>=2.00`; A `1.85–<2.00`; B `1.60–<1.85`; otherwise C.
- Helping Bonus is a team-oriented/selfish tag, not an S requirement. A selfish Berry Burst build can be S.
- Under a four-Helping-Bonus lineup, the speed-reduction cap can make Skill Trigger S more valuable than Helping Speed S. Team calculations must apply the actual cap rather than a context-free flat bonus.

Calibration anchors:

- Perfect Gardevoir trigger multiplier: about `2.33`.
- Perfect Typhlosion natural berry multiplier: about `2.37`.
- Perfect Sceptile Berry Burst multiplier: about `2.24`.

## Mythical all-rounders

Mew and Darkrai retain three independent berry, ingredient and skill channels. Fixed Nature does not create an impossible nature deficit, and unopened Eureka slots do not count as zero. Normalize the selected channel against the same opened-slot ceiling, then express it on the same multiplier/grade scale. Mew with Berry Burst uses the Berry Burst species tier and berry-role interpretation; other Mew skills use the corresponding skill focus.

## Cultivation matrix

First compute the base result from species tier × individual grade:

| Species \ Individual | S | A | B | C |
|---|---|---|---|---|
| S | Core | Recommended | Stage | No-train |
| A | Recommended | Recommended | Transition | No-train |
| B | Transition | Transition | Transition | No-train |
| C | No-train | No-train | No-train | No-train |

If the base result is not No-train, use it even for shiny or limited helpers. If it is No-train, shiny or limited becomes Collection Protection; everything else becomes Release. Existing investment, box placement and unique ingredient route do not override this decision. Missing data becomes Manual Review. Release is only an advice label; the site never deletes automatically.
