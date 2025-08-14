import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-sm text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-block px-3 py-2 rounded-md border hover:bg-muted transition-smooth">Return to Home</a>
      </div>
    </main>
  );
};

export default NotFound;
