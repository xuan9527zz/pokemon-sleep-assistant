# Guide-derived strict berry-helper selection

## Source status

This reference records the meaning of 21 user-supplied course frames about strict berry-helper selection. It is guide evidence, not a verified species-data source. The frames were reviewed on 2026-09-01; the author and original video URL were not supplied. Preserve the lesson's claims separately from RaenonX mechanics and from the executable numeric score.

## Why the guide recommends strict selection

- Sleep research resources become less efficient after many encounters in one daily settlement, while island encounter pools are increasingly type-specific. Targeted hunting therefore consumes island rotations and limited encounters.
- Berry specialists are expensive to raise toward the current version level cap, and released or replaced helpers do not refund their invested resources.
- The guide therefore recommends raising the chosen berry core toward the version cap first and avoiding marginal long-term investments.

These points influence hunting, cultivation and release advice. They do not directly alter a verified production rate.

## Functional berry-position groups

Judge a helper by the team position it occupies, not only by its Pokédex specialty.

1. Conventional berry specialists are the main berry-position candidates.
2. Berry Burst skill helpers shown in the lesson—Latios, Sceptile, Infernape, Braviary and Mimikyu—should be selected with berry-position standards when they are intended to fill that role.
3. Direct-Energy helpers shown—Darkrai, Ampharos, Noivern and Espeon—are described as roughly second-line berry output. The guide does not recommend dedicated hunting and strict selection for them solely as berry substitutes.

The named lists describe the supplied lesson, not an exhaustive future-proof species list. Classify new helpers by mechanism and team role before extending them.

## Strict selection standard

- Berry Finding S is the entry prerequisite for a long-term berry position. If it is absent from the reachable selection window, stop calling the helper a strict berry candidate regardless of its other speed gains.
- For a mature team, Helping Bonus is treated as a core graduation skill on conventional berry specialists, formal group healers and Berry Burst helpers used in berry positions.
- The complete long-term berry target is not merely `Berry Finding S + Helping Bonus`, and it is not a fast but team-selfish `Berry Finding S + Helping Speed M + speed nature` panel without Helping Bonus. The course's closing frames warn that either incomplete archetype occupying a permanent berry slot can reduce total team strength. Aim to combine Berry Finding S, Helping Bonus and effective personal speed.
- Helping Speed M, Helping Speed S and speed-up nature remain useful only after checking the planned lineup's remaining speed-cap headroom.
- A helper may be a good temporary worker without meeting the strict standard. Keep `usable now`, `minimum keep`, `long-term core` and `release candidate` as separate outcomes.

The course's emphasis on Helping Bonus is primarily team value: it can slightly lose an isolated self-output comparison and still produce the better five-helper team.

The phrase in the closing subtitle has compressed punctuation: `Berry Finding S + Helping Bonus` and the `Berry Finding S + double-speed` selfish panel are shown as two incomplete alternatives. The surrounding frames define `double-speed` as Helping Speed M plus speed-up nature, not Helping Speed M plus Helping Speed S. Preserve that interpretation unless the original audio or transcript becomes available.

## Speed-cap arithmetic in the lesson

The displayed mechanics use:

- Helping Bonus: 5% team speed reduction per unlocked copy.
- Helping Speed M: 14%.
- Helping Speed S: 7%.
- Speed-up nature: interval multiplier ×0.9.
- Helping Bonus plus Helping Speed subskills: combined reduction capped at 35%.
- Speed-up nature is applied after the capped reduction and can therefore add value beyond the 35% cap.

Displayed interval-ratio examples:

| Team context and helper panel | Remaining interval ratio |
|---|---:|
| Five Helping Bonuses, Berry Finding S + Helping Bonus | `1 - 5% × 5 = 75%` |
| No Helping Bonus, Berry Finding S + Helping Speed M + speed nature | `(1 - 14%) × 0.9 = 77.4%` |
| Three Helping Bonuses, Berry Finding S + Helping Bonus | `1 - 5% × 3 = 85%` |
| Three Helping Bonuses, Berry Finding S + Helping Speed M + speed nature | `[1 - (14% + 5% × 3)] × 0.9 = 63.9%` |
| Four Helping Bonuses, Berry Finding S + Helping Speed M + speed nature | `[1 - (14% + 5% × 4)] × 0.9 = 59.4%` |

With four Helping Bonuses and Helping Speed M, the pre-nature reduction is already 34%. Helping Speed S then contributes only the remaining 1 percentage point; 6 of its nominal 7 points overflow the 35% cap. This is why the lesson rejects a context-free claim that `Berry Finding S + Helping Speed M + Helping Speed S` is always an ideal panel.

Do not turn that example into `Helping Speed S = 0` for every individual. Its realized value depends on the actual number of Helping Bonuses and whether Helping Speed M is unlocked. The individual score may retain intrinsic value; team composition and cultivation advice must disclose the realized value and overflow.

## Team shape taught by the course

The illustrated mature mixed team uses:

- one formal group healer;
- two stable berry positions;
- two cooking flex positions rotated among ingredient specialists and pot/cooking helpers;
- roughly three always-on Helping Bonuses, supplied first by the healer and berry core.

This team shape explains why Helping Bonus is considered a graduation requirement: the two cooking flex slots can rotate without destroying the permanent team-speed backbone. It also means `healer + four berry specialists` is only a comparison benchmark, not the only recommended weekly lineup.

The two closing frames add the consequence: permanent berry slots are scarce. Filling one with only the team-support half (`Berry Finding S + Helping Bonus` but insufficient personal speed) or only the self-output half (`Berry Finding S + Helping Speed M + speed nature` but no Helping Bonus) weakens the combined healer, berry and cooking-flex structure. Team advice should therefore judge both the helper's own output and the speed it contributes to the other four members.

## Integration boundary for this project

Already consistent with the project:

- Berry Finding S is required for the current strict berry minimum.
- Helping Bonus is already heavily valued and required by the current graduation rule.
- The stored helper interval already includes its unlocked Helping Speed and speed nature; the team calculator adds only the incremental Helping Bonus effect, stacks 5% per copy and enforces the 35% cap. This preserves the guide's outside-cap nature multiplier without double-counting it.
- Cultivation and release advice already distinguish long-term standards from immediate usability.

Implemented in the executable selection and cultivation layers:

- classify the five course-shown Berry Burst helpers by their intended berry position when giving hunting advice;
- require Berry Finding S, Helping Bonus and personal speed for Berry Burst berry-position graduation; Skill Trigger M no longer substitutes for personal speed;
- treat the four course-shown direct-Energy berry substitutes as second-line unless another verified strategic role exists;
- cap high mechanical-score berry candidates without Berry Finding S at transition rather than long-term core;
- explain speed-cap overflow whenever a planned team is available;
- recognize the healer + two berry-core + two cooking-flex structure as a mature mixed-team scenario.

Pending model decisions:

- whether to add a separate team-fit score that varies across realistic 0/3/4/5-Helping-Bonus lineups;
- whether the context-free legal maximum should continue to contain both Helping Speed M and S.
- how to make the existing `another speed gain` graduation check verify remaining cap headroom rather than accepting a mostly-overflowing Helping Speed S at full value.

Do not silently rewrite the context-free individual score from a single example. Keep the current intrinsic subskill score until those decisions are discussed and tested. The desirable future output is two readable values: `individual quality` and `planned-team realized value`.
