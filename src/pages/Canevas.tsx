import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CANEVAS_CATEGORIES = {
  Licence: [
    { id: "L3ISIL", label: "L3 ISIL Canevas", file: "canevasL3ISIL.pdf" },
    { id: "L3SI", label: "L3 SI Canevas", file: "canevasL3SI.pdf" },
  ],
  Master: [
    { id: "M1IA", label: "M IA Canevas", file: "canevasM1IA.pdf" },
    { id: "M1SID", label: "M SID Canevas", file: "canevasM1SID.pdf" },
    { id: "MRSID", label: "M RSID Canevas", file: "canevasMRSID.pdf" },
  ],
  Ingénieurs: [
    { id: "ING1_2", label: "ING1_2 Canevas", file: "ing1_2_canevas.pdf" },
    { id: "SI", label: "Système d'information Canevas", file: "systeme_information_canevas.pdf" },
    { id: "SEC", label: "Sécurité Informatique Canevas", file: "securite_informatique_canevas.pdf" },
    { id: "SDD", label: "Science de données Canevas", file: "science_donnees_canevas.pdf" },
    { id: "RI", label: "Réseau Informatiques Canevas", file: "reseau_informatiques_canevas.pdf" },
    { id: "IA", label: "Intelligence Artificielle Canevas", file: "intelligence_artificielle_canevas.pdf" },
    { id: "GL", label: "Génie Logiciel Canevas", file: "genie_logiciel_canevas.pdf" },
  ],
};

export default function Canevas() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CANEVAS_CATEGORIES>("Licence");

  useEffect(() => {
    document.title = "Canevas | SmartCalc+";

    const descContent = "Open syllabi templates (placeholders). L3 ISIL, L3 SI, M1 IA, M1 SID, MR SID.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", descContent);

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Canevas</h1>
        <p className="text-sm text-muted-foreground">Browse available syllabi and open them.</p>
      </header>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(CANEVAS_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as keyof typeof CANEVAS_CATEGORIES)}
              className={`px-4 py-2 rounded-full border text-sm transition-smooth ${
                selectedCategory === category ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANEVAS_CATEGORIES[selectedCategory].map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">{c.label}</CardTitle>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button asChild variant="default" aria-label={`View ${c.label}`}>
                  <a href={`/canevas/${c.file}`} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

    </main>
  );
}
