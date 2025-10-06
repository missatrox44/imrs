import { Link } from '@tanstack/react-router'

export default function Header() {

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/observations", label: "Observations" },
    { href: "/species", label: "Species Index" },
  ];

  return (
    <header className="">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">
                IMRS Biodiversity Explorer
              </span>
            </Link>

            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  // variant={location.pathname === item.href ? "default" : "ghost"}
                  // asChild
                  className="text-sm font-medium"
                >
                  <Link to={item.href}>{item.label}</Link>
                </button>
              ))}
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
