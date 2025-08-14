import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { computeSemester, computeAnnual, type SemesterResult, type Unit as GUnit, type ModuleInput as GModuleInput } from "@/logic/grades";
import type { ProgramKey } from "@/constants/modules";
import aiIcon from "@/assets/ai-assistant.png";

interface AIAssistantProps {
  level: 'licence' | 'master';
  program?: ProgramKey;
  sem1: SemesterResult;
  sem2: SemesterResult;
  sem1Units: GUnit[];
  sem2Units: GUnit[];
  sem1Inputs: GModuleInput[];
  sem2Inputs: GModuleInput[];
  moduleNameMap: Record<string, string>;
  isEngineering?: boolean;
  engineeringYear?: string;
}

type ModuleInfo = {
  code: string;
  name: string;
  semester: 1 | 2;
  unitId: string;
  currentExam: number; // treated as 0 if missing
  avg: number; // current module average
  moduleValidated: boolean;
  unitValidated: boolean;
};

type Suggestion = {
  modules: { code: string; name: string; minExam: number }[];
  totalIncrease: number; // sum of increases from current exams (for ranking)
};

export default function AIAssistant({ level, program, sem1, sem2, sem1Units, sem2Units, sem1Inputs, sem2Inputs, moduleNameMap, isEngineering = false, engineeringYear }: AIAssistantProps) {
  const [open, setOpen] = useState(false);

  // Build flat module list with exams and current averages
  const allModules = useMemo<ModuleInfo[]>(() => {
    const pick = (units: GUnit[], inputs: GModuleInput[], sem: 1 | 2, res: SemesterResult) => {
    const arr: ModuleInfo[] = [];
    if (res.validated) return arr; // semester passed => exclude all
    const inputMap = new Map(inputs.map(i => [i.moduleCode, i] as const));
    res.unitResults.forEach(ur => {
      const u = units.find(uu => uu.id === ur.unitId);
      if (!u) return;
      if (ur.validated) return; // unit passed => exclude all modules in it
      ur.moduleResults.forEach(mr => {
        const m = u.modules.find(mm => mm.code === mr.moduleCode);
        if (!m || !m.has_exam) return;
        if (mr.validated) return; // passed module => skip
        const inp = inputMap.get(m.code);
        const currExam = inp?.exam ?? 0;
        const avg = mr.average ?? 0;
        arr.push({
          code: m.code,
          name: moduleNameMap[m.code] ?? m.code,
          semester: sem,
          unitId: u.id,
          currentExam: currExam,
          avg,
          moduleValidated: mr.validated,
          unitValidated: ur.validated,
        });
      });
    });
    return arr;
  };
  return [...pick(sem1Units, sem1Inputs, 1, sem1), ...pick(sem2Units, sem2Inputs, 2, sem2)];
  }, [sem1Units, sem2Units, sem1Inputs, sem2Inputs, sem1, sem2, moduleNameMap]);

  // Default selection: exam-enabled modules with avg < 10
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const init: Record<string, boolean> = {};
    allModules.forEach(m => { init[m.code] = true; });
    setSelected(init);
  }, [allModules]);

  const targetAnnual = 10.0;

  // Helpers for rattrapage mark quantization (apply only to AI suggestions)
  const clamp01_20 = (x: number) => Math.min(20, Math.max(0, x));
  const ceilToQuarter = (x: number) => {
    const v = Math.ceil(x * 4 - 1e-9) / 4;
    return clamp01_20(v);
  };
  const roundToQuarter = (x: number) => {
    const v = Math.round(x * 4) / 4;
    return clamp01_20(v);
  };
  const formatQuarter = (x: number) => {
    const v = roundToQuarter(x);
    // Ensure format: integer or .25 / .5 / .75 (no other decimals)
    const intPart = Math.floor(v + 1e-9);
    if (Math.abs(v - intPart) < 1e-9) return String(intPart);
    const q = Math.round((v - intPart) * 4); // 1 => .25, 2 => .5, 3 => .75
    const suffix = q === 1 ? '.25' : q === 2 ? '.5' : '.75';
    return `${intPart}${suffix}`;
  };

  // Recompute annual with optional exam overrides
  const computeAnnualWith = (overrides: Record<string, number>) => {
    const nextInputs1 = sem1Inputs.map(i => overrides[i.moduleCode] !== undefined ? { ...i, exam: overrides[i.moduleCode] } : i);
    const nextInputs2 = sem2Inputs.map(i => overrides[i.moduleCode] !== undefined ? { ...i, exam: overrides[i.moduleCode] } : i);
    const s1 = computeSemester(sem1Units, nextInputs1, level);
    const s2 = computeSemester(sem2Units, nextInputs2, level);
    const ann = computeAnnual(s1, s2);
    return ann.annualAverage;
  };

  // Discrete search (0.25 steps) for minimal exam to reach target
  const findMinExamFor = (code: string, current: number): number | null => {
    let v = ceilToQuarter(Math.max(0, current));
    while (v <= 20 + 1e-9) {
      const ann = computeAnnualWith({ [code]: v });
      if (ann !== null && ann >= targetAnnual) return v;
      if (v >= 20) break;
      v = Math.min(20, Math.round((v + 0.25) * 4) / 4);
    }
    return null;
  };

  // Performance-optimized planning using linear sensitivity (gradients)
  const DELTA = 0.5;

  // Current annual baseline (no overrides)
  const baseAnnual = useMemo(() => {
    const ann = computeAnnualWith({});
    return ann ?? 0;
  }, [sem1Inputs, sem2Inputs, sem1Units, sem2Units, level]);

  // Credit status helpers (validé avec dette)
  const [creditRule, setCreditRule] = useState<30 | 45>(30);
  const currentCredits = sem1.totalCreditsAwarded + sem2.totalCreditsAwarded;

  const debtAllowed = useMemo(() => {
    if (isEngineering) {
      // For engineering: no credit system for ING5, credit system for all others
      return engineeringYear !== "ING5";
    }
    if (!program) return false;
    const key = String(program);
    return key === 'L1' || key === 'L2' || key === 'M1-IA' || key === 'M1-SID' || key === 'M1-RSID';
  }, [program, isEngineering, engineeringYear]);

  // Build list of failed modules eligible for credit recovery
  type FailedMod = { code: string; name: string; credit: number; semester: 1 | 2 };
  const failedModulesForCredits = useMemo<FailedMod[]>(() => {
    const collect = (units: GUnit[], res: SemesterResult, sem: 1 | 2) => {
      const out: FailedMod[] = [];
      if (res.validated) return out; // entire semester passed => nothing to recover here
      res.unitResults.forEach((ur) => {
        if (ur.validated) return; // whole unit validated => skip its modules
        const u = units.find((uu) => uu.id === ur.unitId);
        if (!u) return;
        ur.moduleResults.forEach((mr) => {
          if (mr.validated) return;
          const mod = u.modules.find((mm) => mm.code === mr.moduleCode);
          if (!mod) return;
          out.push({ code: mod.code, name: moduleNameMap[mod.code] ?? mod.code, credit: mod.credit, semester: sem });
        });
      });
      return out;
    };
    return [...collect(sem1Units, sem1, 1), ...collect(sem2Units, sem2, 2)].sort((a, b) => b.credit - a.credit);
  }, [sem1Units, sem2Units, sem1, sem2, moduleNameMap]);

  // Sensitivity of annual average to a +DELTA change in a module's exam (approx derivative)
  const weightMap = useMemo(() => {
    const map = new Map<string, number>();
    const chosen = allModules.filter(m => selected[m.code]);
    for (const m of chosen) {
      const x = Math.min(20, Math.max(0, m.currentExam + DELTA));
      const ann = computeAnnualWith({ [m.code]: x });
      const w = ann === null ? 0 : (ann - baseAnnual) / (x - m.currentExam || DELTA);
      map.set(m.code, Math.max(0, w));
    }
    return map;
  }, [allModules, selected, baseAnnual]);

  // Discrete refinement for the last variable while others are fixed (0.25 steps)
  const refineLast = (fixed: Record<string, number>, last: ModuleInfo, lowStart?: number): number | null => {
    let v = ceilToQuarter(lowStart ?? last.currentExam);
    while (v <= 20 + 1e-9) {
      const ann = computeAnnualWith({ ...fixed, [last.code]: v });
      if (ann !== null && ann >= targetAnnual) return v;
      if (v >= 20) break;
      v = Math.min(20, Math.round((v + 0.25) * 4) / 4);
    }
    return null;
  };

  // Greedy allocation across modules by descending sensitivity to minimize total increase
  const greedyForModules = (mods: ModuleInfo[]): Suggestion | null => {
    if (mods.length === 0) return null;
    const needRaw = targetAnnual - baseAnnual;
    if (needRaw <= 0) return null;

    // Sort by sensitivity (higher impact first)
    const sorted = [...mods]
      .map(m => ({ m, w: weightMap.get(m.code) ?? 0 }))
      .filter(x => x.w > 0)
      .sort((a, b) => b.w - a.w);
    if (sorted.length === 0) return null;

    const assigned: Record<string, number> = {};
    let remaining = needRaw;
    let lastUsed: ModuleInfo | null = null;

    for (const { m, w } of sorted) {
      if (remaining <= 1e-6) break;
      const maxInc = Math.max(0, 20 - m.currentExam);
      if (maxInc <= 1e-9) continue;
      const alloc = Math.min(maxInc, remaining / w);
      if (alloc > 0) {
        assigned[m.code] = ceilToQuarter(m.currentExam + alloc);
        remaining -= alloc * w;
        lastUsed = m;
      }
    }

    // If still not enough after maxing all, impossible
    if (remaining > 1e-6) return null;

    // Refine the last used module to the minimal exact value while keeping others fixed
    if (lastUsed) {
      const fixed: Record<string, number> = {};
      Object.entries(assigned).forEach(([c, v]) => { if (c !== lastUsed!.code) fixed[c] = v; });

      // If others alone already reach target, drop lastUsed back to current
      const othersOnly = computeAnnualWith(fixed);
      if (othersOnly !== null && othersOnly >= targetAnnual) {
        delete assigned[lastUsed.code];
      } else {
        const lowStart = lastUsed.currentExam;
        const refined = refineLast(fixed, lastUsed, lowStart);
        if (refined === null) return null;
        assigned[lastUsed.code] = refined;
      }
    }

    const modules = Object.entries(assigned).map(([code, minExam]) => ({ code, name: mods.find(m => m.code === code)!.name, minExam }));
    const totalIncrease = modules.reduce((sum, m) => sum + (m.minExam - (mods.find(x => x.code === m.code)!.currentExam)), 0);
    return { modules, totalIncrease };
  };

  // Build suggestions for currently selected modules: singles, all pairs, and combined-all with refinement
  const suggestions = useMemo<Suggestion[]>(() => {
    const chosen = allModules.filter(m => selected[m.code]);
    if (chosen.length === 0) return [];

    const map = new Map<string, Suggestion>();

    const keyOf = (mods: { code: string; minExam: number }[]) => {
      const sorted = [...mods].sort((a, b) => a.code.localeCompare(b.code));
      return sorted.map(m => `${m.code}:${m.minExam.toFixed(2)}`).join('|');
    };

    // Singles
    for (const m of chosen) {
      const min = findMinExamFor(m.code, m.currentExam);
      if (min !== null) {
        const mods = [{ code: m.code, name: m.name, minExam: Math.min(20, Math.max(0, min)) }];
        const totalIncrease = Math.max(0, min - m.currentExam);
        map.set(keyOf(mods), { modules: mods, totalIncrease });
      }
    }

    // Pairs
    const sampleValues = (from: number, to: number, steps = 12) => {
      const arr: number[] = [];
      let v = ceilToQuarter(from);
      const end = clamp01_20(to);
      while (v <= end + 1e-9) {
        arr.push(v);
        if (v >= 20) break;
        v = Math.min(20, Math.round((v + 0.25) * 4) / 4);
      }
      return arr;
    };

    for (let i = 0; i < chosen.length; i++) {
      for (let j = i + 1; j < chosen.length; j++) {
        const a = chosen[i];
        const b = chosen[j];

        let bestPair: Suggestion | null = null;

        const tryUpdate = (aVal: number, bVal: number | null) => {
          if (bVal === null) return;
          const ax = roundToQuarter(aVal);
          const bx = roundToQuarter(bVal);
          const mods = [
            { code: a.code, name: a.name, minExam: ax },
            { code: b.code, name: b.name, minExam: bx },
          ];
          const totalIncrease = Math.max(0, ax - a.currentExam) + Math.max(0, bx - b.currentExam);
          const cand = { modules: mods, totalIncrease };
          if (!bestPair || cand.totalIncrease < bestPair.totalIncrease - 1e-6) bestPair = cand;
        };

        // Single-module sufficiency as a valid pair (other stays at current)
        const minA = findMinExamFor(a.code, a.currentExam);
        if (minA !== null) tryUpdate(minA, b.currentExam);
        const minB = findMinExamFor(b.code, b.currentExam);
        if (minB !== null) tryUpdate(a.currentExam, minB);

        // Distributed improvements search: fix A then refine B
        const aCandidates = sampleValues(a.currentExam, 20, 12);
        for (const av of aCandidates) {
          const rb = refineLast({ [a.code]: av }, b, b.currentExam);
          if (rb !== null) tryUpdate(av, rb);
        }
        // Symmetric: fix B then refine A
        const bCandidates = sampleValues(b.currentExam, 20, 12);
        for (const bv of bCandidates) {
          const ra = refineLast({ [b.code]: bv }, a, a.currentExam);
          if (ra !== null) tryUpdate(ra, bv);
        }

        if (bestPair) {
          const modsSorted = bestPair.modules.map(m => ({ ...m, minExam: Math.min(20, Math.max(0, m.minExam)) }));
          map.set(keyOf(modsSorted), { modules: modsSorted, totalIncrease: bestPair.totalIncrease });
        }
      }
    }

    // Combined proposal using all chosen modules with coordinate refinement
    if (chosen.length >= 2) {
      const start = greedyForModules(chosen);
      if (start) {
        let assigned: Record<string, number> = Object.fromEntries(start.modules.map(m => [m.code, m.minExam]));
        // Two passes of coordinate descent
        for (let pass = 0; pass < 2; pass++) {
          for (const code of Object.keys(assigned)) {
            const last = chosen.find(mm => mm.code === code);
            if (!last) continue;
            const fixed: Record<string, number> = {};
            Object.entries(assigned).forEach(([c, v]) => { if (c !== code) fixed[c] = v; });
            const refined = refineLast(fixed, last, assigned[code]);
            if (refined !== null) assigned[code] = refined;
          }
        }
        const mods = Object.keys(assigned).map(code => {
          const m = chosen.find(mm => mm.code === code)!;
          return { code, name: m.name, minExam: assigned[code] };
        });
        const totalIncrease = mods.reduce((sum, m) => {
          const cur = chosen.find(mm => mm.code === m.code)!.currentExam;
          return sum + Math.max(0, m.minExam - cur);
        }, 0);
        const modsSorted = mods.map(m => ({ ...m, minExam: Math.min(20, Math.max(0, m.minExam)) }));
        map.set(keyOf(modsSorted), { modules: modsSorted, totalIncrease });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.totalIncrease - b.totalIncrease);
  }, [allModules, selected, baseAnnual, weightMap]);

  return (
    <div className="mt-2">
      <Button variant="secondary" onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
        <img
          src={aiIcon}
          alt="Icône de l'assistant IA pour le rattrapage académique personnalisé"
          loading="lazy"
          decoding="async"
          className="h-5 w-5"
        />
        <span>{isEngineering ? (engineeringYear === "ING5" ? 'Statut rattrapage (IA)' : 'Statut des crédits et rattrapage (IA)') : (debtAllowed ? 'Statut des crédits et rattrapage (IA)' : 'Rattrapage (IA)')}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-screen max-w-screen sm:w-auto sm:max-w-4xl p-3 sm:p-6 max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-lg">
          <DialogHeader>
            <DialogTitle>{isEngineering ? (engineeringYear === "ING5" ? 'Statut rattrapage (IA)' : 'Statut des crédits et rattrapage (IA)') : (debtAllowed ? 'Statut des crédits et rattrapage (IA)' : 'Rattrapage (IA)')}</DialogTitle>
          </DialogHeader>
          <div className={`grid grid-cols-1 ${debtAllowed ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4`}>
            {/* Gauche: Statut des crédits (affiché uniquement pour L1, L2, M1IA, M1SID, M1RSID) */}
            {debtAllowed && (
                <aside className="space-y-3 overflow-x-hidden">
                  <div className="rounded-md border bg-muted/30 px-3 py-2">
                    <h3 className="text-sm font-semibold">Statut de crédit</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Il évalue également votre situation en crédits (validé normal ou validé avec dette) selon votre niveau et les seuils requis (30 ou 45 crédits), et vous indique les modules nécessaires pour atteindre ces seuils si applicable.
                  </p>
                  <div className="text-sm">
                    <div className="mb-2">Validé normal: {baseAnnual >= 10 ? <span className="font-medium">Atteint (moyenne annuelle ≥ 10,00)</span> : <span className="text-muted-foreground">Non atteint</span>}</div>
                    <div>Crédits actuels: <span className="tabular-nums font-medium">{currentCredits}</span> / 60</div>
                  </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Règle admis avec dette</Label>
                    <RadioGroup className="grid grid-cols-2 gap-2" value={String(creditRule)} onValueChange={(v) => setCreditRule(parseInt(v, 10) as 30 | 45)}>
                      <div className="flex items-center gap-2 rounded-md border p-2">
                        <RadioGroupItem id="cr30" value="30" />
                        <Label htmlFor="cr30">30 crédits</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border p-2">
                        <RadioGroupItem id="cr45" value="45" />
                        <Label htmlFor="cr45">45 crédits</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="text-sm">
                    {currentCredits >= creditRule ? (
                      <p>Vous êtes déjà admis avec dette.</p>
                    ) : (
                      <>
                        <p>Vous avez actuellement {currentCredits} crédits. Pour atteindre {creditRule}, validez ces modules :</p>
                        <div className="mt-1">
                          {(() => {
                            const needed: { code: string; name: string; credit: number; semester: 1 | 2 }[] = [];
                            let sum = 0;
                            for (const fm of failedModulesForCredits) {
                              if (sum >= (creditRule - currentCredits)) break;
                              needed.push(fm);
                              sum += fm.credit;
                            }
                            
                            if (needed.length === 0) {
                              return <p className="text-sm pl-5">Aucun module en échec restant.</p>;
                            }
                            
                            // Group modules by credit combinations that would satisfy the requirement
                            const creditsNeeded = creditRule - currentCredits;
                            const alternatives: { code: string; name: string; credit: number; semester: 1 | 2 }[][] = [];
                            
                            // Check single modules that satisfy the requirement
                            needed.forEach(module => {
                              if (module.credit >= creditsNeeded) {
                                alternatives.push([module]);
                              }
                            });
                            
                            // If no single module satisfies, show the sequential combination
                            if (alternatives.length === 0) {
                              alternatives.push(needed);
                            }
                            
                            return (
                              <div className="pl-5 space-y-2">
                                {alternatives.map((alt, idx) => (
                                  <div key={idx}>
                                    {idx > 0 && <div className="text-center text-sm font-medium text-muted-foreground">OU</div>}
                                    <ul className="list-disc space-y-1">
                                      {alt.map((m) => (
                                        <li key={m.code}>{m.code}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">S'applique à L1, L2 et M1 (M1SID, M1RSID, M1IA). L3ISIL/L3SI et tous les M2 n'autorisent pas la dette.</p>
                </div>
              </aside>
            )}


            {/* Droite: Rattrapage (sélection + suggestions) */}
            <div className="space-y-3 overflow-x-hidden">
              {/* Rattrapage - Intro */}
              <header className="space-y-1">
                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  <h3 className="text-sm font-semibold">Statut de rattrapage</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cet outil analyse vos notes et les modules sélectionnés pour recommander les notes minimales à viser au rattrapage afin d'atteindre une moyenne annuelle de 10,00 ou plus.
                  <br />
                  Le rattrapage remplace uniquement la note d'examen; le CC reste inchangé.
                </p>
              </header>
              {/* Sélection */}
              <section className="space-y-2">
                <p className="text-sm font-medium">Voici les modules pour lesquels vous envisagez un rattrapage. Sélectionnez ceux que vous souhaitez repasser.</p>
                <ul className="space-y-2 max-h-56 overflow-y-auto overflow-x-hidden pr-2 max-w-full">
                  {allModules.map((m) => (
                    <li key={m.code} className="flex w-full items-center justify-between gap-3 rounded-md border p-2">
                      <label className="flex items-center gap-2 min-w-0 flex-1">
                        <Checkbox
                          checked={!!selected[m.code]}
                          onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [m.code]: !!v }))}
                          aria-label={`Sélectionner ${m.name} pour le rattrapage`}
                        />
                        <span className="break-words whitespace-normal">
                          <span className="font-medium">{m.code}</span>
                          <span className="ml-2 text-xs text-muted-foreground">(S{m.semester})</span>
                        </span>
                      </label>
                      <div className="text-right shrink-0 text-xs">
                        <div>Moy.: <span className="tabular-nums font-semibold">{m.avg.toFixed(2)}</span></div>
                        <div className="text-muted-foreground">Examen actuel: <span className="tabular-nums">{m.currentExam.toFixed(2)}</span></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Suggestions */}
              <section className="space-y-2 mt-3">
                <h3 className="font-semibold">Options pour atteindre une moyenne annuelle ≥ 10,00</h3>
                {suggestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Choisissez un ou plusieurs modules pour voir des plans de rattrapage concrets.</p>
                ) : (
                  <div className="space-y-2 max-w-full overflow-x-hidden">
                    {suggestions.map((sug, idx) => (
                      <div key={idx} className="w-full rounded-md border p-2">
                        <ul className="text-sm space-y-1">
                          {sug.modules.map((m) => (
                            <li key={m.code}>- {m.code} : minimum <strong className="tabular-nums">{formatQuarter(m.minExam)}</strong> à l'examen de rattrapage</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Conseils : privilégiez les modules avec forts coefficients/crédits et les moyennes proches de 10. Entraînez-vous sur des sujets, faites des simulations chronométrées et ciblez d'abord vos lacunes.</p>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
