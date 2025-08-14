# Grades Engine (LMD) — Logic and Rules

This module implements a pure, deterministic calculation engine for Licence and Master programs. It centralizes all formulas and rounding, fixes previous rounding/credit bugs, and exposes typed results for direct UI rendering.

## Rounding
- All final numeric outputs use preciseRound(v, 2): `Math.round((v + Number.EPSILON) * 100) / 100`.
- Avoids float drift (e.g., 9.999999 -> 10.00).

## Module average
- Continuous assessment (CC) is the average of present components among TD/TP.
- If both TD and TP present: CC = (TD + TP) / 2.
- If only one present: CC = that value.
- If both CC and exam present:
  - Licence: 0.4 * CC + 0.6 * Exam
  - Master: 0.5 * CC + 0.5 * Exam
- If only exam present: average = Exam.
- If only CC present: average = CC.
- If neither present: average = null (missing).

## Unit average (UE)
- Weighted by module credits: sum(moduleAvg * module.credit) / sum(module.credit).
- Include only modules with a numeric average.
- If no valid module averages: average = null.
- Credits awarding:
  - If unit average >= 10 → award full unit.credit.
  - Else → sum credits from modules with average >= 10.

## Semester average
- Weighted by unit.coeff: sum(unitAverage * unit.coeff) / sum(unit.coeff).
- Include only units with a numeric average.
- Credits awarding:
  - If semester average >= 10 → 30 credits.
  - Else → sum awarded unit credits.

## Annual average
- `(s1Average * s1Credits + s2Average * s2Credits) / (s1Credits + s2Credits)`.
- Credits awarding:
  - If annual average >= 10 → 60 credits.
  - Else → s1Credits + s2Credits.

## Validation flags
- validated = average >= 10 at module/unit/semester/annual levels.

## Missing values / input validation
- Inputs parsed with parseFloat; values outside [0, 20] are treated as null.
- No implicit zeros. Missing inputs are not counted.

## Known bug fixes
- 10 → 9.75 symptom:
  - Use parseFloat on inputs.
  - Set input step="any" in UI.
  - Do not round or coerce during onChange; only round at final outputs with preciseRound.
- Wrong credits awarding:
  - Implemented exact rules above: Semester→30 on validation; Annual→60 on validation; partials from modules/units only.

## API (TypeScript)
- computeModuleAverageForModule(module, input, level)
- computeSemester(units, moduleInputs, level)
- computeAnnual(s1, s2)

All functions are pure and side‑effect free.
