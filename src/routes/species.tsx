import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/species')({
  component: SpeciesLayout,
})

function SpeciesLayout() {
  return (
    <>
      {/* child routes render here */}
      <Outlet />
    </>
  )
}