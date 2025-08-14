export default function Offline() {
  return (
    <main className="container mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">You are offline</h1>
      <p className="text-muted-foreground">Some features are unavailable. Please check your connection.</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-md border hover:bg-muted transition-smooth">Retry</button>
    </main>
  );
}
