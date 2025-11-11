import { Outlet, createFileRoute } from '@tanstack/react-router'
// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/species')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/speciess"!</div>
// }
import SpeciesIndex from '@/components/SpeciesIndex'


export const Route = createFileRoute('/species')({
  component: SpeciesLayout,
})

function SpeciesLayout() {
  return (
    <>
      <SpeciesIndex/>
      {/* child routes render here */}
      {/* <Outlet /> */}
    </>
  )
}