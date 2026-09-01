# Strategy, guide standards, and release safety

## Evidence layers

Mechanical output is calculated from verified species data. Strategic-role evidence comes from the reviewed 2026-08-17 Bilibili guide image and is stored in project-root `pokemon-strategy.js`. Game8 is a qualitative cross-check. Never disguise a guide judgment as a verified base rate.

## Strategic-role adjustment

Use a bounded gap-filling adjustment:

`bonus = clamp(target floor - mechanical score, 0, species max bonus)`

Only verified scarce roles receive a target floor. Current examples include Flygon as the best avocado specialist and Toxicroak as the pure-oil specialist. Cramorant, Clodsire and Farfetch'd may receive smaller alternative-role adjustments. A helper such as Meowscarada that already has a healthy mechanical score receives no duplicate bonus.

The tooltip must show mechanical score, role, reason, bonus and adjusted species score. Strategic value never changes the underlying production calculation.

## Helping Bonus

Helping Bonus is a graduation-level team skill because it affects all five helpers and stacks across the team.

For each member:

1. Calculate their unlocked Helping Speed reduction.
2. Add `5% × number of unlocked Helping Bonus skills in the team`.
3. Cap combined speed reduction at 35%.
4. Convert interval to output with `(1 - own reduction) / (1 - combined reduction)`.

Do not apply a flat `1 + 5% × count` multiplier to the finished team score. Helping Bonus contributes to both individual subskill quality and real team output; those are different views, not double-counting inside one formula.

## Lv.50 guide minimums

- Berry: Berry Finding S within Lv.50 plus Helping Bonus, speed, or speed nature. Graduation requires Berry Finding S + Helping Bonus plus another speed gain.
- Ingredient: Ingredient Finder M, or seedable S when M is absent, within Lv.50 plus another primary gain and the required ingredient route. Graduation adds Helping Bonus and another primary gain. Mature accounts prefer AAA long term.
- Skill: Skill Trigger M, or seedable S when M is absent, within Lv.50 plus another primary gain. Graduation adds Helping Bonus and another primary gain. Formal healers especially value Helping Bonus.
- Berry-oriented skill helpers: Berry Finding S within Lv.50 plus team/speed/trigger value; graduation requires Berry Finding S + Helping Bonus plus another gain.

These standards are hunt filters, not automatic numeric score overrides.

## Weekly hunt board

For the selected island, show guide targets in this priority order:

1. Missing role.
2. Existing helper below the minimum.
3. Existing helper meeting minimum but not graduation.
4. Covered/graduation target.

Display the best box individual, its individual score, minimum status and missing requirements. The island list, source note and strategy profiles all come from `pokemon-strategy.js`.

## Release safety

- Compare only the same scored final form. Ordinary practical limit is four; limited Special Pokémon practical limit is one.
- Latias and Latios are separate groups and can coexist.
- Shiny helpers default to collection and never receive an automatic release prompt.
- If a rank-below-limit helper meets a strategic minimum and its ingredient route is not represented among retained higher-ranked copies, change the verdict to manual strategic review.
- Within the limit, a helper meeting a scarce-role minimum is retained for that role even when the mechanical score is modest.
- A fifth ordinary copy with the same already-covered route may still be a release candidate.
- Never release automatically. Warn about investments, event limitation and collection intent.

