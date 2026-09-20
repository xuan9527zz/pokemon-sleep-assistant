# Strategy and box rules

## Separate layers

- Species S/A/B/C is the user’s hunt-priority table.
- Individual S/A/B/C comes from the role output multiplier.
- Team, island and event calculators use actual production mechanics.
- Cultivation/retention is the fixed species × individual matrix in [scoring-rules.md](scoring-rules.md).

Strategic annotations may explain a role but never change species tier, individual multiplier or the cultivation matrix.

## Helping Bonus in teams

For each helper, add its own Helping Speed reduction and `5% × unlocked Helping Bonus count in the team`, then cap combined subskill/team reduction at 35%. Speed Nature applies outside that cap. Do not multiply a completed score by a flat team percentage.

## Release and collection

Apply the base cultivation matrix first.

- A shiny or limited helper with a useful base result keeps that result: e.g. shiny species-S/individual-S is Core.
- Only a No-train base result branches: shiny or limited becomes Collection Protection; otherwise Release.
- Existing level, candy/seed investment, box assignment, collection toggle and unique route do not block Release.
- Missing or uncomputable evaluation becomes Manual Review.
- The application never auto-deletes; Release is a filterable advice label only.

Do not reintroduce same-species seat limits, rank-five safeguards, direct-superior overrides, account-stage thresholds or “limited use” as final cultivation categories.

## Main box presentation

The main box filter exposes box, shiny, role and cultivation judgment. Do not re-add separate usage-state or species-tier filter groups. The main table/card list does not show the old “box and usage” column/tags. Editing a Pokémon must preserve all active filters, sorting, current page and scroll/row position across the save reload.
