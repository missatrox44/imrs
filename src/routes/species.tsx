// 🌵 DOUBLE CHECK
// import { Outlet, createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/species')({
//   component: SpeciesLayout,
// })

// function SpeciesLayout() {
//   return (
//     <>
//       {/* child routes render here */}
//       <Outlet />
//     </>
//   )
// }


import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight, Search } from 'lucide-react'
import { getTurso } from '@/server/turso'
import { ensureSchema } from '@/server/bootstrap'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Category = 'plants' | 'reptiles' | 'mammals' | 'birds' | 'lichens'
type Row = {
  id: number
  category: string | null
  family: string | null
  common_name: string | null
  notes: string | null
  scientific_name: string
}

function normalizeCategory(x: string | null): Category {
  const c = (x ?? '').toLowerCase()
  if (c.startsWith('plant')) return 'plants'
  if (c.startsWith('reptile')) return 'reptiles'
  if (c.startsWith('mamm')) return 'mammals'
  if (c.startsWith('bird')) return 'birds'
  if (c.startsWith('lichen')) return 'lichens'
  return 'plants'
}

export const Route = createFileRoute('/species')({
validateSearch: (s): { q: string; category: Category } => {
  const q = typeof s.q === 'string' ? s.q : ''
  const category = typeof s.category === 'string' ? (s.category as Category) : 'plants'
  return { q, category }
},

  // SERVER: fetch from Turso in the loader
  loader: async ({ search }) => {
    const db = getTurso()
    await ensureSchema()

    const like = `%${(search.q ?? '').toLowerCase()}%`
    const rows: Row[] = search.q
      ? (await db.execute({
          sql: `
            SELECT
              id,
              category,
              family,
              common_name,
              note AS notes,
              TRIM(COALESCE(genus,'') || ' ' || COALESCE(species,'')) AS scientific_name
            FROM specimens
            WHERE
              LOWER(TRIM(COALESCE(genus,'') || ' ' || COALESCE(species,''))) LIKE ?
              OR LOWER(COALESCE(common_name,'')) LIKE ?
              OR LOWER(COALESCE(family,'')) LIKE ?
              OR LOWER(COALESCE(note,'')) LIKE ?
            ORDER BY scientific_name
          `,
          args: [like, like, like, like],
        })).rows as any
      : (await db.execute({
          sql: `
            SELECT
              id,
              category,
              family,
              common_name,
              note AS notes,
              TRIM(COALESCE(genus,'') || ' ' || COALESCE(species,'')) AS scientific_name
            FROM specimens
            WHERE LOWER(COALESCE(category,'')) LIKE ?
            ORDER BY scientific_name
          `,
          args: [search.category],
        })).rows as any

    const items = rows.map((r) => ({
      id: Number(r.id),
      scientific_name: String(r.scientific_name),
      common_name: r.common_name ? String(r.common_name) : null,
      family: r.family ? String(r.family) : null,
      notes: r.notes ? String(r.notes) : null,
      category: normalizeCategory(r.category ? String(r.category) : null),
    }))

    const countsRes = await db.execute(`
      SELECT LOWER(category) as c, COUNT(*) as n
      FROM specimen
      GROUP BY LOWER(category)
    `)
    const counts = { plants: 0, reptiles: 0, mammals: 0, birds: 0, lichens: 0 } as Record<Category, number>
    for (const row of countsRes.rows as any[]) {
      counts[normalizeCategory(row.c as string)] += Number(row.n)
    }

    return { items, counts }
  },

  component: SpeciesIndex,
})

function SpeciesIndex() {
  const { q, category } = Route.useSearch()
  const { items, counts } = Route.useLoaderData()
  const navigate = useNavigate()

  const categories: Array<Category> = ['plants', 'reptiles', 'mammals', 'birds', 'lichens']
  const setCategory = (c: Category) => navigate({ search: (s) => ({ ...s, category: c, q: '' }) })
  const setQuery = (val: string) => navigate({ search: (s) => ({ ...s, q: val }) })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Species Index</h1>
        <p className="text-muted-foreground mb-6">
          Comprehensive database of species documented at the Indio Mountains Research Station
        </p>

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search across all species..."
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
          <TabsList className="w-full sm:w-auto flex flex-wrap gap-2">
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)} ({counts[c] ?? 0})
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 mb-4 text-sm text-muted-foreground">
            {q ? `Showing ${items.length} matching results` : `Showing ${items.length} ${category}`}
          </div>

          <TabsContent value={category}>
            {items.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    {q ? `No species found matching "${q}"` : `No ${category} data available.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((s) => (
                  <Link key={s.id} to="/species/$speciesId" params={{ speciesId: String(s.id) }}>
                    <Card className="gradient-card shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                              <h3 className="scientific-name text-lg font-medium">{s.scientific_name}</h3>
                              <span className="text-foreground font-semibold">{s.common_name}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              {s.family && <Badge variant="secondary">{s.family}</Badge>}
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2">{s.notes}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}