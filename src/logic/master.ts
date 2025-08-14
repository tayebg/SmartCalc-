// Master GPA logic (IA/SID/RSID). Implements the exact behavior provided.
// Self-contained to avoid circular imports.

// Local types (structural compatibility with existing engine)
type ModuleLike = {
  code: string;
  credit: number;
  coeff: number;
  has_td?: boolean;
  has_tp?: boolean;
  has_exam?: boolean;
};

type UnitLike = {
  id: string;
  ue: string;
  coeff: number;
  credit: number;
  modules: ModuleLike[];
};

type ModuleInputLike = {
  moduleCode: string;
  td?: number | null;
  tp?: number | null;
  exam?: number | null;
};

type ModuleResultLike = {
  moduleCode: string;
  average: number | null;
  validated: boolean;
  creditAwarded: number;
};

type UnitResultLike = {
  unitId: string;
  average: number | null;
  validated: boolean;
  creditsAwarded: number;
  moduleResults: ModuleResultLike[];
};

type SemesterResultLike = {
  average: number | null;
  totalCreditsAwarded: number;
  unitResults: UnitResultLike[];
  validated: boolean;
};

function preciseRound(v: number, digits = 2) {
  return Math.round((v + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}

// Implements the provided logicIA.calculateModuleAverage semantics
export function calculateModuleAverageMaster(mod: ModuleLike, grades: { td?: number; tp?: number; exam?: number }): number | null {
  const td = grades.td;
  const tp = grades.tp;
  const exam = grades.exam;

  // Only compute if at least one component was provided by the user
  const anyProvided = (td !== undefined && td !== null) || (tp !== undefined && tp !== null) || (exam !== undefined && exam !== null);
  if (!anyProvided) return null;

  // CC from defined components; missing treated as 0
  const ccParts: number[] = [];
  if (mod.has_td) ccParts.push(td ?? 0);
  if (mod.has_tp) ccParts.push(tp ?? 0);
  const cc = ccParts.length > 0 ? (ccParts.reduce((a, b) => a + b, 0) / ccParts.length) : null;

  if (mod.has_exam) {
    const ex = exam ?? 0;
    if (cc !== null) return preciseRound((cc + ex) / 2, 2);
    return preciseRound(ex, 2);
  }
  if (cc !== null) return preciseRound(cc, 2);
  return null;
}

// Compute a full semester using master rules (module coeffs inside UE)
export function computeSemesterMaster(units: UnitLike[], moduleInputs: ModuleInputLike[]): SemesterResultLike {
  const inputMap = new Map<string, ModuleInputLike>();
  for (const mi of moduleInputs) inputMap.set(mi.moduleCode, mi);

  const unitResults: UnitResultLike[] = units.map((u) => {
    // Module results
    const moduleResults: ModuleResultLike[] = u.modules.map((m) => {
      const inp = inputMap.get(m.code) || { moduleCode: m.code };
      const avg = calculateModuleAverageMaster(m, { td: inp.td ?? undefined, tp: inp.tp ?? undefined, exam: inp.exam ?? undefined });
      const validated = avg !== null && avg >= 10;
      const creditAwarded = validated ? m.credit : 0;
      return { moduleCode: m.code, average: avg, validated, creditAwarded };
    });

    // Unit average: weighted by module.coeff (NOT credits) using only modules with numeric average
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

    // Credits awarding per provided rules
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

  // Semester average: weight with unit.coeff
  let semWeighted = 0;
  let semCoeffSum = 0;
  for (const ur of unitResults) {
    if (ur.average !== null) {
      const u = units.find(uu => uu.id === ur.unitId)!;
      semWeighted += ur.average * u.coeff;
      semCoeffSum += u.coeff;
    }
  }
  const semAverage = semCoeffSum > 0 ? preciseRound(semWeighted / semCoeffSum, 2) : null;

  // Credits: 30 if semester validated, else sum of unit credits (per rule)
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
