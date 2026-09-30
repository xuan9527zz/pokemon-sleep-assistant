# Announcement brief

Use UTF-8 JSON. Save a temporary brief outside the deployed site, or keep it under `tmp/` only when that directory is already intended for local scratch data. The brief records source facts; it is not the website's data source.

```json
{
  "title": "Event name from the notice",
  "sourceUrl": "https://www.pokemonsleep.net/en/news/.../",
  "start": "2026-10-05T04:00:00+09:00",
  "end": "2026-10-12T04:00:00+09:00",
  "areas": "all",
  "effects": [
    {"type": "cookingEnergyMultiplier", "value": 1.25, "when": "all", "target": "all"},
    {"type": "potCapacityMultiplier", "value": 2, "when": "weekday", "target": "all"},
    {"type": "potCapacityMultiplier", "value": 4, "when": "sunday", "target": "all"},
    {"type": "ingredientHelpBonus", "value": 1, "when": "all", "target": "ingredient-specialist"}
  ]
}
```

`areas` may also be an array of exact island names used by `weekly-planner.js`. `when` can be `all`, `weekday`, `sunday`, `first-sleep`, or another explicit condition copied from the notice. `target` can be `all`, `ingredient-specialist`, a berry/type condition, or another explicit group. Omit neither field: leaving timing or eligibility implicit is a common source of false calculations.

Use descriptive `type` names for effects that are not yet modeled, such as `helperSleepExpMultiplier` or `firstSleepCandyMultiplier`. The audit will keep them visible as unsupported rather than silently dropping them. For a Growth Week, record sleep EXP and first-sleep candy separately; for Cooking Week, record ordinary ingredient help, skill-provided ingredients, pot size, dish strength, Sunday override, and dish recovery separately. Include incense stacking or overlapping-event rules in the update notes, not as an invented flat multiplier.

The audit can now suggest Cooking Week profile fields for weekday and Sunday pot capacity, specialist-only ordinary ingredient help, skill-provided ingredient quantity (`target: ingredient-output-only`), dish Energy recovery, and all-day dish strength. Standard weekday ×2 and Sunday ×3 Extra Tasty strength is reported as `modeledByCore` because the shared cooking calculator already handles it. Each suggested field still needs an official-source check and a regression test before use. A `fullyModeled` audit result means the listed effects have data/profile mappings, not that random ingredient identities or multi-team state carryover became exact. Sleep EXP, first-sleep candy, and overlapping-event rules remain unsupported unless their dedicated model is added. A display-only badge may still explain an official effect.
