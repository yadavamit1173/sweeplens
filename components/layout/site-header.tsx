import Link from 'next/link'

const navItems = [
  { href: '/workspace', label: 'Workspace' },
  { href: '/docs', label: 'Docs' },
]

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-300/10 text-sm font-bold text-teal-200">
          SL
        </span>
        <span className="text-lg font-semibold tracking-tight">SweepLens</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm text-slate-300">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="transition hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
