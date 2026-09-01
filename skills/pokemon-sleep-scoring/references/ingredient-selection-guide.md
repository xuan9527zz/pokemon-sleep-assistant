# Guide-derived strict ingredient-helper selection

## Source status

This reference records the meaning of 18 user-supplied course frames about strict ingredient-helper selection. It is guide evidence, not a verified species-data source. The frames were reviewed on 2026-09-01; the author, original video URL and audio transcript were not supplied. Preserve the lesson's claims separately from verified mechanics and from the executable numeric score.

## Judge the ingredient route before the panel

The lesson labels the ingredients unlocked at Lv.1, Lv.30 and Lv.60 as A, B and C. Its Blastoise example shows A milk at Lv.1, A milk or B cacao at Lv.30, and A milk, B cacao or C sausage at Lv.60. The displayed B/C quantities are described as approximate energy-equivalent alternatives to the same-level A quantity, and the course states that B has twice the route-selection weight of A or C.

The displayed route chances and cultivation roles are:

| Route | Displayed chance | Course role |
|---|---:|---|
| AAA | `1/9` | Default graduation route and first long-term choice for ingredient specialists. |
| AAB / AAC | `1/9` each | Cannot graduate in this framework; acceptable as Lv.30 workers, but the course says not to raise them to Lv.60. |
| ABB | `2/9` | Species-specific exception that becomes meaningful only at Lv.60. Use only where B output can nearly match the intended AAA output and the account can afford the fast Lv.60 investment. |
| Other AAX routes | not fully classified in the supplied frames | Temporary work may be acceptable before Lv.60; do not infer long-term graduation without species-specific evidence. |

The slide names Luxray, Tyranitar and Dragonite as examples where ABB may approach AAA production. This is an example list, not a complete allowlist. Do not award every ABB helper the same long-term status merely because its route letters match.

The course also warns that an ABB helper with only a two-effective-gain panel is not recommended for cultivation. The frames do not provide a formal species-by-species threshold or the original narration, so retain this as a strict qualitative warning rather than an executable universal cutoff.

## Why AAA may justify a less team-oriented panel

- AAA is shown as only `1/9`, so route purity is scarce before subskills and nature are considered.
- Ingredient helpers normally occupy rotating cooking-flex positions rather than permanent team-core positions.
- The course therefore does not require Helping Bonus on every ingredient helper. A personal-production panel can rely on Helping Bonus supplied by the healer and stable berry core.
- Helping Bonus remains an effective gain when present; it is useful, but it is not the route-independent graduation gate taught in this lesson.

This argument concerns selection opportunity and team structure. It does not imply that Helping Bonus has no mechanical value.

## Panel standard taught by the course

Ingredient Finder M is the core requirement, analogous to Berry Finding S for a strict berry helper. The slide treats each of the following as an effective companion gain:

- ingredient-finding-up nature: the frames explicitly show `马虎`, `冷静` and `慢吞吞`;
- Helping Bonus;
- Helping Speed M;
- Ingredient Finder S;
- speed-up nature: `内敛`, `顽皮`, `勇敢` or `怕寂寞`.

Use three practical panel bands:

1. **Graduation panel:** Ingredient Finder M plus any two additional effective gains from the list above, together with AAA or a verified species-specific ABB exception.
2. **Reconciliation / usable panel:** the course says players commonly use Ingredient Finder M plus Helping Speed M as the lowest generally usable two-gain panel. AAA can justify compromise because the route is scarce. Low-energy-ingredient helpers may be accepted with two total effective gains, while high-energy-ingredient helpers are described as naturally low-quantity and not recommended with only two gains.
3. **Worker panel:** Ingredient Finder M with an AAX route can meet early, pre-Lv.60 cooking demand. It should be labelled as a worker rather than a long-term graduation target, and heavy investment should stop before the route becomes strategically wrong.

The meaning of `two effective gains` is inferred from the slide layout to include Ingredient Finder M itself: Ingredient Finder M plus Helping Speed M is the example immediately called the lowest usable panel. Keep that interpretation marked as guide-derived until the original narration or transcript is available.

## Recipe supply is the practical objective

Ingredient specialists are selected to produce enough of a required ingredient and then leave the field, allowing the account to complete three meals per day. Evaluation should therefore disclose:

- the recipe ingredient being supplied;
- the route's output at the current level and at Lv.60;
- whether the helper is a temporary worker, reconciliation candidate or graduation candidate;
- the cost of reaching the level where the chosen route becomes valid;
- whether the box already has a higher-purity supplier for the same role.

A high context-free individual score does not justify raising an AAB/AAC worker to Lv.60 when its unlocked route dilutes the ingredient the account actually needs.

## Lv.60 is the structural investment boundary

The lesson says ingredient specialists receive their final ingredient-slot change at Lv.60. Later cap increases to Lv.65 and Lv.70 do not add another ingredient-route slot, so the route chosen at Lv.60 determines the long-term role. Treat the course's phrase `开60级后已经不会再有提升` as no further route-tier transformation, not literally zero numerical growth: later levels may still change verified speed or other mechanics.

This makes the Lv.60 decision asymmetric:

- correct AAA or verified ABB route: consider long-term investment if the panel also meets its band;
- AAB/AAC worker route: gain value at Lv.30, then stop rather than unlock the unwanted Lv.60 ingredient;
- unknown ABB: require species-specific production comparison before committing candy and shards.

## Integration boundary for this project

Already consistent with the project:

- ingredient-route quality multiplies only ingredient/all-rounder individual quality;
- AAA already has the strongest route coefficient;
- Ingredient Finder M is already the highest-valued ingredient subskill;
- cultivation advice already distinguishes a mechanical score from strategic use and release safety.

Implemented in the executable selection and cultivation layers:

- label AAB/AAC as Lv.30 workers rather than generic long-term alternatives;
- require a reviewed species-specific reason before treating ABB as a graduation route; the current course-example set is Luxray, Tyranitar and Dragonite;
- treat Ingredient Finder M as the core strict-selection requirement;
- accept Helping Bonus as one effective gain without requiring it on every rotating ingredient helper;
- make the Lv.60 route decision explicit in cultivation advice and cap AAB/AAC investment at Lv.59;
- prevent a high mechanical score from restoring core-cultivation status when the course route or panel does not graduate.

Pending model decisions:

- replace the blanket `ABB = 0.85` coefficient with species/ingredient-specific exceptions or a production-derived route factor;
- decide whether the provisional `AAB/AAC = 0.70` display coefficient should be removed now that a hard worker-only / do-not-raise-to-60 label exists;
- decide how to handle ABA, which the supplied lesson does not classify;
- define low-energy versus high-energy ingredient thresholds and verify the example ABB species against current production data.

Do not silently rewrite numeric coefficients from these frames. Keep the current executable score until these decisions are discussed, implemented and regression-tested. The desired future output should separate `route fit`, `individual production panel`, `team support`, and `cultivation stage`.
