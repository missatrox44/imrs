import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Drawer } from 'vaul'
import { imrsNavItems, isActivePath } from './IMRS_Header'

// No mobile design; this mirrors the desktop card.
export function IMRS_MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="rounded-[10px] p-2 text-brand-ink transition-colors hover:bg-brand-green/10 lg:hidden"
        >
          <Menu size={24} />
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-brand-ink/40 backdrop-blur-sm" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col bg-brand-cream text-brand-ink shadow-[-4px_0_18px_rgba(0,0,0,0.08)]"
        >
          <Drawer.Title className="sr-only">Navigation</Drawer.Title>

          <div className="flex h-[77px] items-center justify-between pr-2 pl-4">
            <img
              src="/imrs-logo-text.svg"
              alt=""
              aria-hidden="true"
              className="h-[52px] w-auto"
            />
            <Drawer.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="rounded-[10px] p-2 transition-colors hover:bg-brand-green/10"
              >
                <X size={24} />
              </button>
            </Drawer.Close>
          </div>

          <ul className="flex flex-col gap-2 p-4 font-brand-mono text-lg leading-6 tracking-[0.04em]">
            {imrsNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.to)
              return (
                <li key={item.to}>
                  <Drawer.Close asChild>
                    <Link
                      to={item.to}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block rounded-[10px] px-4 py-3 transition-colors hover:bg-brand-green/10 ${
                        isActive ? 'bg-brand-green text-brand-cream' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </Drawer.Close>
                </li>
              )
            })}
          </ul>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
