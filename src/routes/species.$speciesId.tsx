import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/species/$speciesId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { speciesId } = useParams({ strict: false })
  return <div>Hello `/species/${speciesId}`!</div>
}
