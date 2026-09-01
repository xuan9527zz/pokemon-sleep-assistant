# Strategy, guide standards, and release safety

## Evidence layers

Mechanical output is calculated from verified species data. Strategic-role evidence comes from the reviewed 2026-08-17 Bilibili guide image and is stored in project-root `pokemon-strategy.js`. Game8 is a qualitative cross-check. Never disguise a guide judgment as a verified base rate.

## Strategic-role adjustment

Use a bounded gap-filling adjustment:

`bonus = clamp(target floor - mechanical score, 0, species max bonus)`

Only verified scarce roles receive a target floor. Current examples include Flygon as the best avocado specialist and Toxicroak as the pure-oil specialist. Cramorant, Clodsire and Farfetch'd may receive smaller alternative-role adjustments. A helper such as Meowscarada that already has a healthy mechanical score receives no duplicate bonus.

The tooltip must show mechanical score, role, reason, bonus and adjusted species score. Strategic value never changes the underlying production calculation.

## Helping Bonus

Helping Bonus affects all five helpers and stacks across the team. It is a graduation requirement for guide-defined permanent support and berry-core roles, while remaining an optional effective gain for ordinary or short-deployment tool skill helpers.

For each member:

1. Calculate their unlocked Helping Speed reduction.
2. Add `5% × number of unlocked Helping Bonus skills in the team`.
3. Cap combined speed reduction at 35%.
4. Convert interval to output with `(1 - own reduction) / (1 - combined reduction)`.

Do not apply a flat `1 + 5% × count` multiplier to the finished team score. Helping Bonus contributes to both individual subskill quality and real team output; those are different views, not double-counting inside one formula.

For strict berry-helper selection, also read the guide-derived team-context evidence in [berry-selection-guide.md](berry-selection-guide.md). In particular, Berry Finding S is the entry prerequisite, while the guide treats Helping Bonus as a long-term team-core requirement for conventional berry specialists, formal healers and Berry Burst helpers used in berry positions. A mature berry position should combine Berry Finding S, Helping Bonus and an effective personal speed gain; neither Berry Finding S + Helping Bonus without personal speed nor a fast Berry Finding S panel without Helping Bonus is the complete target. Do not declare Helping Speed S universally useless: calculate how much of its 7% remains before the 35% subskill/team cap for the actual lineup. Speed-up nature is applied outside that cap.

## Lv.50 guide minimums

- Berry: Berry Finding S within Lv.50 plus Helping Bonus, speed, or speed nature. Graduation requires Berry Finding S + Helping Bonus plus another effective speed gain. The course supports this three-part structure; the remaining implementation gap is that a speed subskill should count only to the extent that the planned team has room below the 35% cap.
- Ingredient: actual Ingredient Finder M within Lv.50 plus another primary gain and the required ingredient route. Graduation is Ingredient Finder M plus any two additional effective gains; Helping Bonus is optional. AAA is the default long-term route, while only course-verified species-specific ABB exceptions may graduate.
- Formal healer: Skill Trigger M within Lv.50 plus Helping Bonus and one more effective personal gain. A healer without Helping Bonus is a transition helper under the course's strict permanent-support standard, even when its personal trigger expectation is strong.
- Ordinary or short-deployment tool skill helper: Skill Trigger M within Lv.50 plus any two additional effective gains. Helping Bonus is useful but not mandatory. Do not make a candidate wait until Lv.70 or Lv.80 to unlock Skill Trigger M merely because the eventual full panel is strong.
- Berry-oriented skill helpers: Berry Finding S within Lv.50 plus team or personal-speed value; graduation requires Berry Finding S + Helping Bonus plus personal speed. Skill Trigger M cannot replace the personal-speed part of a Berry Burst helper used in a berry position. Direct-Energy helpers remain second-line berry substitutes rather than dedicated berry-hunt targets.

These standards are hunt filters, not automatic numeric score overrides.

For ingredient helpers, also read the course-derived route and panel evidence in [ingredient-selection-guide.md](ingredient-selection-guide.md). The executable selection layer now uses AAA as the default long-term route, limits ABB graduation to reviewed species examples, labels AAB/AAC as Lv.30 workers with an Lv.59 investment ceiling, and no longer requires Helping Bonus for ingredient graduation. The numeric route coefficients remain unchanged and provisional because the course does not provide replacement production factors.

For skill helpers, read the course-derived role and panel evidence in [skill-selection-guide.md](skill-selection-guide.md). The executable selection layer now separates formal healers, ordinary helpers, short-deployment tools and Berry Burst berry positions. Formal healers require Helping Bonus; ordinary and tool helpers do not. Dedenne receives the documented 16-gauge compromise label, while ordinary easy-hunt two-gain panels remain transitional. These selection labels do not change the main-skill output coefficient.

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
