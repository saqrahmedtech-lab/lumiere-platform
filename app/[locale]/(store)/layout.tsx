export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white dark:bg-zinc-950">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-lg font-semibold">Lumière</span>
          {/* Nav links */}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Lumière
        </div>
      </footer>
    </>
  )
}
