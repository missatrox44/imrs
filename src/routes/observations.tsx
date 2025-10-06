import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/observations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/observations"!</div>
}
