"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PaymentDialog } from "@/components/payment-dialog"
import { Search, Plus, Minus, Edit, RotateCcw, Calendar, CreditCard, Trash2, Clock, CheckCircle } from "lucide-react"
import type { Order, OrderItem } from "@/types"
import { cn } from "@/lib/utils"

interface OrderPanelProps {
  selectedTable: string | null
  orders: Record<string, Order>
  onUpdateItemQuantity: (tableId: string, itemId: string, quantity: number) => void
  onRemoveItem: (tableId: string, itemId: string) => void
  onClearOrder: (tableId: string) => void
  onUpdateOrderStatus: (tableId: string, status: Order["status"]) => void
  onProcessPayment: (orderId: string, paymentData: any) => void
}

export function OrderPanel({
  selectedTable,
  orders,
  onUpdateItemQuantity,
  onRemoveItem,
  onClearOrder,
  onUpdateOrderStatus,
  onProcessPayment,
}: OrderPanelProps) {
  const [notes, setNotes] = useState("")
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const currentOrder = selectedTable ? orders[selectedTable] : null

  const updateQuantity = (itemId: string, change: number) => {
    if (!selectedTable || !currentOrder) return

    const item = currentOrder.order_items?.find((item) => item.id === itemId)
    if (!item) return

    const newQuantity = item.quantity + change
    if (newQuantity <= 0) {
      onRemoveItem(selectedTable, itemId)
    } else {
      onUpdateItemQuantity(selectedTable, itemId, newQuantity)
    }
  }

  const getTotalAmount = () => {
    if (!currentOrder) return 0
    return currentOrder.total
  }

  const getTotalItems = () => {
    if (!currentOrder || !currentOrder.order_items) return 0
    return currentOrder.order_items.reduce((total, item) => total + item.quantity, 0)
  }

  const handlePayment = () => {
    if (!currentOrder) return
    setShowPaymentDialog(true)
  }

  const handlePaymentComplete = (orderId: string, paymentData: any) => {
    onProcessPayment(orderId, paymentData)
    // Show success message
    alert(`Thanh toán thành công! Phương thức: ${paymentData.method}`)
  }

  if (!selectedTable) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p>Chọn bàn để bắt đầu order</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-lg px-3 py-1">
              📋{" "}
              {selectedTable === "takeaway"
                ? "Mang về"
                : `${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} / Lầu 2`}
            </Badge>
            {currentOrder && (
              <Badge className={cn("text-xs rounded-lg", getStatusColor(currentOrder.status))}>
                {currentOrder.status === "completed" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {getStatusText(currentOrder.status)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
            {currentOrder && currentOrder.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearOrder(selectedTable)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Tìm khách hàng (F4)" className="pl-10 rounded-lg" />
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-auto p-4">
        {currentOrder && currentOrder.order_items && currentOrder.order_items.length > 0 ? (
          <div className="space-y-3">
            {currentOrder.order_items.map((item, index) => (
              <Card
                key={item.id}
                className="p-4 hover:shadow-lg transition-all duration-200 rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">{index + 1}.</span>
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="secondary" size="sm">
                        ly
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      {item.notes || "Không có Ghi chú/Món thêm"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-destructive/10 hover:border-destructive/20 bg-transparent"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={currentOrder.status === "completed"}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-primary/10 hover:border-primary/20 bg-transparent"
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={currentOrder.status === "completed"}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-right ml-4">
                    <div className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}</div>
                    <div className="text-xs text-muted-foreground">{item.price.toLocaleString("vi-VN")} / ly</div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSelectedItem(item)}
                        disabled={currentOrder.status === "completed"}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chỉnh sửa món: {item.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Ghi chú</label>
                          <Textarea
                            placeholder="Thêm ghi chú cho món..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Hủy</Button>
                          <Button>Lưu thay đổi</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-3xl mb-2">📝</div>
            <p>Chưa có món nào được order</p>
            <p className="text-sm">Thêm món từ thực đơn để bắt đầu</p>
          </div>
        )}

        {/* Add Item Button */}
        {currentOrder && currentOrder.status !== "completed" && (
          <Button
            variant="outline"
            className="w-full mt-4 text-primary border-primary/20 hover:bg-primary/5 bg-transparent rounded-lg py-3"
          >
            + Thêm món từ thực đơn
          </Button>
        )}
      </div>

      {/* Footer Actions */}
      {currentOrder && (
        <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50 rounded-b-xl">
          {/* Order Status Controls */}
          {currentOrder.status !== "completed" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateOrderStatus(selectedTable, "confirmed")}
                disabled={currentOrder.status === "confirmed"}
              >
                Xác nhận
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateOrderStatus(selectedTable, "preparing")}
                disabled={currentOrder.status === "preparing"}
              >
                Chuẩn bị
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateOrderStatus(selectedTable, "ready")}
                disabled={currentOrder.status === "ready"}
              >
                Sẵn sàng
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Mn Coffee...
            </Button>
            <Button variant="outline" size="sm">
              🏷️ 0
            </Button>
            <Button variant="outline" size="sm" disabled={currentOrder.status === "completed"}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={currentOrder.status === "completed"}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={currentOrder.status === "completed"}>
              Tách ghép
            </Button>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Tổng tiền {getTotalItems()}</span>
            <span className="text-2xl">{getTotalAmount().toLocaleString("vi-VN")}</span>
          </div>

          {/* Payment Buttons */}
          <div className="grid grid-cols-1 gap-2">
            {currentOrder.status === "completed" ? (
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl py-4 text-lg font-semibold" disabled>
                <CheckCircle className="w-5 h-5 mr-2" />
                Đã thanh toán
              </Button>
            ) : (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!currentOrder.order_items || currentOrder.order_items.length === 0}
                  onClick={handlePayment}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Thanh toán (F9)
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        order={currentOrder}
        onPaymentComplete={handlePaymentComplete}
      />
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
