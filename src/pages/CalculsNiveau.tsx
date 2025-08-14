import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollableRibbon } from "@/components/ui/ScrollableRibbon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { ProgramKey, ProgramsMap, SemesterData, UEDef, ModuleDef } from "@/constants/modules";
import { programsData } from "@/constants/modules";
import { modulesDATAING1_2, engineeringPrograms } from "@/constants/engineering";
import { modulesDataGL } from "@/constants/gl";
import { modulesDataIA } from "@/constants/ia";
import { modulesDataRI } from "@/constants/ri";
import modulesDataSDD from "@/constants/sdd";
import modulesDataSI from "@/constants/si";
import { modulesDataSEC } from "@/constants/sec";
import { computeSemester, computeAnnual, type Module as GModule, type Unit as GUnit, type ModuleInput as GModuleInput, type SemesterResult as GSemesterResult } from "@/logic/grades";
import AIAssistant from "@/components/widgets/AIAssistant";

// Program groupings
const LICENCE_PROGRAMS: { key: ProgramKey; label: string }[] = [
  { key: "L1", label: "L1" },
  { key: "L2", label: "L2" },
  { key: "L3-ISIL" as ProgramKey, label: "L3ISIL" },
  { key: "L3-SI" as ProgramKey, label: "L3SI" },
];

const MASTER_PROGRAMS: { key: ProgramKey; label: string }[] = [
  { key: "M1-IA" as ProgramKey, label: "M1IA" },
  { key: "M1-SID" as ProgramKey, label: "M1SID" },
  { key: "M1-RSID" as ProgramKey, label: "M1RSID" },
  { key: "M2-IA" as ProgramKey, label: "M2IA" },
  { key: "M2-SID" as ProgramKey, label: "M2SID" },
  { key: "M2-RSID" as ProgramKey, label: "M2RSID" },
];

const ALL_PROGRAM_OPTIONS = [
  ...LICENCE_PROGRAMS,
  ...MASTER_PROGRAMS,
  { key: "M2-IA" as ProgramKey, label: "M2 IA" },
  { key: "M2-SID" as ProgramKey, label: "M2 SID" },
  { key: "M2-RSID" as ProgramKey, label: "M2 RSID" },
];

type NoteMap = Record<string, { td?: string; tp?: string; exam?: string }>;

