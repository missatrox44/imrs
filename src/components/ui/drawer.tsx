import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@/lib/utils'

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
    direction="right"
  />
)
Drawer.displayName = 'Drawer'

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

function DrawerOverlay({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & {
  ref?: React.Ref<React.ElementRef<typeof DrawerPrimitive.Overlay>>
}) {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  ref?: React.Ref<React.ElementRef<typeof DrawerPrimitive.Content>>
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />

      <DrawerPrimitive.Content
        ref={ref}
        {...props}
        className={cn(
          `
        fixed top-0 right-0 bottom-0 left-auto
        z-50
        w-full
        h-full

        bg-card text-card-foreground
        border-l border-border
        shadow-card

        data-[state=open]:animate-in
        data-[state=open]:slide-in-from-right
        data-[state=closed]:animate-out
        data-[state=closed]:slide-out-to-right
        transition-transform

        flex flex-col
        p-6
        `,
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img src="/toad.png" alt="IMRS Logo" className="h-8" />
            <span className="font-semibold text-foreground text-sm md:text-lg">
              IMRS Biodiversity Explorer
            </span>
          </div>
          <DrawerClose asChild>
            <button
              className="
              p-2 text-foreground
              hover:bg-muted transition-colors
            "
              aria-label="Close menu"
            >
              x
            </button>
          </DrawerClose>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
        grid gap-1.5 px-4 pb-4
        border-b border-border
      `,
      className,
    )}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
        mt-auto flex flex-col gap-2 px-4 pt-4
        border-t border-border
      `,
      className,
    )}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

function DrawerTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & {
  ref?: React.Ref<React.ElementRef<typeof DrawerPrimitive.Title>>
}) {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        'text-lg font-semibold tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & {
  ref?: React.Ref<React.ElementRef<typeof DrawerPrimitive.Description>>
}) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
