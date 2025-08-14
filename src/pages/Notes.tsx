
import { Icon } from "@/components/ui/Icon";

export default function Notes() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-8">
      <header className="flex items-center gap-3">
        <Icon name="stickynote" size={28} className="text-muted-foreground" />
        <h1 className="text-2xl sm:text-3xl font-bold">Notes — Calculations and LMD Rules</h1>
      </header>

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Unit Average</h2>
          <p className="text-sm text-muted-foreground">How to compute the average of a teaching unit (UE)</p>
          <div className="mt-2 rounded-md border p-4 bg-background/50">
            <div className="font-mono text-sm">UE Average = Σ(Grade × Credits) / Σ(Credits)</div>
          </div>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Each module is weighted by its number of credits</li>
            <li>The unit average must be ≥ 10/20 to be validated</li>
            <li>Compensation is possible between modules within the same unit</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Semester Average</h2>
          <p className="text-sm text-muted-foreground">How to compute the semester general average</p>
          <div className="mt-2 rounded-md border p-4 bg-background/50">
            <div className="font-mono text-sm">Semester Avg = Σ(UE Avg × UE Credits) / Σ(UE Credits)</div>
          </div>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Unit averages are weighted by their credits</li>
            <li>Validation if average ≥ 10/20</li>
            <li>Compensation is possible between units in the same semester</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Credit Rules</h2>
          <p className="text-sm text-muted-foreground">ECTS credit system used in the LMD framework</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>30 credits = 1 semester / 60 credits = 1 year</li>
            <li>L1, L2, L3: 180 credits (3 × 60)</li>
            <li>M1, M2: 120 credits (2 × 60)</li>
            <li>Doctorate: 180 credits (3 × 60)</li>
            <li>Progressive validation by earning credits</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Annual Average</h2>
          <p className="text-sm text-muted-foreground">Average across the entire academic year</p>
          <div className="mt-2 rounded-md border p-4 bg-background/50">
            <div className="font-mono text-sm">Annual Avg = (S1 Avg × S1 Credits + S2 Avg × S2 Credits) / (S1 Credits + S2 Credits)</div>
          </div>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Weighted by the credits of each semester</li>
            <li>Typically 30 credits per semester</li>
            <li>Year validated if average ≥ 10/20</li>
            <li>Possible retake or conditional progression</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">LMD System</h2>
          <p className="text-muted-foreground">The Licence-Master-Doctorate system harmonizes higher education with European standards.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">USTO-MB</h2>
          <p className="text-muted-foreground">University of Science and Technology of Oran Mohamed Boudiaf — Computer Science Department.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Validation</h2>
          <p className="text-muted-foreground">A unit/semester/year is validated if the average is ≥ 10/20. Compensation may apply according to the regulations.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">About SmartCalc+</h2>
          <p className="text-muted-foreground">This platform is primarily designed for USTO-MB LMD students (Computer Science Department), but all computer science students can benefit from these calculation tools.</p>
        </section>
      </article>
    </main>
  );
}
