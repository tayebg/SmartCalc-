// Licence GPA logic (L1/L2/L3). 40% CC + 60% Exam.
// Rule: compute only if any component provided; missing components treated as 0.


import { preciseRound, sanitizeGrade, type Module, type Unit, type ModuleInput, type ModuleResult, type UnitResult, type SemesterResult } from './shared';

// Licence module average with CC 40% and Exam 60%, missing components ignored
export function calculateModuleAverageLicence(mod: Module, grades: { td?: number | null; tp?: number | null; exam?: number | null }): number | null {
  const tdGrade = sanitizeGrade(grades.td);
  const tpGrade = sanitizeGrade(grades.tp);
  const examGrade = sanitizeGrade(grades.exam);

  // Only compute if the user provided at least one component
  const anyProvided = tdGrade !== null || tpGrade !== null || examGrade !== null;
  if (!anyProvided) return null;

  // CC is built from existing components in the module definition, missing values treated as 0
  const ccParts: number[] = [];
  if (mod.has_td) ccParts.push(tdGrade ?? 0);
  if (mod.has_tp) ccParts.push(tpGrade ?? 0);
  const cc = ccParts.length > 0 ? (ccParts.reduce((a, b) => a + b, 0) / ccParts.length) : null;

  if (mod.has_exam) {
    const ex = examGrade ?? 0;
    if (cc !== null) return preciseRound(0.4 * cc + 0.6 * ex, 2);
    return preciseRound(ex, 2);
  }
  if (cc !== null) return preciseRound(cc, 2);
  return null;
}

// Compute a semester with Licence rules (40/60 weighting and module.coeff inside UE)
export function computeSemesterLicence(units: Unit[], moduleInputs: ModuleInput[]): SemesterResult {
  const inputMap = new Map<string, ModuleInput>();
  for (const mi of moduleInputs) inputMap.set(mi.moduleCode, mi);

  const unitResults: UnitResult[] = units.map((u) => {
    const moduleResults: ModuleResult[] = u.modules.map((m) => {
      const inp = inputMap.get(m.code) || { moduleCode: m.code };
      const avg = calculateModuleAverageLicence(m, { td: inp.td ?? undefined, tp: inp.tp ?? undefined, exam: inp.exam ?? undefined });
      const validated = avg !== null && avg >= 10;
      const creditAwarded = validated ? m.credit : 0;
      return { moduleCode: m.code, average: avg, validated, creditAwarded };
    });

    // Unit average: weight by module.coeff using only modules with numeric average
    let weighted = 0;
    let coeffSum = 0;
    for (const mr of moduleResults) {
      if (mr.average !== null) {
        const m = u.modules.find(mm => mm.code === mr.moduleCode)!;
        weighted += mr.average * m.coeff;
        coeffSum += m.coeff;
      }
    }
    const unitAverage = coeffSum > 0 ? preciseRound(weighted / coeffSum, 2) : null;

    const full = unitAverage !== null && unitAverage >= 10;
    const partial = moduleResults.reduce((acc, mr) => acc + (mr.validated ? (u.modules.find(mm => mm.code === mr.moduleCode)!.credit) : 0), 0);
    const creditsAwarded = full ? u.credit : partial;

    return {
      unitId: u.id,
      average: unitAverage,
      validated: full,
      creditsAwarded,
      moduleResults,
    };
  });

  // Semester average: weight all modules by module.coeff (avoids bias from UE coeff mismatches)
  let semWeighted = 0;
  let semCoeffSum = 0;
  for (const ur of unitResults) {
    const u = units.find(uu => uu.id === ur.unitId)!;
    for (const mr of ur.moduleResults) {
      if (mr.average !== null) {
        const m = u.modules.find(mm => mm.code === mr.moduleCode)!;
        semWeighted += mr.average * m.coeff;
        semCoeffSum += m.coeff;
      }
    }
  }
  const semAverage = semCoeffSum > 0 ? preciseRound(semWeighted / semCoeffSum, 2) : null;

  const semValidated = semAverage !== null && semAverage >= 10;
  const partialSum = unitResults.reduce((acc, ur) => acc + ur.creditsAwarded, 0);
  const totalCreditsAwarded = semValidated ? 30 : partialSum;

  return {
    average: semAverage,
    totalCreditsAwarded,
    unitResults,
    validated: semValidated,
  };
}
