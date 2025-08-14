import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppShell from "@/components/layout/AppShell";
import CalculsNiveau from "./pages/CalculsNiveau";
import Drives from "./pages/Drives";
import DriveDetails from "./pages/DriveDetails";
import Videos from "./pages/Videos";
import VideosSpecialization from "./pages/VideosSpecialization";
import Roadmap from "./pages/Roadmap";
import Contact from "./pages/Contact";
import Offline from "./pages/Offline";
import Privacy from "./pages/Privacy";
import Canevas from "./pages/Canevas";
import Tutorials from "./pages/Tutorials";
import Doctorat from "./pages/Doctorat";
import Notes from "./pages/Notes";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculs/:niveau" element={<CalculsNiveau />} />
          <Route path="/drives" element={<Drives />} />
          <Route path="/drives/:driveId" element={<DriveDetails />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:specializationId" element={<VideosSpecialization />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/doctorat" element={<Doctorat />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/canevas" element={<Canevas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </HashRouter>
  </>
);

export default App;
