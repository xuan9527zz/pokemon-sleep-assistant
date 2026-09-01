# Skill-helper selection guide

## Source and evidence status

This guide records the strategic claims visible in a sequence of course screenshots supplied by the user and reviewed on 2026-09-01. The course title, author, publication URL, narration and upload date were not supplied. Treat every conclusion here as guide-derived selection evidence, not as verified game mechanics or an executable score.

The screenshots repeat several slides while the subtitles advance. Consolidate the repeated frames into the rules below; do not count repeated slides as independent evidence.

## Classify the role before judging the panel

The course does not use one graduation standard for every skill specialist:

1. **Formal group healer:** a long-term, always-on support slot. Team value is part of the role, so Helping Bonus is a graduation requirement in this guide.
2. **Berry Burst helper:** judge it as a berry-position helper using [berry-selection-guide.md](berry-selection-guide.md), not as an ordinary skill helper.
3. **Ordinary skill helper:** require reliable main-skill activation plus two additional effective gains. Helping Bonus is one possible gain, not a universal requirement.
4. **Short-deployment tool helper:** Cooking Success S, Cooking Power-Up S, Dream Shard Magnet S and similar helpers commonly enter, trigger a few times and leave. Use the ordinary skill-helper panel standard, but do not force Helping Bonus merely for graduation.
5. **Other persistent or output skills:** Energy Charge, Energy restoration and other mechanics excluded from the course's generic tool grouping remain role-specific. Use the executable main-skill model and do not infer a universal graduation rule from these screenshots.

This role split is strategic. It does not alter individual scoring coefficients or verified team-output formulas.

## Formal group-healer evidence

The course displayed the following expected daily trigger counts for `Energy for Everyone S` under one stated panel: Lv.70, Skill Trigger M, Helping Bonus, Helping Speed M and the course's `自大` nature label.

| Helper | Course expectation |
| --- | ---: |
| Gardevoir | 8.26 triggers/day |
| Torterra | 7.91 triggers/day |
| Pawmot | 7.80 triggers/day |
| Shuckle | 7.84 triggers/day |
| Sylveon | 7.48 triggers/day |
| Wigglytuff | 7.17 triggers/day |

These figures are transcribed course values. They have not been independently reproduced from the current species model, and their version, collection assumptions and trigger-retention details are unknown. Use them only to explain the course's relative comparison.

### Graduation panels

For a formal group healer, the course requires all three parts, preferably unlocked by Lv.50:

- Skill Trigger M.
- Helping Bonus.
- One more effective personal gain.

The displayed graduation examples were:

- Skill Trigger M + a skill-chance-up nature (`慎重`, `自大` or `温顺` as shown) + Helping Bonus.
- Skill Trigger M + Helping Bonus + Helping Speed M.
- Skill Trigger M + Helping Bonus + a speed-up nature (`温和`, `固执`, `勇敢` or `怕寂寞` as shown).

The slide says unshown stronger panels above this band also graduate. Do not translate that statement into a new numeric score without checking the actual subskills, nature and unlock levels.

### Strong transition healers

The course treats the following panels as strong but non-graduating because they lack Helping Bonus:

- Skill Trigger M + a skill-chance-up nature + Helping Speed M.
- Skill Trigger M + Skill Trigger S + a skill-chance-up nature.
- Skill Trigger M + Helping Speed M + a speed-up nature.

It also shows these two-gain panels as temporary healers:

- Skill Trigger M + a skill-chance-up nature.
- Skill Trigger M + Helping Speed M.
- Skill Trigger M + Skill Trigger S.

In the screenshot wording, a healer with Skill Trigger M and one other effective gain unlocked by Lv.25 can be used as a transition helper. Avoid heavy investment; the course specifically names Turtwig and Pawmi as examples of economical transition lines. A healer without Helping Bonus may have higher personal trigger expectation than one with Helping Bonus, but it still fails this course's strict graduation standard because the permanent support slot is expected to strengthen the other four teammates.

## Ordinary and tool skill-helper evidence

For an ordinary or short-deployment tool skill helper, the course's graduation standard is:

`Skill Trigger M + any two additional effective gains`

The displayed three-part examples include combinations of:

- Helping Bonus.
- Skill Trigger S.
- Helping Speed M.
- A skill-chance-up nature.
- A speed-up nature.

Helping Bonus is desirable when present, but it is not mandatory for these roles. The course explicitly accepts high-personal-output panels such as Skill Trigger M + Skill Trigger S + skill-chance-up nature, or Skill Trigger M + Helping Speed M + speed-up nature.

Panels with only Skill Trigger M plus one other displayed gain are a compromise or starting panel, not the general graduation target. The screenshot contrasts easy `5`-gauge helpers with Dedenne's `16`-gauge hunt difficulty. Interpret `5` and `16` as friendship/capture-gauge requirements, not the number of subskill slots: do not settle early on an easy 5-gauge species, while a scarce 16-gauge Dedenne may justify starting from a compromise panel.

## Level timing and investment

The course recommends completing the relevant panel by Lv.50:

- Do not choose a skill helper merely because its full Lv.70 or Lv.80 panel would eventually graduate.
- In particular, a candidate whose Skill Trigger M is locked at Lv.70 or Lv.80 is a poor default investment.
- Later unlocks consume Handy Candy, species Candy and Candy Boost resources that could develop other helpers.
- A rare or unusually expensive hunt may justify a documented compromise, but the compromise is not a new universal graduation standard.

## Integration boundary

Use this guide for selection labels, cultivation timing and role explanations. Continue to use [scoring-rules.md](scoring-rules.md), [main-skill-models.md](main-skill-models.md) and the shared scripts for mechanical scores and team output.

The executable selection layer now implements the course split:

- formal group healers require Skill Trigger M, Helping Bonus and one more effective gain;
- ordinary and short-deployment tool helpers require Skill Trigger M plus any two additional effective gains, with Helping Bonus optional;
- Berry Burst helpers use the strict berry-position rule;
- Lv.25 healer transitions and the 16-gauge Dedenne compromise are labelled separately from graduation;
- Skill Trigger M and the companion panel must be available by Lv.50, so Lv.70/80 rescue panels cannot create a course graduation label.

The standard team replacement coefficient still models a full extra skill slot. The course provides no tested part-time deployment coefficient for tools, so the website now warns about their short-deployment role without inventing a new numerical multiplier.
