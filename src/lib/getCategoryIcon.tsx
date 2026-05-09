import { Bird, Bug, Cat, Fish, Leaf, Turtle } from 'lucide-react'
import { GiSuperMushroom } from 'react-icons/gi'
import { LiaFrogSolid } from 'react-icons/lia'
import { LuWorm } from 'react-icons/lu'

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'plants':
      return <Leaf className="size-4" />
    case 'birds':
      return <Bird className="size-4" />
    case 'mammals':
      return <Cat className="size-4" />
    case 'reptiles':
      return <Turtle className="size-4" />
    case 'amphibians':
      return <LiaFrogSolid className="size-4" />
    case 'arthropods':
      return <Bug className="size-4" />
    case 'fungi':
      return <GiSuperMushroom className="size-4" />
    case 'inverts':
      return <LuWorm className="size-4" />
    case 'fish':
      return <Fish className="size-4" />
    default:
      return null
  }
}
