import Link from 'next/link'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Card } from '@/components/ui/card'

const docsLinks = [
  {
    href: '/docs/implementation-plans/liquidity-sweep-detector-mvp.md',
    title: 'Master implementation plan',
    description: 'Complete MVP planning, scope, architecture, detection logic, testing, and launch guidance.',
  },
  {
    href: '/docs/product/rules-specification.md',
    title: 'Rules specification',
    description: 'Implementation-ready definitions for sweeps, reclaims, confirmations, and confidence states.',
  },
  {
    href: '/docs/architecture/end-to-end-architecture.md',
    title: 'End-to-end architecture',
    description: 'Deep architecture reference for the web app, domain core, data layer, UI, and future phases.',
  },
  {
    href: '/docs/execution/jira-tickets-detailed.md',
    title: 'Detailed Jira tickets',
    description: 'Epic/story/task-level delivery plan with acceptance criteria, dependencies, and estimates.',
  },
]

export default function DocsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">Project docs</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          SweepLens documentation and implementation direction.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          This page is a product-facing placeholder. The detailed markdown docs live in the repository under <code className="rounded bg-slate-900 px-2 py-1 text-teal-100">docs/</code> and guide future Kaino sessions.
        </p>
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {docsLinks.map((doc) => (
            <Card key={doc.href}>
              <h2 className="text-xl font-semibold text-white">{doc.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{doc.description}</p>
              <Link href={doc.href} className="mt-5 inline-flex text-sm font-semibold text-teal-200 hover:text-teal-100">
                Repo path: {doc.href.replace('/docs/', 'docs/')}
              </Link>
            </Card>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
