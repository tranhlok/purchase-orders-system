"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { PurchaseOrdersTable } from "@/components/purchase-orders/purchase-orders-table"
import { useOrderOperations } from "@/hooks/useOrderOperations"
import { useEffect } from "react"

export default function PurchaseOrders() {
  const { fetchOrders } = useOrderOperations();
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <PurchaseOrdersTable />
        </main>
      </div>
    </div>
  );
}