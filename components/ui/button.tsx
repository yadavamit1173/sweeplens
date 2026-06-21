import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const variants = {
  primary: 'border-teal-300/40 bg-teal-300 text-slate-950 hover:bg-teal-200',
  secondary: 'border-slate-600/80 bg-slate-900/70 text-slate-100 hover:bg-slate-800',
} as const

type Variant = keyof typeof variants

type BaseProps = {
  children: ReactNode
  variant?: Variant
  className?: string
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

const baseClass =
  'inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-300/60 focus:ring-offset-2 focus:ring-offset-slate-950'

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({ children, variant = 'primary', className = '', href, ...props }: ButtonLinkProps) {
  return (
    <Link className={`${baseClass} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </Link>
  )
}
