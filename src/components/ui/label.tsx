import * as React from 'react'

import { cn } from '@/lib/utils'

function Label({
  className,
  ref,
  ...props
}: React.ComponentProps<'label'> & { ref?: React.Ref<HTMLLabelElement> }) {
  return (
    // Reusable primitive: consumers associate it via the htmlFor prop.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
