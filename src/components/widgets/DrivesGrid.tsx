import { drives, Drive } from "@/constants/drives";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

export default function DrivesGrid({ searchQuery = "" }: { searchQuery?: string }) {
  const levels = ["All", "L1", "L2", "L3 ISIL", "L3 SI", "M1 SID", "M1 IA", "M1 RSID", "M2 SID", "M2 IA", "M2 RSID", "Ingénieurs"];
  const [selected, setSelected] = useState<string>("All");
  

  const filteredDrives = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return drives.filter((d: Drive) => {
      const spec = d.title.replace(/\s*-\s*USTO/i, "").toLowerCase();
      const matchesLevel = selected === "All" ? true : spec.includes(selected.toLowerCase());
      const matchesQuery = !q || spec.includes(q);
      return matchesLevel && matchesQuery;
    });
  }, [selected, searchQuery]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setSelected(l)}
            className={`px-3 py-1 rounded-full border text-sm transition-smooth ${selected === l ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
            aria-pressed={selected === l}
          >
            {l}
          </button>
        ))}
      </div>
      {selected !== "All" && (
        <h3 className="text-lg font-semibold">{selected}</h3>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrives.length === 0 ? (
          <p className="text-sm text-muted-foreground">No drives found.</p>
        ) : (
          filteredDrives.map((d: Drive) => (
            <article key={d.id} className="rounded-lg border p-4 space-y-2 card-hover">
              <h3 className="font-semibold">{d.title}</h3>
              {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
              <div className="flex justify-between items-center pt-2">
                <Link to={`/drives/${d.id}`} className="text-sm no-underline hover:opacity-80">View more</Link>
                <Button
                  disabled={!d.url}
                  onClick={() => {
                    if (!d.url) return;
                    window.open(d.url, "_blank");
                  }}
                >
                  Open Drive
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
