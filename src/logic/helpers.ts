// GPA helper functions (pure)
// These mirror the provided JavaScript utilities, typed for TS

export function sumValues(array: Array<number | string>): number {
  return array.reduce<number>((acc, val) => acc + (parseFloat(String(val)) || 0), 0);
}

export function calculateAverage(grades: number[], coefficients: number[]): number {
  const total = grades.reduce((sum, grade, i) => sum + grade * (coefficients[i] ?? 0), 0);
  const totalCoeff = sumValues(coefficients as any);
  return totalCoeff !== 0 ? total / (totalCoeff as number) : 0;
}

export function isValidValue(value: unknown): boolean {
  return value !== '' && !isNaN(parseFloat(String(value)));
}

export function calculateGlobalAverage(semesters: { notes: number[]; coefficients: number[] }[]): number {
  const total = semesters.reduce((sum, sem) => {
    if (!sem.notes || sem.notes.length === 0) return sum;
    return sum + calculateAverage(sem.notes, sem.coefficients);
  }, 0);
  return semesters.length > 0 ? total / semesters.length : 0;
}
