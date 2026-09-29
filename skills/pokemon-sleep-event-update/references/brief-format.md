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

Use descriptive `type` names for effects that are not yet modeled, such as `helperSleepExpMultiplier`, `firstSleepCandyMultiplier`, `skillIngredientMultiplier`, or `dishEnergyRecoveryBonus`. The audit will keep them visible as unsupported rather than silently dropping them. For a Growth Week, record sleep EXP and first-sleep candy separately; for Cooking Week, record ordinary ingredient help, skill-provided ingredients, pot size, dish strength, Sunday override, and dish recovery separately. Include incense stacking or overlapping-event rules in the update notes, not as an invented flat multiplier.

The audit can suggest only the current simple all-day, all-member fields: `cookingEnergyMultiplier`, `potCapacityMultiplier`, `universalSleepMultiplier`, and `carryBonus`. A day-specific, first-sleep-only, specialist-only, or overlapping rule needs a calculator and tests before the site may claim it is simulated. A display-only badge may still explain the official effect.
