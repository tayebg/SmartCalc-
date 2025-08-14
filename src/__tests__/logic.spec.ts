import { describe, expect, it } from 'vitest';
import {
  computeModuleAverageForModule,
  computeSemester,
  computeAnnual,
  type Module,
  type Unit,
  type ModuleInput,
} from '@/logic/grades';

const licence: 'licence' = 'licence';
const master: 'master' = 'master';

function mkUnit(id: string, credit: number, coeff: number, modules: Array<Partial<Module> & Pick<Module,'code'|'credit'|'coeff'>>): Unit {
  return {
    id,
    ue: id,
    credit,
    coeff,
    modules: modules.map(m => ({ has_td: true, has_tp: true, has_exam: true, ...m })) as Module[],
  };
}

describe('Grades engine (shared rules)', () => {
  it('Licence module average 40/60, with TD+TP+Exam', () => {
    const mod: Module = { code: 'X', credit: 4, coeff: 1, has_td: true, has_tp: true, has_exam: true };
    const res = computeModuleAverageForModule(mod, { moduleCode: 'X', td: 12, tp: 14, exam: 10 }, licence);
    expect(res.average).toBe(11.2);
    expect(res.creditAwarded).toBe(4);
    expect(res.validated).toBe(true);
  });

  it('Master weighting is 50/50 when CC and exam present', () => {
    const mod: Module = { code: 'M', credit: 3, coeff: 1, has_td: true, has_tp: false, has_exam: true };
    const res = computeModuleAverageForModule(mod, { moduleCode: 'M', td: 14, exam: 10 }, master);
    expect(res.average).toBe(12);
  });

it('Missing exam is treated as 0 when TD provided (Licence)', () => {
  const mod: Module = { code: 'E', credit: 2, coeff: 1, has_td: true, has_tp: false, has_exam: true } as Module;
  const res = computeModuleAverageForModule(mod, { moduleCode: 'E', td: 16 }, licence);
  expect(res.average).toBe(6.4); // 0.4*16 + 0.6*0
});

it('Module average is null when no inputs provided', () => {
  const mod: Module = { code: 'Z', credit: 2, coeff: 1, has_td: true, has_tp: true, has_exam: true } as Module;
  const res = computeModuleAverageForModule(mod, { moduleCode: 'Z' }, licence);
  expect(res.average).toBeNull();
});

  it('Unit average weighted by module.coeff', () => {
    const unit = mkUnit('UE1', 6, 1, [
      { code: 'A', credit: 4, coeff: 2, has_exam: true, has_td: false, has_tp: false },
      { code: 'B', credit: 2, coeff: 1, has_exam: true, has_td: false, has_tp: false },
    ]);
    const inputs: ModuleInput[] = [
      { moduleCode: 'A', exam: 10 },
      { moduleCode: 'B', exam: 16 },
    ];
    const sem = computeSemester([unit], inputs, licence);
    const ue = sem.unitResults[0];
    // (10*2 + 16*1) / 3 = 12
    expect(ue.average).toBe(12.0);
    expect(ue.validated).toBe(true);
    expect(ue.creditsAwarded).toBe(6);
  });

  it('Partial credits when unit average < 10 and some modules >= 10', () => {
    const unit = mkUnit('UE2', 6, 1, [
      { code: 'A', credit: 4, coeff: 1, has_exam: true, has_td: false, has_tp: false },
      { code: 'B', credit: 2, coeff: 1, has_exam: true, has_td: false, has_tp: false },
    ]);
    const inputs: ModuleInput[] = [
      { moduleCode: 'A', exam: 9 },
      { moduleCode: 'B', exam: 10 },
    ];
    const sem = computeSemester([unit], inputs, licence);
    const ue = sem.unitResults[0];
    expect(ue.average).toBe(9.33);
    expect(ue.validated).toBe(false);
    expect(ue.creditsAwarded).toBe(2);
  });

  it('Semester awarding: average >= 10 awards 30 credits', () => {
    const u1 = mkUnit('U1', 15, 2, [ { code: 'A', credit: 5, coeff: 1, has_exam: true, has_td: false, has_tp: false } ]);
    const u2 = mkUnit('U2', 15, 1, [ { code: 'B', credit: 5, coeff: 1, has_exam: true, has_td: false, has_tp: false } ]);
    const inputs: ModuleInput[] = [
      { moduleCode: 'A', exam: 12 },
      { moduleCode: 'B', exam: 9.9 },
    ];
    const sem = computeSemester([u1, u2], inputs, licence);
    expect(sem.average).toBe(11.3);
    expect(sem.validated).toBe(true);
    expect(sem.totalCreditsAwarded).toBe(30);
  });

  it('Annual awarding: validated year -> 60 credits', () => {
    const s1 = { average: 10.5, validated: true, totalCreditsAwarded: 30, unitResults: [] } as any;
    const s2 = { average: 11.2, validated: true, totalCreditsAwarded: 30, unitResults: [] } as any;
    const ann = computeAnnual(s1, s2);
    expect(ann.annualAverage).toBe(10.85);
    expect(ann.totalCreditsAwarded).toBe(60);
    expect(ann.validated).toBe(true);
  });
});
