import type { ReactNode } from 'react'

export function WorkspaceShell({
  chart,
  settings,
  explanation,
}: Readonly<{
  chart: ReactNode
  settings: ReactNode
  explanation: ReactNode
}>) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-6 lg:grid-cols-[280px_1fr_320px]">
      <aside className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-4 shadow-2xl shadow-black/20">
        {settings}
      </aside>
      <section className="min-h-[620px] rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4 shadow-2xl shadow-black/20">
        {chart}
      </section>
      <aside className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-4 shadow-2xl shadow-black/20">
        {explanation}
      </aside>
    </main>
  )
}
