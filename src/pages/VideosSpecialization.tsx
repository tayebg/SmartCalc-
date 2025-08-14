import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { videoCategories } from "@/constants/videoCategories";
import { ArrowLeft } from "lucide-react";
import { PlaylistCarousel } from "@/components/widgets/PlaylistCarousel";
import { ChannelCarousel } from "@/components/widgets/ChannelCarousel";
import { LinksCarousel } from "@/components/widgets/LinksCarousel";

export default function VideosSpecialization() {
  const { specializationId } = useParams();
  const navigate = useNavigate();
  const category = videoCategories.find((c) => c.id === specializationId);

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Videos — {specializationId}</h1>
        <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">Not Found</p>
      </main>
    );
  }

  const description =
    category.type === "links" ? "Useful links" : category.type === "profile" ? "YouTube profiles" : "Videos and playlists";

  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Videos — {category.name}</h1>
      <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-2">
        {["All","L1","L2","L3","M1","M2","Other Links","Profiles"].map((l) => (
          <button
            key={l}
            className="px-3 py-1 rounded-full border text-sm hover:bg-muted transition-smooth"
            aria-pressed={l === "All" ? false : category.id === ({ "L1":"l1","L2":"l2","L3":"l3","M1":"m1","M2":"m2","Other Links":"autres","Profiles":"profile" } as Record<string,string>)[l]}
            onClick={() => l === "All" ? navigate("/videos") : navigate(`/videos/${({ "L1":"l1","L2":"l2","L3":"l3","M1":"m1","M2":"m2","Other Links":"autres","Profiles":"profile" } as Record<string,string>)[l]}`)}
          >
            {l}
          </button>
        ))}
      </div>

      {category.items.length > 0 ? (
        category.type === "video" ? (
          <PlaylistCarousel playlists={category.items} />
        ) : category.type === "profile" ? (
          <ChannelCarousel channels={category.items} />
        ) : (
          <LinksCarousel links={category.items} />
        )
      ) : (
        <p className="text-sm text-muted-foreground">Not Found</p>
      )}
    </main>
  );
}
