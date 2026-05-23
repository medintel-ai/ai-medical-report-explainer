export function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            MedIntel AI
          </h1>
        </div>

        <nav className="hidden gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#architecture"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Architecture
          </a>

          <a
            href="#roadmap"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Roadmap
          </a>
        </nav>

        <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90">
          Dashboard
        </button>
      </div>
    </header>
  );
}