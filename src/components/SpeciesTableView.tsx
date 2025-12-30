import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { Species } from '@/types/species'
import { getCategoryIcon } from '@/lib/getCategoryIcon'

export const SpeciesTableView = ({ items }: { items: Array<Species> }) => {
  return (
    <>
      <div className=" border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-12.5">
                  Type
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Scientific Name
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Common Name
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">
                  Family
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden lg:table-cell">
                  Order
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-12.5"></th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {items.map((item: Species) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
                >
                  <td className="p-4 align-middle">
                    {item.category && getCategoryIcon(item.category)}
                  </td>
                  <td className="p-4 align-middle font-medium">
                    <Link
                      to="/species/$speciesId"
                      params={{ speciesId: String(item.id) }}
                      className="hover:underline flex items-center gap-2"
                    >
                      <span className="scientific-name">
                        {item.genus} {item.species}
                      </span>
                    </Link>
                  </td>
                  <td className="p-4 align-middle">
                    {item.species_common_name || '-'}
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell">
                    {item.family}
                    {item.family_common_name && (
                      <span className="text-muted-foreground ml-1">
                        ({item.family_common_name})
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle hidden lg:table-cell">
                    {item.order_name}
                  </td>
                  <td className="p-4 align-middle">
                    <Link
                      to="/species/$speciesId"
                      params={{ speciesId: String(item.id) }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