export default function CalculsNiveau() {
  const [activeCategory, setActiveCategory] = useState<"licence" | "master" | "engineering">("licence");
  const [program, setProgram] = useState<ProgramKey | undefined>(undefined);
  const [notes, setNotes] = useState<NoteMap>({});
  // Remember last selected programs per category to restore when navigating back
  const [lastLicenceProgram, setLastLicenceProgram] = useState<ProgramKey | undefined>(undefined);
  const [lastMasterProgram, setLastMasterProgram] = useState<ProgramKey | undefined>(undefined);
  // Track previous category to detect "going back" vs "switching away"
  const [prevCategory, setPrevCategory] = useState<"licence" | "master" | "engineering" | undefined>(undefined);
  const [selectedING1_2, setSelectedING1_2] = useState<string | undefined>(undefined);
  const [selectedEngineering, setSelectedEngineering] = useState<string | undefined>(undefined);
  const [engineeringNotes, setEngineeringNotes] = useState<NoteMap>({});
  const toNum = (v?: string) => {
    if (v === undefined || v === '') return undefined;
    const normalized = v.replace(',', '.').replace(/\s+/g, '').trim();
    const n = parseFloat(normalized);
    if (!isFinite(n)) return undefined;
    // Clamp for calculations only (does NOT mutate input display)
    const clamped = Math.max(0, Math.min(20, n));
    return clamped;
  };

  // SEO: set title and meta description
  useEffect(() => {
    document.title = "Calculations | SmartCalc+";
    const metaName = "description";
    const content = "Academic calculations: select program, enter notes (0-20), live averages by UE and semester.";
    let meta = document.querySelector(`meta[name="${metaName}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", metaName);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  }, []);

  // Engineering data adaptation
  const engineeringDataForProgram = useMemo(() => {
    if (!selectedEngineering) return undefined;
    
    // Handle ING1_2 options first (highest priority)
    if (selectedEngineering === 'ing1' || selectedEngineering === 'ing2') {
      const selectedData = modulesDATAING1_2.ING1_2;
      const semesters = engineeringPrograms[selectedEngineering as keyof typeof engineeringPrograms]?.semesters;
      if (!semesters) return undefined;
      
      const adapted: { [key: number]: any[] } = {};
      semesters.forEach((semNumber, index) => {
        adapted[index + 1] = selectedData[semNumber] || [];
      });
      return adapted;
    }
    
    // Handle specialization options with priority order (most specific to least specific)
    // ING5 options (highest priority)
    if (selectedEngineering === 'GL3') {
      const glData = modulesDataGL.GL;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = glData[9] || [];  // Semester 9
      adapted[2] = glData[10] || []; // Semester 10
      return adapted;
    }
    if (selectedEngineering === 'IA3') {
      const iaData = modulesDataIA.IA;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = iaData[9] || [];  // Semester 9
      adapted[2] = iaData[10] || []; // Semester 10
      return adapted;
    }
    if (selectedEngineering === 'RI3') {
      const riData = modulesDataRI.RI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = riData[9] || [];  // Semester 9
      adapted[2] = riData[10] || []; // Semester 10
      return adapted;
    }
    if (selectedEngineering === 'SDD3') {
      const sddData = modulesDataSDD.SDD;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = sddData[9] || [];  // Semester 9
      adapted[2] = sddData[10] || []; // Semester 10
      return adapted;
    }
    if (selectedEngineering === 'SI3') {
      const siData = modulesDataSI.SI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = siData[9] || [];  // Semester 9
      adapted[2] = siData[10] || []; // Semester 10
      return adapted;
    }
    if (selectedEngineering === 'SEC3') {
      const secData = modulesDataSEC.SEC;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = secData[9] || [];  // Semester 9
      adapted[2] = secData[10] || []; // Semester 10
      return adapted;
    }
    
    // ING4 options (medium priority)
    if (selectedEngineering === 'GL2') {
      const glData = modulesDataGL.GL;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = glData[7] || []; // Semester 7
      adapted[2] = glData[8] || []; // Semester 8
      return adapted;
    }
    if (selectedEngineering === 'IA2') {
      const iaData = modulesDataIA.IA;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = iaData[7] || []; // Semester 7
      adapted[2] = iaData[8] || []; // Semester 8
      return adapted;
    }
    if (selectedEngineering === 'RI2') {
      const riData = modulesDataRI.RI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = riData[7] || []; // Semester 7
      adapted[2] = riData[8] || []; // Semester 8
      return adapted;
    }
    if (selectedEngineering === 'SDD2') {
      const sddData = modulesDataSDD.SDD;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = sddData[7] || []; // Semester 7
      adapted[2] = sddData[8] || []; // Semester 8
      return adapted;
    }
    if (selectedEngineering === 'SI2') {
      const siData = modulesDataSI.SI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = siData[7] || []; // Semester 7
      adapted[2] = siData[8] || []; // Semester 8
      return adapted;
    }
    if (selectedEngineering === 'SEC2') {
      const secData = modulesDataSEC.SEC;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = secData[7] || []; // Semester 7
      adapted[2] = secData[8] || []; // Semester 8
      return adapted;
    }
    
    // ING3 options (lowest priority)
    if (selectedEngineering === 'GL1') {
      const glData = modulesDataGL.GL;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = glData[5] || []; // Semester 5
      adapted[2] = glData[6] || []; // Semester 6
      return adapted;
    }
    if (selectedEngineering === 'IA1') {
      const iaData = modulesDataIA.IA;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = iaData[5] || []; // Semester 5
      adapted[2] = iaData[6] || []; // Semester 6
      return adapted;
    }
    if (selectedEngineering === 'RI1') {
      const riData = modulesDataRI.RI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = riData[5] || []; // Semester 5
      adapted[2] = riData[6] || []; // Semester 6
      return adapted;
    }
    if (selectedEngineering === 'SDD1') {
      const sddData = modulesDataSDD.SDD;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = sddData[5] || []; // Semester 5
      adapted[2] = sddData[6] || []; // Semester 6
      return adapted;
    }
    if (selectedEngineering === 'SI1') {
      const siData = modulesDataSI.SI;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = siData[5] || []; // Semester 5
      adapted[2] = siData[6] || []; // Semester 6
      return adapted;
    }
    if (selectedEngineering === 'SEC1') {
      const secData = modulesDataSEC.SEC;
      const adapted: { [key: number]: any[] } = {};
      adapted[1] = secData[5] || []; // Semester 5
      adapted[2] = secData[6] || []; // Semester 6
      return adapted;
    }
    
    return undefined;
  }, [selectedEngineering]);

  const dataForProgram = useMemo(() => {
    if (activeCategory === "engineering") return engineeringDataForProgram;
    return (programsData as ProgramsMap)[program];
  }, [program, activeCategory, engineeringDataForProgram]);

  const dropdownOptions = useMemo(() => {
    if (activeCategory === "licence") return LICENCE_PROGRAMS;
    if (activeCategory === "master") return MASTER_PROGRAMS;
    return [] as { key: ProgramKey; label: string }[];
  }, [activeCategory]);

  const handleSelectProgram = (key: ProgramKey) => {
    setProgram(key);
    // Remember last selected program for its category
    if (String(key).startsWith("M1-") || String(key).startsWith("M2-")) {
      setLastMasterProgram(key);
    } else {
      setLastLicenceProgram(key);
    }
    // reset notes when switching programs (keeps state clean)
    setNotes({});
  };
  const handleNoteChange = (moduleKey: string, field: "td" | "tp" | "exam", value: string) => {
    // Real-time clamp to [0, 20] while allowing free typing otherwise
    if (value === "") {
      if (activeCategory === "engineering") {
        setEngineeringNotes((prev) => ({ ...prev, [moduleKey]: { ...prev[moduleKey], [field]: "" } }));
      } else {
        setNotes((prev) => ({ ...prev, [moduleKey]: { ...prev[moduleKey], [field]: "" } }));
      }
      return;
    }

    const normalized = value.replace(',', '.').replace(/\s+/g, '').trim();
    const n = parseFloat(normalized);

    let nextValue = value; // keep user formatting by default
    if (isFinite(n)) {
      if (n > 20) nextValue = "20";
      else if (n < 0) nextValue = "0";
    }

    if (activeCategory === "engineering") {
      setEngineeringNotes((prev) => ({
        ...prev,
        [moduleKey]: { ...prev[moduleKey], [field]: nextValue },
      }));
    } else {
      setNotes((prev) => ({
        ...prev,
        [moduleKey]: { ...prev[moduleKey], [field]: nextValue },
      }));
    }
  };
  const handleResetAll = () => {
    if (activeCategory === "engineering") {
      setEngineeringNotes({});
    } else {
      setNotes({});
    }
  };
  // Clamp an input value to 0..20 only on blur to avoid mutating while typing
  const clampNoteOnBlur = (moduleKey: string, field: "td" | "tp" | "exam") => (e: any) => {
    const raw = e.currentTarget.value as string;
    if (raw === "" || raw === undefined) return;
    const normalized = raw.replace(',', '.').replace(/\s+/g, '').trim();
    const n = parseFloat(normalized);
    if (!isFinite(n)) return;
    let clamped = n;
    if (n < 0) clamped = 0;
    if (n > 20) clamped = 20;
    // Only update if out of bounds to preserve exact user input formatting
    if (clamped !== n) {
      if (activeCategory === "engineering") {
        setEngineeringNotes((prev) => ({
          ...prev,
          [moduleKey]: { ...prev[moduleKey], [field]: String(clamped) },
        }));
      } else {
        setNotes((prev) => ({
          ...prev,
          [moduleKey]: { ...prev[moduleKey], [field]: String(clamped) },
        }));
      }
    }
  };

  // Completion helpers
  const currentNotes = activeCategory === "engineering" ? engineeringNotes : notes;
  const hasFieldValue = (key: string, field: 'td'|'tp'|'exam') => toNum(currentNotes[key]?.[field]) !== undefined;
  const isModuleComplete = (mod: ModuleDef, semester: number) => {
    const key = activeCategory === "engineering" ? `eng-${selectedEngineering}-${semester}-${mod.code}` : `${program}-${semester}-${mod.code}`;
    const tdOk = mod.has_td ? hasFieldValue(key, 'td') : true;
    const tpOk = mod.has_tp ? hasFieldValue(key, 'tp') : true;
    const exOk = mod.has_exam ? hasFieldValue(key, 'exam') : true;
    return tdOk && tpOk && exOk;
  };
  const isUnitComplete = (ue: UEDef, semester: number) => ue.modules.every(m => isModuleComplete(m, semester));
  const isSemesterComplete = (sem: number) => (dataForProgram?.[sem] ?? []).every(ue => isUnitComplete(ue, sem));
  const isAnnualComplete = () => isSemesterComplete(1) && isSemesterComplete(2);

  // Calculation logic (refactored to centralized engine)
  const isMasterProgram = (p: ProgramKey) => String(p).startsWith("M1-") || String(p).startsWith("M2-");
  const level = useMemo(() => {
    if (activeCategory === "engineering") return 'licence'; // Engineering uses licence rules
    return (isMasterProgram(program) ? 'master' : 'licence') as 'licence'|'master';
  }, [program, activeCategory]);

  const adaptUnits = (semesterUEs?: SemesterData): GUnit[] => {
    if (!semesterUEs) return [];
    return semesterUEs.map((ue) => ({
      id: ue.ue,
      ue: ue.type,
      coeff: ue.coeff,
      credit: ue.credit,
      modules: ue.modules.map<GModule>((m) => ({
        code: m.code,
        title: m.name,
        credit: m.credit,
        coeff: m.coeff,
        has_td: m.has_td,
        has_tp: m.has_tp,
        has_exam: m.has_exam,
        unitId: ue.ue,
      })),
    }));
  };

  const buildModuleInputs = (semesterUEs?: SemesterData, semester?: number): GModuleInput[] => {
    const inputs: GModuleInput[] = [];
    if (!semesterUEs) return inputs;
    semesterUEs.forEach((ue) => {
      ue.modules.forEach((m) => {
        const key = activeCategory === "engineering" 
          ? `eng-${selectedEngineering}-${semester}-${m.code}`
          : `${program}-${semester ?? ''}-${m.code}`;
        const n = currentNotes[key];
        const td = toNum(n?.td);
        const tp = toNum(n?.tp);
        const exam = toNum(n?.exam);
        inputs.push({ moduleCode: m.code, td, tp, exam });
      });
    });
    return inputs;
  };

  const sem1Units = useMemo(() => adaptUnits(dataForProgram?.[1]), [dataForProgram]);
  const sem2Units = useMemo(() => adaptUnits(dataForProgram?.[2]), [dataForProgram]);

  const sem1Inputs = useMemo(() => buildModuleInputs(dataForProgram?.[1], 1), [dataForProgram, currentNotes, program, selectedEngineering, activeCategory]);
  const sem2Inputs = useMemo(() => buildModuleInputs(dataForProgram?.[2], 2), [dataForProgram, currentNotes, program, selectedEngineering, activeCategory]);

  const sem1Result = useMemo<GSemesterResult>(() => computeSemester(sem1Units, sem1Inputs, level), [sem1Units, sem1Inputs, level]);
  const sem2Result = useMemo<GSemesterResult>(() => computeSemester(sem2Units, sem2Inputs, level), [sem2Units, sem2Inputs, level]);

  const moduleNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    [1, 2].forEach((s) => {
      (dataForProgram?.[s] ?? []).forEach((ue) => {
        ue.modules.forEach((m) => { map[m.code] = m.name; });
      });
    });
    return map;
  }, [dataForProgram]);

  const getSemesterResult = (sem: number) => (sem === 1 ? sem1Result : sem2Result);

  const annualResult = useMemo(() => computeAnnual(sem1Result, sem2Result), [sem1Result, sem2Result]);

  const displaySemesterNumber = (p: ProgramKey, s: number) => {
    if (activeCategory === "engineering") {
      // Handle engineering options based on selectedEngineering
      if (selectedEngineering === 'GL3' || selectedEngineering === 'IA3' || selectedEngineering === 'RI3' || 
          selectedEngineering === 'SDD3' || selectedEngineering === 'SI3' || selectedEngineering === 'SEC3') {
        return s === 1 ? 9 : 10;  // ING5: Semesters 9 and 10
      }
      
      if (selectedEngineering === 'GL2' || selectedEngineering === 'IA2' || selectedEngineering === 'RI2' || 
          selectedEngineering === 'SDD2' || selectedEngineering === 'SI2' || selectedEngineering === 'SEC2') {
        return s === 1 ? 7 : 8;   // ING4: Semesters 7 and 8
      }
      
      if (selectedEngineering === 'GL1' || selectedEngineering === 'IA1' || selectedEngineering === 'RI1' || 
          selectedEngineering === 'SDD1' || selectedEngineering === 'SI1' || selectedEngineering === 'SEC1') {
        return s === 1 ? 5 : 6;   // ING3: Semesters 5 and 6
      }
      
      // Handle ING1_2 options
      if (selectedEngineering === 'ing1' || selectedEngineering === 'ing2') {
        const semesters = engineeringPrograms[selectedEngineering as keyof typeof engineeringPrograms]?.semesters;
        return semesters ? semesters[s - 1] : s;
      }
    }
    
    const key = String(p);
    if (key === "L2") return s + 2; // 3 & 4
    if (key === "L3-ISIL" || key === "L3-SI") return s + 4; // 5 & 6
    if (key.startsWith("M2-")) return s + 2; // 3 & 4 for M2
    return s; // L1 & M1: 1 & 2
  };

  const renderUE = (ue: UEDef, semester: number) => {
    const semRes = getSemesterResult(semester);
    const unitRes = semRes.unitResults.find((ur) => ur.unitId === ue.ue);
    const unitComplete = isUnitComplete(ue, semester);
    return (
      <>
        {ue.modules.map((mod) => {
           const key = activeCategory === "engineering" 
            ? `eng-${selectedEngineering}-${semester}-${mod.code}`
            : `${program}-${semester}-${mod.code}`;
          const modNotes = currentNotes[key];
          const modRes = unitRes?.moduleResults.find((mr) => mr.moduleCode === mod.code);
          const avg = modRes?.average ?? null;
          const validated = !!modRes?.validated;
          const awardedCredit = modRes?.creditAwarded ?? 0;
          
          const shouldShowAvg = avg !== null;
          
          return (
            <TableRow key={key} className="border-b border-border">
              <TableCell className="px-1.5 py-1.5 pr-2 md:px-3 md:py-2.5 md:pr-4 align-top whitespace-normal">
                <div className="font-medium">
                   {activeCategory === "engineering" ? (
                     // For AI-specific modules: show only code, for regular engineering: show only name
                     (selectedEngineering === 'IA1' || selectedEngineering === 'IA2' || selectedEngineering === 'IA3') ? mod.code : mod.name
                  ) : mod.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Coef: {mod.coeff} | Credits: {mod.credit}
                  {(() => {
                    // Show "statut rattrapage" for all categories when module avg < 10
                    if (avg === null || avg >= 10) return null;
                    
                    // For engineering: show if module avg < 10 (existing logic)
                    if (activeCategory === "engineering") {
                      return <div className="text-destructive font-medium mt-1">Statut: rattrapage</div>;
                    }
                    
                    // For licence and master: additional checks for unit, semester and annual averages
                    const semesterResult = semester === 1 ? sem1Result : sem2Result;
                    
                    // Hide if unit average ≥ 10.00 (unit is validated)
                    const shouldHideDueToUnit = unitRes?.average !== null && unitRes.average >= 10;
                    
                    // Hide if semester average ≥ 10.00 (semester is validated)
                    const shouldHideDueToSemester = semesterResult?.average !== null && semesterResult.average >= 10;
                    
                    // Hide if annual average ≥ 10.00 (year is validated)
                    const shouldHideDueToAnnual = isAnnualComplete() && annualResult.annualAverage !== null && annualResult.annualAverage >= 10;
                    
                    if (shouldHideDueToUnit || shouldHideDueToSemester || shouldHideDueToAnnual) return null;
                    
                    return <div className="text-destructive font-medium mt-1">Statut: rattrapage</div>;
                  })()}
                </div>
              </TableCell>
              <TableCell className="px-1.5 md:px-3 py-1.5 md:py-2 space-y-1 md:space-y-2 min-w-0 md:min-w-[220px]">
                {mod.has_td && (
                  <Input
                    type="text"
                    inputMode="decimal"
                    // step is a hint; with type=text it's harmless and keeps parity if changed later
                    step="any"
                    className={`h-7 px-1.5 text-[11px] md:h-9 md:text-sm w-14 md:w-full ${toNum(modNotes?.td) !== undefined ? (toNum(modNotes?.td)! >= 10 ? 'text-success' : 'text-destructive') : ''}`}
                    placeholder="TD"
                    value={modNotes?.td ?? ""}
                    onChange={(e) => handleNoteChange(key, "td", e.target.value)}
                    onBlur={clampNoteOnBlur(key, "td")}
                    aria-label={`TD for ${mod.name}`}
                  />
                )}
                {mod.has_tp && (
                  <Input
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className={`h-7 px-1.5 text-[11px] md:h-9 md:text-sm w-14 md:w-full ${toNum(modNotes?.tp) !== undefined ? (toNum(modNotes?.tp)! >= 10 ? 'text-success' : 'text-destructive') : ''}`}
                    placeholder="TP"
                    value={modNotes?.tp ?? ""}
                    onChange={(e) => handleNoteChange(key, "tp", e.target.value)}
                    onBlur={clampNoteOnBlur(key, "tp")}
                    aria-label={`TP for ${mod.name}`}
                  />
                )}
                {mod.has_exam && (
                  <Input
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className={`h-7 px-1.5 text-[11px] md:h-9 md:text-sm w-14 md:w-full ${toNum(modNotes?.exam) !== undefined ? (toNum(modNotes?.exam)! >= 10 ? 'text-success' : 'text-destructive') : ''}`}
                    placeholder="EX"
                    value={modNotes?.exam ?? ""}
                    onChange={(e) => handleNoteChange(key, "exam", e.target.value)}
                    onBlur={clampNoteOnBlur(key, "exam")}
                    aria-label={`Exam for ${mod.name}`}
                  />
                )}
              </TableCell>
              <TableCell className={`tabular-nums text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5 text-xs md:text-sm ${shouldShowAvg ? (avg! >= 10 ? 'text-success' : 'text-destructive') : ''}`}>
                {shouldShowAvg ? <span className="font-semibold">{avg!.toFixed(2)}</span> : '—'}
              </TableCell>
              <TableCell className={`text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5 ${avg !== null && avg >= 10 ? 'text-success' : ''}`}>{avg !== null && avg >= 10 ? mod.coeff : ''}</TableCell>
              <TableCell className={`text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5 ${avg !== null && avg >= 10 ? 'text-success' : ''}`}>{avg !== null && avg >= 10 ? awardedCredit : ''}</TableCell>
            </TableRow>
          );
        })}
        {/* UE Summary */}
        <TableRow className={`${unitComplete && unitRes && unitRes.average !== null ? (unitRes.average >= 10 ? 'bg-success/15' : 'bg-destructive/15') : 'bg-muted/30'}`}>
          <TableCell colSpan={2} className="px-1.5 md:px-3 lg:px-4 whitespace-nowrap">
            <div className="flex items-baseline justify-between gap-2 overflow-hidden">
              <strong className="truncate max-w-[60%] text-xs md:text-sm">{ue.type}</strong>
              <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">(coef: {ue.coeff}, crédit: {ue.credit})</span>
            </div>
          </TableCell>
          <TableCell className="tabular-nums text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">
            {unitComplete && unitRes?.average !== null && (activeCategory !== "engineering" || unitRes.average >= 10) ? (
              <span className="font-semibold">{unitRes.average.toFixed(2)}</span>
            ) : '—'}
          </TableCell>
          <TableCell className="text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">{unitComplete && unitRes && unitRes.average !== null && unitRes.average >= 10 ? ue.coeff : ''}</TableCell>
          <TableCell className="text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">{unitComplete && unitRes && unitRes.average !== null && unitRes.average >= 10 ? (unitRes.creditsAwarded ?? 0) : ''}</TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Calculations</h1>
        
      </header>

      {/* Tabs for academic program selection */}
      <TooltipProvider>
        <Tabs value={activeCategory} onValueChange={(v) => {
          const next = v as "licence" | "master" | "engineering";
          let nextProgram: ProgramKey | undefined = undefined;
          // If navigating back to the previous category, restore its last viewed program; otherwise hide tables by default
          if (prevCategory === next) {
            if (next === "licence") nextProgram = lastLicenceProgram;
            else if (next === "master") nextProgram = lastMasterProgram;
          }
          setPrevCategory(activeCategory);
          setActiveCategory(next);
          setProgram(nextProgram);
        }}>
          <TabsList className="grid grid-cols-3 gap-2 w-full h-12 items-stretch">
            <TabsTrigger value="licence" className="w-full h-full flex items-center justify-center text-center text-sm md:text-base leading-none px-0 data-[state=active]:shadow-md">Licence</TabsTrigger>
            <TabsTrigger value="master" className="w-full h-full flex items-center justify-center text-center text-sm md:text-base leading-none px-0 data-[state=active]:shadow-md">Master</TabsTrigger>
            <TabsTrigger value="engineering" className="w-full h-full flex items-center justify-center text-center text-sm md:text-base leading-none px-0 data-[state=active]:shadow-md">Ingénieurs</TabsTrigger>
          </TabsList>

          {/* Licence programs quick-select */}


          {/* Engineering info above dropdown */}
        </Tabs>
      </TooltipProvider>

      {/* Program selector (above tables as requested) */}
      <section className="space-y-4">
        {activeCategory === "licence" && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-center">Select Licence Level</div>
            <ScrollableRibbon
              options={LICENCE_PROGRAMS.map(opt => ({ value: opt.key, label: opt.label }))}
              value={program}
              onValueChange={(v) => handleSelectProgram(v as ProgramKey)}
              placeholder="Choose between L1, L2, L3ISIL, L3SI"
            />
          </div>
        )}

        {activeCategory === "master" && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-center">Select Master Level</div>
            <ScrollableRibbon
              options={MASTER_PROGRAMS.map(opt => ({ value: opt.key, label: opt.label }))}
              value={program}
              onValueChange={(v) => handleSelectProgram(v as ProgramKey)}
              placeholder="Choose your specialty between M1 and M2"
            />
          </div>
        )}

        {activeCategory === "engineering" && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-center">Select Engineering Specialty</div>
            <ScrollableRibbon
              options={[
                { value: "ing1", label: "ING1" },
                { value: "ing2", label: "ING2" },
                { value: "GL1", label: "GL1" },
                { value: "GL2", label: "GL2" },
                { value: "GL3", label: "GL3" },
                { value: "IA1", label: "IA1" },
                { value: "IA2", label: "IA2" },
                { value: "IA3", label: "IA3" },
                { value: "RI1", label: "RI1" },
                { value: "RI2", label: "RI2" },
                { value: "RI3", label: "RI3" },
                { value: "SI1", label: "SI1" },
                { value: "SI2", label: "SI2" },
                { value: "SI3", label: "SI3" },
                { value: "SEC1", label: "SEC1" },
                { value: "SEC2", label: "SEC2" },
                { value: "SEC3", label: "SEC3" },
                { value: "SDD1", label: "SDD1" },
                { value: "SDD2", label: "SDD2" },
                { value: "SDD3", label: "SDD3" }
              ]}
              value={selectedEngineering}
              onValueChange={(v) => {
                setSelectedEngineering(v);
                setEngineeringNotes({});
              }}
              placeholder="Select your engineering specialty"
            />
          </div>
        )}
      </section>


      {/* Tables */}
      <section className="space-y-6">
        {!dataForProgram ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground text-center">
            {activeCategory === "engineering" ? "Start your calculations" : "Start your calculations"}
          </div>
        ) : (
          [1, 2].map((sem) => (
            <article key={sem} className="space-y-3 animate-fade-in">
              <h2 className="text-lg font-semibold">Semester {displaySemesterNumber(program, sem)}</h2>
              <div className="border rounded-none md:rounded-lg text-[11px] md:text-sm -mx-4 md:mx-0">
                <Table className="w-full border-collapse md:table-fixed">
                    <colgroup>
                      <col className="md:w-[38%]" />
                      <col className="md:w-[32%]" />
                      <col className="md:w-[8%]" />
                      <col className="md:w-[6%]" />
                      <col className="md:w-[6%]" />
                    </colgroup>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-1.5 md:px-3 lg:px-4">Module</TableHead>
                      <TableHead className="px-1.5 md:px-3 lg:px-4">Notes</TableHead>
                      <TableHead className="text-center px-1.5 md:px-3 lg:px-4 whitespace-nowrap"><span className="md:hidden">Avg</span><span className="hidden md:inline">Average</span></TableHead>
                      <TableHead className="text-center px-1.5 md:px-3 lg:px-4 whitespace-nowrap"><span className="md:hidden">Coef</span><span className="hidden md:inline">Coefficient</span></TableHead>
                      <TableHead className="text-center px-1.5 md:px-3 lg:px-4 whitespace-nowrap"><span className="md:hidden">Cred</span><span className="hidden md:inline">Credits</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(dataForProgram?.[sem] ?? []).map((ue) => renderUE(ue, sem))}
                    {/* Semester summary */}
                    <TableRow className={`${isSemesterComplete(sem) && getSemesterResult(sem).average !== null ? (getSemesterResult(sem).average! >= 10 ? 'bg-success/15' : 'bg-destructive/15') : 'bg-muted/50'}`}>
                      <TableCell colSpan={2}>Semester Average</TableCell>
                      <TableCell className="tabular-nums text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">{isSemesterComplete(sem) && getSemesterResult(sem).average !== null ? <span className="font-semibold">{getSemesterResult(sem).average.toFixed(2)}</span> : '—'}</TableCell>
                      <TableCell className="text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">-</TableCell>
                      <TableCell className="text-center px-1.5 md:px-3 lg:px-4 py-1.5 md:py-2.5">{isSemesterComplete(sem) ? getSemesterResult(sem).totalCreditsAwarded : ''}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Annual summary */}
      {dataForProgram && (
        <>
          <aside className={`rounded-lg border p-3 md:p-4 flex items-center justify-between gap-3 md:gap-6 flex-wrap ${isAnnualComplete() && annualResult.annualAverage !== null ? (annualResult.annualAverage >= 10 ? 'bg-success/15' : 'bg-destructive/15') : ''}`}>
            <div className="font-medium">Annual General Average</div>
            <div className="tabular-nums text-lg px-2 py-1 rounded-md">{isAnnualComplete() && annualResult.annualAverage !== null ? <span className="font-semibold">{annualResult.annualAverage.toFixed(2)}</span> : '—'}</div>
            <div className="text-sm text-muted-foreground">Total credits: {isAnnualComplete() ? annualResult.totalCreditsAwarded : '—'}</div>
          </aside>

          {isAnnualComplete() && annualResult.annualAverage !== null && annualResult.annualAverage < 10 && (
            <AIAssistant 
              level={level}
              program={activeCategory === "engineering" ? "ENG" as ProgramKey : program}
              sem1={sem1Result} 
              sem2={sem2Result} 
              sem1Units={sem1Units}
              sem2Units={sem2Units}
              sem1Inputs={sem1Inputs}
              sem2Inputs={sem2Inputs}
              moduleNameMap={moduleNameMap}
              isEngineering={activeCategory === "engineering"}
               engineeringYear={activeCategory === "engineering" ? (
                 selectedEngineering?.includes('3') ? "ING5" : selectedEngineering?.includes('2') ? "ING4" : selectedEngineering?.includes('1') ? "ING3" : selectedEngineering?.startsWith('ing') ? "ING1_2" : undefined
              ) : undefined}
            />
          )}

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={handleResetAll} className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" /> Reanalyze All
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
