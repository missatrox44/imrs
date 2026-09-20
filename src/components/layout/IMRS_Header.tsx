import { Link, useRouterState } from '@tanstack/react-router'
import { IMRS_MobileNav } from './IMRS_MobileNav'
import { navItems } from '@/data/constants'

// Figma "IMRS Website Design" node 110:737. Four destinations only; Home is the logo.
export const imrsNavItems = navItems.filter((item) => item.to !== '/')

export function isActivePath(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function IMRS_Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <header className="relative z-10 px-4 pt-4 lg:px-16 lg:pt-8">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[77px] max-w-[1310px] items-center justify-between rounded-[10px] bg-brand-cream pr-4 pl-4 shadow-[0_4px_18px_rgba(0,0,0,0.08)] lg:pr-[57px] lg:pl-[46px]"
      >
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/imrs-logo-text.svg"
            alt="IMRS Biodiversity Explorer, home"
            className="h-[52px] w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-20 font-brand-mono text-base leading-6 tracking-[0.04em] text-brand-ink lg:flex">
          {imrsNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.to)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap transition-colors hover:text-brand-green ${
                    isActive
                      ? 'underline decoration-1 underline-offset-[6px]'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <IMRS_MobileNav pathname={pathname} />
      </nav>
    </header>
  )
}
