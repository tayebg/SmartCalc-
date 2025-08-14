/*
 * Shared types and helpers for grades logic
 */

export type Level = 'licence' | 'master';

export type Module = {
  code: string;
  title?: string;
  credit: number; // integer
  coeff: number; // weighting inside UE
  has_td?: boolean;
  has_tp?: boolean;
  has_exam?: boolean;
  unitId?: string;
};

export type Unit = {
  id: string; // stable identifier (e.g., "UF1")
  ue: string; // unit name/label
  coeff: number; // weight for semester average
  credit: number; // ECTS for the unit
  modules: Module[];
};

export type ModuleInput = {
  moduleCode: string;
  td?: number | null;
  tp?: number | null;
  exam?: number | null;
};

export type ModuleResult = {
  moduleCode: string;
  average: number | null; // 2 decimals or null if not computable
  validated: boolean;
  creditAwarded: number; // 0 or module.credit
};

export type UnitResult = {
  unitId: string;
  average: number | null;
  validated: boolean;
  creditsAwarded: number;
  moduleResults: ModuleResult[];
};

export type SemesterResult = {
  average: number | null;
  totalCreditsAwarded: number;
  unitResults: UnitResult[];
  validated: boolean;
};

export type AnnualResult = {
  s1Average: number | null;
  s2Average: number | null;
  s1Credits: number;
  s2Credits: number;
  annualAverage: number | null;
  totalCreditsAwarded: number;
  validated: boolean;
};

/** Precise rounding helper to avoid float drift (e.g., 10 -> 9.999999 -> 10.00) */
export function preciseRound(v: number, digits = 2) {
  return Math.round((v + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}

/**
 * Sanitize and normalize a grade input.
 * - Accepts strings with commas or spaces
 * - Returns null if invalid
 * - Clamps into [0, 20]
 */
export function sanitizeGrade(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const normalized = typeof value === 'string' ? value.replace(',', '.').replace(/\s+/g, '').trim() : value;
  const n = typeof normalized === 'string' ? parseFloat(normalized) : (typeof normalized === 'number' ? normalized : NaN);
  if (!isFinite(n)) return null;
  const clamped = Math.min(20, Math.max(0, n));
  return clamped;
}
