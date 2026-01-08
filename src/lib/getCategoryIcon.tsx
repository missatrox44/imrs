import { Bird, Bug, Cat, Fish, Leaf, Turtle } from "lucide-react";
import { GiSuperMushroom } from "react-icons/gi";
import { LiaFrogSolid } from "react-icons/lia";
import { LuWorm } from "react-icons/lu";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'plants':
      return <Leaf className="w-4 h-4" />;
    case 'birds':
      return <Bird className="w-4 h-4" />;
    case 'mammals':
      return <Cat className="w-4 h-4" />;
    case 'reptiles':
      return <Turtle className="w-4 h-4" />;
    case 'amphibians':
      return <LiaFrogSolid className="w-4 h-4" />;
    case 'arthropods':
      return <Bug className="w-4 h-4" />;
    case 'fungi':
      return <GiSuperMushroom className="w-4 h-4" />;
    case 'inverts':
      return <LuWorm className="w-4 h-4" />
    case 'fish':
      return <Fish className="w-4 h-4" />
    default:
      return null;
  }
};