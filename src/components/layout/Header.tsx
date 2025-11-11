// import { Link } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from '../ui/button'

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/observations', label: 'Observations' },
    { to: '/species', label: 'Species Index' },
  ]

  return (
    <header className="">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/utep.webp" alt="IMRS Logo" className="w-6 h-6" />
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">
                IMRS Biodiversity Explorer
              </span>
            </Link>

            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))
                return (
                  <Button
                    key={item.to}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className="text-sm font-medium"
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
      {/* <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/api-request">Start - API Request</Link>
        </div>
      </nav> */}
    </header>
  )
}
