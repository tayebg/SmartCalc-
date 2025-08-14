/*
 * Grades engine implementing LMD rules (Licence/Master)
 * Pure, deterministic, and fully typed. See docs/LOGIC.md for details.
 */

// Re-export shared types and utilities for UI/tests compatibility
export type { Level, Module, Unit, ModuleInput, ModuleResult, UnitResult, SemesterResult, AnnualResult } from './shared';
export { preciseRound } from './shared';

import {
  preciseRound,
  sanitizeGrade,
  type Level,
  type Module,
  type Unit,
  type ModuleInput,
  type ModuleResult,
  type UnitResult,
  type SemesterResult,
  type AnnualResult,
} from './shared';
import { computeSemesterLicence } from './licence';
import { computeSemesterMaster } from './master';

/** Compute module average according to level (Licence: 40% CC + 60% Exam, Master: 50/50). */
export function computeModuleAverageForModule(module: Module, input: ModuleInput, level: Level): ModuleResult {
  const td = sanitizeGrade(input.td);
  const tp = sanitizeGrade(input.tp);
  const exam = sanitizeGrade(input.exam);

  // If no component was entered at all, do not compute an average
  const anyProvided = td !== null || tp !== null || exam !== null;
  let avg: number | null = null;
  if (!anyProvided) {
    avg = null;
  } else {
    // Build CC from defined components; treat missing as 0
    const ccParts: number[] = [];
    if (module.has_td) ccParts.push(td ?? 0);
    if (module.has_tp) ccParts.push(tp ?? 0);
    const ccVal = ccParts.length > 0 ? (ccParts.reduce((a, b) => a + b, 0) / ccParts.length) : null;

    if (module.has_exam) {
      const ex = exam ?? 0;
      if (ccVal !== null) {
        const wCC = level === 'master' ? 0.5 : 0.4;
        const wExam = level === 'master' ? 0.5 : 0.6;
        avg = wCC * ccVal + wExam * ex;
      } else {
        avg = ex;
      }
    } else if (ccVal !== null) {
      avg = ccVal;
    } else {
      avg = null;
    }
  }

  const rounded = avg === null ? null : preciseRound(avg, 2);
  const validated = rounded !== null && rounded >= 10;
  const creditAwarded = validated ? module.credit : 0;

  return {
    moduleCode: module.code,
    average: rounded,
    validated,
    creditAwarded,
  };
}

/** Compute a full semester result from units and module inputs. Pure function. */
export function computeSemester(units: Unit[], moduleInputs: ModuleInput[], level: Level): SemesterResult {
  if (level === 'master') {
    return computeSemesterMaster(units as any, moduleInputs as any) as any;
  }
  // Default to licence logic
  return computeSemesterLicence(units as any, moduleInputs as any) as any;
}

/** Compute annual summary from two semesters. Pure function. */
export function computeAnnual(s1: SemesterResult, s2: SemesterResult): AnnualResult {
  const s1Avg = s1.average;
  const s2Avg = s2.average;
  const s1Cred = s1.totalCreditsAwarded;
  const s2Cred = s2.totalCreditsAwarded;

  // Annual average must always be the simple mean of the two semesters
  const annAvg = (s1Avg !== null && s2Avg !== null)
    ? preciseRound((s1Avg + s2Avg) / 2, 2)
    : null;

  const validated = annAvg !== null && annAvg >= 10;
  const totalCreditsAwarded = validated ? 60 : (s1Cred + s2Cred);

  return {
    s1Average: s1Avg,
    s2Average: s2Avg,
    s1Credits: s1Cred,
    s2Credits: s2Cred,
    annualAverage: annAvg,
    totalCreditsAwarded,
    validated,
  };
}