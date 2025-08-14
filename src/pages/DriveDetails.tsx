import { useParams, useNavigate } from "react-router-dom";
import { drives } from "@/constants/drives";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
export default function DriveDetails() {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const drive = drives.find((d) => d.id === driveId);
  const title = drive ? drive.title.replace(/\s*-\s*USTO/i, "").trim() : "Drive";
  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4].map((i) => (
          <article key={i} className="rounded-lg border p-4 space-y-2 card-hover">
            <h3 className="font-semibold">{title} #{i}</h3>
            <p className="text-sm text-muted-foreground">Drive resources and materials.</p>
            <Button disabled>Open Drive</Button>
          </article>
        ))}
      </div>
    </main>
  );
}
