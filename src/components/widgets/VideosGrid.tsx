import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { videoCategories, VideoCategory } from "@/constants/videoCategories";

export default function VideosGrid({ searchQuery = "" }: { searchQuery?: string }) {
  const navigate = useNavigate();
  const normalized = searchQuery.trim().toLowerCase();
  const levels = ["All","L1","L2","L3","M1","M2","Ingénieurs","Other Links","Profiles"] as const;
  const [selectedLevel, setSelectedLevel] = useState<typeof levels[number]>("All");
  const idMap: Record<string, string> = { "L1":"l1","L2":"l2","L3":"l3","M1":"m1","M2":"m2","Ingénieurs":"ingenieurs","Other Links":"autres","Profiles":"profile" };

  const filtered = useMemo(() => {
    const source = selectedLevel === "All" ? videoCategories : videoCategories.filter((c) => c.id === idMap[selectedLevel]);
    if (!normalized) return source;
    return source
      .map((cat) => {
        const matchesCat = cat.name.toLowerCase().includes(normalized);
        const filteredItems = cat.items.filter((it) => it.title.toLowerCase().includes(normalized));
        if (matchesCat) return { ...cat };
        if (filteredItems.length > 0) return { ...cat, items: filteredItems };
        return null;
      })
      .filter(Boolean) as VideoCategory[];
  }, [normalized, selectedLevel]);


  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l}
            className="px-3 py-1 rounded-full border text-sm hover:bg-muted transition-smooth"
            aria-pressed={selectedLevel === l}
            onClick={() => setSelectedLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not Found</p>
        ) : (
          filtered.map((cat) => {
            const hasItems = cat.items.length > 0;
            return (
              <article key={cat.id} className="rounded-lg overflow-hidden border card-hover">
                <div className="aspect-video bg-muted" aria-label={cat.name} />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <div className="flex justify-end items-center pt-2">
                      <Button disabled={!hasItems || cat.id === 'ingenieurs'} onClick={() => hasItems && cat.id !== 'ingenieurs' && navigate(`/videos/${cat.id}`)}>
                        View more
                      </Button>
                    </div>
                  </div>
              </article>
            );
          })
        )}
      </div>

    </section>
  );
}
