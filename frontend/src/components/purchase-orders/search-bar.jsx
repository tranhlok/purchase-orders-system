"use client"

import { Search, Copy, Download, Maximize2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOrderFilters } from "@/hooks/useOrderFilters"
import { useDebounce } from "@/hooks/useDebounce"
import { useEffect, useState } from "react"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useOrderFilters();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Purchase Orders"
          className="pl-9"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  )
}