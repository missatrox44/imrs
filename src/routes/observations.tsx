import { createFileRoute } from '@tanstack/react-router'
import Observations from '@/components/Observations'

export const Route = createFileRoute('/observations')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Observations />
    </>)
}
