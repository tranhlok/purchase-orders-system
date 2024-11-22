"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2 } from "lucide-react"

export function PurchaseOrdersTable({ orders }) {
  const [selectedRows, setSelectedRows] = useState(new Set())

  const toggleAll = () => {
    if (selectedRows.size === orders.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(orders.map(order => order.id)))
    }
  }

  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  // Add status update handler
  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedRows.size === orders.length}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Request ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Request</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Finalized</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Checkbox
                checked={selectedRows.has(order.id)}
                onCheckedChange={() => toggleRow(order.id)}
              />
            </TableCell>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FileText className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <CheckCircle2 className={`h-4 w-4 ${order.type === 'Finalized' ? 'text-green-500' : 'text-gray-300'}`} />
              </Button>
            </TableCell>
            <TableCell>
              <select
                value={order.type}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="Processing">Processing</option>
                <option value="Review">Review</option>
                <option value="Processed">Processed</option>
                <option value="Finalized">Finalized</option>
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}