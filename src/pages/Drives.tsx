import DrivesGrid from "@/components/widgets/DrivesGrid";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Drives() {
  const [query, setQuery] = useState("");
  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Drives</h1>
      <div className="max-w-xl">
        <Input
          aria-label="Search drives"
          placeholder="Search..."
          className="w-full text-foreground"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <DrivesGrid searchQuery={query} />
    </main>
  );
}
