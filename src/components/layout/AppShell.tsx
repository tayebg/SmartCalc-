import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode, useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import { useLocation } from "react-router-dom";

export default function AppShell({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeoutId);
  }, []);
  const { pathname } = useLocation();
  const showFooter = pathname === "/" || pathname === "/pfe" || pathname === "/doctorat" || pathname.startsWith("/tutorials");

  if (loading) return <SplashScreen />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Add top padding to account for the fixed header height */}
      <div className="flex-1 pt-16 motion-safe:animate-drop-in">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
