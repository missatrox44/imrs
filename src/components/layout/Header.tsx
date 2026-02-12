'use client'

import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { navItems } from '@/data/constants'

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <nav>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* LOGO + TITLE */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/toad.png" alt="IMRS Logo" className="h-8 md:h-10" />
              <span className="font-semibold text-foreground text-sm md:text-lg">
                IMRS Biodiversity Explorer
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center space-x-2">
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

            {/* MOBILE DRAWER */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild className="lg:hidden">
                <button
                  className="
                    p-2 text-foreground 
                    hover:bg-muted transition-colors
                    
                  "
                >
                  <Menu size={22} />
                </button>
              </DrawerTrigger>

              <DrawerContent
                className="
                  bg-card text-foreground 
                  border-t border-border 
                  
                "
              >
                {/* <DrawerHeader className="border-b border-border pb-4">
                  <DrawerTitle className="text-lg font-semibold">
                    Navigation
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground">
                    Explore the archive
                  </DrawerDescription>
                </DrawerHeader> */}

                {/* NAV ITEMS */}
                <div className="flex flex-col p-4 space-y-3">
                  {navItems.map((item) => {
                    const isActive =
                      pathname === item.to ||
                      (item.to !== '/' && pathname.startsWith(item.to))

                    return (
                      <DrawerClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          className={`
                            block w-full px-4 py-3
                            border border-border shadow-card
                            text-lg tracking-wide
                            
                            transition-colors
                            ${isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card hover:bg-muted'
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      </DrawerClose>
                    )
                  })}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </nav>
    </header>
  )
}