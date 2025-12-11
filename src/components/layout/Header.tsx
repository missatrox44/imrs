import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/observations', label: 'Observations' },
    { to: '/species', label: 'Species Index' },
  ]

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <nav>
        <div className="container mx-auto px-4">
          {/* TOP ROW */}
          <div className="flex items-center justify-between h-16">
            {/* LOGO + TITLE */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/utep.webp" alt="IMRS Logo" className="w-8 h-8" />
              </div>
              <span className="font-semibold text-foreground text-sm md:text-lg">
                IMRS Biodiversity Explorer
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to !== '/' && pathname.startsWith(item.to))

                return (
                  <Button
                    key={item.to}
                    variant={isActive ? 'default' : 'ghost'}
                    asChild
                    className="text-sm font-medium "
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </Button>
                )
              })}
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-foreground hover:bg-muted transition-colors "
              aria-label="Toggle Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* MOBILE MENU PANEL */}
          {open && (
            <div className="md:hidden border-t border-border py-4 space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to !== '/' && pathname.startsWith(item.to))

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`
                      block w-full px-2 py-2 font-medium text-sm
                      ${isActive ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}
                      border border-border shadow-card hover:bg-muted transition-colors
                      
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}