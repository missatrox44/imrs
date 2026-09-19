import { Link } from '@tanstack/react-router'
import { imrsNavItems } from './IMRS_Header'
import type { ReactNode } from 'react'
import { externalLinks } from '@/data/constants'

// Figma "IMRS Website Design" node 110:1229 (desktop only).
// footer-texture.webp is the Figma fill (11.8 MB JPEG) downscaled to 1440px wide.
const socialLinks = [
  {
    href: 'https://www.instagram.com/indio_mountains_utep/',
    label: 'Instagram',
    icon: '/icons/instagram.svg',
    size: 'size-5',
  },
  {
    href: 'https://www.facebook.com/groups/1167540990406903/',
    label: 'Facebook',
    icon: '/icons/facebook.svg',
    size: 'size-7',
  },
  {
    href: 'https://github.com/missatrox44/imrs',
    label: 'GitHub',
    icon: '/icons/github.svg',
    size: 'size-[21px]',
  },
]

const headingClass =
  'font-brand-mono text-xl leading-[31px] tracking-[0.04em] text-brand-green-light'
const listClass =
  'mt-[7px] flex flex-col gap-1 font-brand-mono text-base leading-6 tracking-[0.04em]'
const linkClass = 'transition-colors hover:text-brand-green-light'

function ExternalAnchor({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  )
}

export function IMRS_Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden rounded-t-[32px] bg-brand-green-dark px-4 pt-12 text-brand-light lg:rounded-t-[64px] lg:px-[66px] lg:pt-[95px]">
      <img
        src="/footer-texture.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.22] mix-blend-multiply"
      />
      <div className="relative mx-auto max-w-[1309px]">
        <div className="lg:grid lg:grid-cols-[1fr_222px_310px]">
          <div>
            <Link to="/" className="flex w-fit">
              <img
                src="/imrs-logo-text-light.svg"
                alt="IMRS Biodiversity Explorer, home"
                className="h-[89px] w-auto"
              />
            </Link>
            <p className="mt-8 max-w-[327px] font-brand-sans text-xl leading-[31px] tracking-[0.04em]">
              A digital resource for exploring the biodiversity of Indio
              Mountains Research Station.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="mt-10 lg:mt-0 lg:pt-[25px]"
          >
            <h2 className={headingClass}>Quick Links</h2>
            <ul className={listClass}>
              {imrsNavItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 lg:mt-0 lg:pt-[25px]">
            <h2 className={headingClass}>External Resources</h2>
            <ul className={listClass}>
              {externalLinks.map((link) => (
                <li key={link.to}>
                  <ExternalAnchor href={link.to} className={linkClass}>
                    {link.label}
                  </ExternalAnchor>
                </li>
              ))}
            </ul>

            <h2 className={`${headingClass} mt-[39px]`}>Support</h2>
            <ul className={listClass}>
              <li>
                <ExternalAnchor
                  href="https://github.com/missatrox44/imrs/issues"
                  className={linkClass}
                >
                  Report an Issue
                </ExternalAnchor>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brand-green-light pt-6 pb-8 font-brand-mono text-base leading-6 tracking-[0.04em] sm:flex-row sm:items-center sm:justify-between lg:mt-[70px] lg:pb-[47px]">
          <span>© {year} IMRS Biodiversity Explorer</span>

          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <ExternalAnchor
                    href={s.href}
                    className={`block ${s.size} transition-opacity hover:opacity-80`}
                  >
                    <img src={s.icon} alt="" className="size-full" />
                    <span className="sr-only">{s.label}</span>
                  </ExternalAnchor>
                </li>
              ))}
            </ul>
            <ExternalAnchor href="https://sarabaqla.dev" className={linkClass}>
              sarabaqla.dev
            </ExternalAnchor>
          </div>
        </div>
      </div>
    </footer>
  )
}
