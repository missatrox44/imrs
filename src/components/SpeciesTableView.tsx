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
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Phylum
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Class
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden lg:table-cell">
                  Order
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">
                  Family
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-12.5"></th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {items.map((item: Species) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group cursor-pointer relative"
                >
                  <td className="p-4 align-middle">
                    {item.category && getCategoryIcon(item.category)}
                  </td>
                  <td className="p-4 align-middle font-medium">
                    <Link
                      to="/species/$speciesId"
                      params={{ speciesId: String(item.id) }}
                      className="before:absolute before:inset-0 before:z-10"
                    >
                      <span className="scientific-name relative z-20 group-hover:underline">
                        {item.genus ? `${item.genus} ${item.species}` : '-'}
                      </span>
                    </Link>
                  </td>
                  <td className="p-4 align-middle">
                    {item.species_common_name || '-'}
                  </td>
                  <td className="p-4 align-middle">
                    {item.phylum || '-'}
                  </td>
                  <td className="p-4 align-middle">
                    {item.class_name || '-'}
                  </td>
                  <td className="p-4 align-middle hidden lg:table-cell">
                    {item.order_name || '-'}
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell">
                    {item.family || '-'}
                  </td>
                  <td className="p-4 align-middle">
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary relative z-20" />
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
