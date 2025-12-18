// AI TEMPLATE
import { Leaf } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const EmptyState = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="py-12 space-y-4">
          <div className="flex justify-center">
            <Leaf className="w-10 h-10 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            No observations yet
          </h2>

          <p className="text-sm text-muted-foreground">
            We couldn’t find any recent biodiversity observations for this area.
            Check back soon as new data is added.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmptyState