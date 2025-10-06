import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/species')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/speciess"!</div>
}
