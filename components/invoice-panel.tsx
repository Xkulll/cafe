"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Receipt, Printer, Download, Clock, CheckCircle } from "lucide-react"
import type { Order } from "@/types"
import { cn } from "@/lib/utils"

interface InvoicePanelProps {
  selectedTable: string | null
  orders: Record<string, Order>
}

export function InvoicePanel({ selectedTable, orders }: InvoicePanelProps) {
  const currentOrder = selectedTable ? orders[selectedTable] : null

  const getTotalAmount = () => {
    if (!currentOrder) return 0
    return currentOrder.total
  }

  const getTotalItems = () => {
    if (!currentOrder || !currentOrder.order_items) return 0
    return currentOrder.order_items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    if (!currentOrder || !currentOrder.order_items) return 0
    return currentOrder.order_items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return Math.round(getSubtotal() * 0.1) // 10% VAT
  }

  const getDiscount = () => {
    return 0 // No discount for now
  }

  if (!selectedTable) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/30">
        <div className="text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">Hóa đơn</p>
          <p className="text-sm">Chọn bàn để xem hóa đơn</p>
        </div>
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/30">
        <div className="text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">Chưa có đơn hàng</p>
          <p className="text-sm">Bàn {selectedTable} chưa có đơn hàng nào</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Hóa đơn</h2>
          </div>
          <Badge className={cn("text-xs", getStatusColor(currentOrder.status))}>
            {currentOrder.status === "completed" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {getStatusText(currentOrder.status)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bàn:</span>
            <span className="font-medium">{selectedTable === "takeaway" ? "Mang về" : `Bàn ${selectedTable}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian:</span>
            <span className="font-medium">
              {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleString("vi-VN") : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã đơn:</span>
            <span className="font-medium font-mono">#{currentOrder.id?.slice(-8) || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-6">
        <h3 className="font-medium mb-4">Chi tiết đơn hàng</h3>

        {currentOrder.order_items && currentOrder.order_items.length > 0 ? (
          <div className="space-y-3">
            {currentOrder.order_items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">{index + 1}.</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      {item.price.toLocaleString("vi-VN")}đ × {item.quantity}
                    </div>
                    {item.notes && <div className="text-xs text-muted-foreground ml-6 mt-1">Ghi chú: {item.notes}</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Chưa có món nào</p>
          </div>
        )}
      </div>

      {/* Total Section */}
      <div className="p-6 border-t border-border">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính ({getTotalItems()} món):</span>
            <span>{getSubtotal().toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá:</span>
            <span>-{getDiscount().toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (10%):</span>
            <span>{getTax().toLocaleString("vi-VN")}đ</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary">{getTotalAmount().toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Printer className="w-4 h-4 mr-2" />
            In hóa đơn
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "preparing":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "ready":
      return "bg-green-100 text-green-800 border-green-200"
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "paid":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusText(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "Chờ xác nhận"
    case "confirmed":
      return "Đã xác nhận"
    case "preparing":
      return "Đang chuẩn bị"
    case "ready":
      return "Sẵn sàng"
    case "completed":
      return "Đã thanh toán"
    case "paid":
      return "Đã thanh toán"
    default:
      return "Không xác định"
  }
}
