# Main-skill and team models

## Team replacement model

For a non-healer skill specialist X, compare:

`Gardevoir + X + three nominated island berry specialists`

against:

`Gardevoir + four copies of the same nominated island berry specialist`

Choose the island by X's type, then use the user-confirmed benchmark: Cyan/Feraligatr, Taupe/Typhlosion, Snowdrop/Alolan Ninetales, Lapis/Meganium, Gold/Raichu, Amber/Salamence. Use Good Camp, four-hour collection, retained triggers and the configured surplus-ingredient availability. Include X's ordinary production before charging the displaced fourth-producer slot.

For healers compare `X + four island berry specialists` against `five island berry specialists`, including Energy decay, help-speed brackets, meals, sleep recovery, stored triggers and self-healing feedback. A formal healer does not pay an additional skill-slot cost.

## Skill species normalization

Use positive marginal gain only:

`output = max(team coefficient - 1, 0) / current best positive marginal gain × 100`

Then main-skill performance is output 70%, stability 10%, operation 10%, versatility 10%. Species mechanism score is performance 95% plus natural-level resource value 5%. Apply the user-confirmed 50% unearned-space compensation, then the auditable manual adjustment map. These layers never create fictitious team Energy.

The current manual adjustments are retained in the executable species model, not duplicated here. Any change must be discussed and tested.

## Special teams

- Suicune: Gardevoir + Suicune + Feraligatr ×3 versus Gardevoir + Feraligatr ×4.
- Raikou: Gardevoir + Raikou + Raichu ×3 versus Gardevoir + Raichu ×4.
- Entei: Gardevoir + Entei + Typhlosion ×3 versus Gardevoir + Typhlosion ×4.
- Latias/Latios: Gardevoir + Latias + Latios + Salamence ×2 versus Gardevoir + Salamence ×4.

Latias and Latios are the only allowed two-Special pair and use separate final-form groups. Use pair attribution rather than giving the entire pair coefficient to either member.

## Skill-family requirements

- Recovery: weight only productive targets. In a standard healer + four producers team, healing the healer has no team value. Random recovery must include its miss probability.
- Direct Energy and Dream Shards: preserve fixed anchors and actual trigger retention. Dream Shards are resource value, not current-week Snorlax Energy.
- Helping Support, Helper Boost and Berry Burst: recompute from the actual five members and their output; extra helps cannot trigger another main skill.
- Tasty Chance, Cooking Power-Up, Cooking Assist and Metronome: use weekly nonlinear cooking states, not flat value per trigger. Respect pot thresholds, surplus ingredients, Good Camp and caps.
- Skill Copy: use the four actual teammate effects at the copier's level.
- All-Mighty: expose every selectable output; keep unknown trigger or Candy components pending.
- Inventory affects trigger retention and two-trigger storage for skill specialists but receives no separate raw individual points.

Use the relevant `--specialty skill-*` mode in `scripts/species-scores.js` for diagnostics. Unknown future skills remain pending rather than zero.

