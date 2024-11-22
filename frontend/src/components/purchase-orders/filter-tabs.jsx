// "use client"

// import { Button } from "@/components/ui/button"
// import { ChevronDown } from "lucide-react"

// export function FilterTabs({ activeFilter, onFilterChange }) {
//   const filters = [
//     { label: 'All', value: 'all' },
//     { label: 'Processed', value: 'processed' },
//     { label: 'Review', value: 'review' },
//     { label: 'Processing', value: 'processing' },
//     { label: 'Finalized', value: 'finalized' }
//   ]

//   return (
//     <div className="flex gap-2">
//       {filters.map((filter) => (
//         <Button
//           key={filter.value}
//           variant={activeFilter === filter.value ? "secondary" : "outline"}
//           onClick={() => onFilterChange(filter.value)}
//           className="gap-1"
//         >
//           {filter.label}
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       ))}
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function FilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Processed', value: 'processed' },
    { label: 'Review', value: 'review' },
    { label: 'Processing', value: 'processing' },
    { label: 'Finalized', value: 'finalized' }
  ]

  const getButtonClass = (value) => {
    if (activeFilter !== value) return "gap-1"
    
    switch (value) {
      case 'processed':
        return "gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100"
      case 'review':
        return "gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case 'processing':
        return "gap-1 bg-purple-100 text-purple-800 hover:bg-purple-100"
      case 'finalized':
        return "gap-1 bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "gap-1"
    }
  }

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "secondary" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className={getButtonClass(filter.value)}
        >
          {filter.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}