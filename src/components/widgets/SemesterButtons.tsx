import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (sem: string) => void;
}

export default function SemesterButtons({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { k: "X", label: "Semestre X" },
        { k: "Y", label: "Semestre Y" },
        { k: "XY", label: "Semestre X + Y" },
      ].map((s) => (
        <Button key={s.k} onClick={() => onSelect(s.k)} className="gradient-primary text-primary-foreground ripple ripple-primary">
          {s.label}
        </Button>
      ))}
    </div>
  );
}
