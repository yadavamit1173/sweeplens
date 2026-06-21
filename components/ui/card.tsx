import type { ReactNode } from 'react'

type CardProps = Readonly<{
  children: ReactNode
  className?: string
}>

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-700/60 bg-slate-950/60 p-6 shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </div>
  )
}
