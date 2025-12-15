import { createFileRoute } from '@tanstack/react-router'
import Gazetteer from '@/components/Gazetteer'

export const Route = createFileRoute('/gazetteer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Gazetteer />
    </>)
}
