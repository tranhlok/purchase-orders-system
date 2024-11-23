"use client"

import { SearchBar } from "@/components/purchase-orders/search-bar"
import { FilterTabs } from "@/components/purchase-orders/filter-tabs"
import { NewOrderSheet } from "@/components/purchase-orders/new-order-sheet"

export function Header() {
  return (
    <div className="border-b">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <NewOrderSheet />
      </div>
      <div className="p-4 space-y-4">
        <SearchBar />
        <FilterTabs />
      </div>
    </div>
  )
}