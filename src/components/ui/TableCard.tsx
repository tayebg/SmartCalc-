import React from "react";

export interface ModuleRow {
  name: string;
  code: string;
  coeff: number | string;
  credits: number | string;
  td?: number | string | null;
  tp?: number | string | null;
  exam?: number | string | null;
  moyenne?: number | string | null;
  creditObt?: number | string | null;
}

export const TableCard: React.FC<{ row: ModuleRow }> = ({ row }) => {
  return (
    <div className="rounded-lg border p-4 space-y-2 card-hover motion-safe:animate-drop-in">
      <div className="flex justify-between">
        <p className="font-medium">{row.name}</p>
        <span className="text-xs text-muted-foreground">{row.code}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Coeff</span><span>{row.coeff}</span>
        <span className="text-muted-foreground">Credits</span><span>{row.credits}</span>
        <span className="text-muted-foreground">Note TD</span><span>{row.td ?? "-"}</span>
        <span className="text-muted-foreground">Note TP</span><span>{row.tp ?? "-"}</span>
        <span className="text-muted-foreground">Note Exam</span><span>{row.exam ?? "-"}</span>
        <span className="text-muted-foreground">Moyenne</span><span>{row.moyenne ?? "-"}</span>
        <span className="text-muted-foreground">Crédit obtenu</span><span>{row.creditObt ?? "-"}</span>
      </div>
    </div>
  );
};
