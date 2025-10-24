import { Outlet, createFileRoute } from '@tanstack/react-router'
// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/species')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/speciess"!</div>
// }


export const Route = createFileRoute('/species')({
  component: SpeciesLayout,
})

function SpeciesLayout() {
  return (
    <div>
      <h1>Species</h1>
      {/* child routes render here */}
      <Outlet />
    </div>
  )
}