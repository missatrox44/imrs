import { Bug, ExternalLink, Github } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { externalLinks, navItems } from '@/data/constants'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-2">
              <img src="/toad.png" alt="IMRS Logo" className="h-8 md:h-10" />
              <span className="font-semibold text-foreground text-sm md:text-lg">
                IMRS Biodiversity Explorer
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A digital resource for exploring the biodiversity of Indio
              Mountains Research Station.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              External Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {externalLinks.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label} <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/missatrox44/imrs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <Bug className="w-3 h-3" /> Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} IMRS Biodiversity Explorer</span>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/missatrox44/imrs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              GitHub <Github className="w-3 h-3" />
            </a>

            <a
              href="https://sarabaqla.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              sarabaqla.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
