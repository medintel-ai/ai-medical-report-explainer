import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
            <span className="h-3 w-3 rounded-sm bg-black" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            MedIntel <span className="text-zinc-400">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            { label: "Features", href: "#features" },
            { label: "Architecture", href: "#architecture" },
            { label: "Roadmap", href: "#roadmap" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-100"
        >
          Dashboard
        </Link>

      </div>
    </header>
  );
}
