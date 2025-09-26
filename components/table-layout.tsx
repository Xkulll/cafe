"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Order } from "@/types"

interface TableLayoutProps {
  selectedTable: string | null
  onTableSelect: (tableId: string) => void
  orders: Record<string, Order>
}

export function TableLayout({ selectedTable, onTableSelect, orders }: TableLayoutProps) {
  const tables = [
    { id: "takeaway", name: "Mang về", type: "takeaway", status: "available" },
    { id: "vip1", name: "Phòng VIP 1", type: "vip", status: "available" },
    { id: "vip10", name: "Phòng VIP 10", type: "vip", status: "available" },
    { id: "vip2", name: "Phòng VIP 2", type: "vip", status: "available" },
    { id: "vip3", name: "Phòng VIP 3", type: "vip", status: "available" },
    { id: "vip4", name: "Phòng VIP 4", type: "vip", status: "available" },
    { id: "vip5", name: "Phòng VIP 5", type: "vip", status: "available" },
    { id: "vip6", name: "Phòng VIP 6", type: "vip", status: "available" },
    { id: "vip7", name: "Phòng VIP 7", type: "vip", status: "available" },
    { id: "vip8", name: "Phòng VIP 8", type: "vip", status: "available" },
    { id: "vip9", name: "Phòng VIP 9", type: "vip", status: "available" },
    { id: "ban1", name: "Bàn 1", type: "regular", status: "available" },
    { id: "ban2", name: "Bàn 2", type: "regular", status: "available" },
    { id: "ban3", name: "Bàn 3", type: "regular", status: orders["ban3"] ? "occupied" : "available" },
    { id: "ban4", name: "Bàn 4", type: "regular", status: "available" },
    { id: "ban5", name: "Bàn 5", type: "regular", status: "available" },
    { id: "ban6", name: "Bàn 6", type: "regular", status: orders["ban6"] ? "occupied" : "available" },
    { id: "ban7", name: "Bàn 7", type: "regular", status: "available" },
    { id: "ban8", name: "Bàn 8", type: "regular", status: "available" },
    { id: "ban9", name: "Bàn 9", type: "regular", status: "available" },
  ]

  const getTableStatusCount = (status: string) => {
    return tables.filter((table) => (orders[table.id] ? "occupied" : "available") === status).length
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        

        {/* Status Tabs */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>Tất cả ({tables.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Sử dụng ({getTableStatusCount("occupied")})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Còn trống ({getTableStatusCount("available")})</span>
          </div>
        </div>
      </div>

      {/* Table Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table) => {
            const hasOrder = orders[table.id]
            const actualStatus = hasOrder ? "occupied" : "available"

            return (
              <Card
                key={table.id}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 hover:shadow-md",
                  table.type === "takeaway" && "bg-gray-100 border-gray-300",
                  actualStatus === "occupied" && table.type !== "takeaway" && "bg-primary text-primary-foreground",
                  actualStatus === "available" && table.type !== "takeaway" && "bg-card hover:bg-accent",
                  selectedTable === table.id && "ring-2 ring-primary ring-offset-2",
                )}
                onClick={() => onTableSelect(table.id)}
              >
                <div className="p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
                  {table.type === "takeaway" ? (
                    <ShoppingBag className="w-8 h-8 mb-2 text-gray-600" />
                  ) : (
                    <div className="w-12 h-8 border-2 border-current rounded mb-2"></div>
                  )}
                  <span className="text-sm font-medium">{table.name}</span>
                  {actualStatus === "occupied" && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Đang sử dụng
                    </Badge>
                  )}
                  {hasOrder && (
                    <div className="text-xs mt-1 opacity-80">
                      {hasOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} món
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="auto-menu" />
            <label htmlFor="auto-menu">Mở thực đơn khi chọn bàn</label>
          </div>
          <div className="flex items-center gap-2">
            <span>1/2</span>
            <Button variant="ghost" size="sm">
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
