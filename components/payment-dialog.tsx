"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Printer, Calculator } from "lucide-react"
import type { Order, PaymentMethod } from "@/types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onPaymentComplete: (orderId: string, paymentData: any) => void
}

const paymentMethods: PaymentMethod[] = [
  { id: "cash", name: "Tiền mặt", icon: "💵", enabled: true },
  { id: "card", name: "Thẻ tín dụng", icon: "💳", enabled: true },
  { id: "momo", name: "MoMo", icon: "📱", enabled: true },
  { id: "zalopay", name: "ZaloPay", icon: "💰", enabled: true },
  { id: "banking", name: "Chuyển khoản", icon: "🏦", enabled: true },
]

export function PaymentDialog({ open, onOpenChange, order, onPaymentComplete }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("cash")
  const [customerPaid, setCustomerPaid] = useState<string>("")
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerPhone, setCustomerPhone] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!order) return null

  const subtotal = order.total
  const taxRate = 0.1 // 10% VAT
  const taxAmount = subtotal * taxRate

  const discountAmount = discountType === "percent" ? (subtotal * discount) / 100 : discount

  const finalTotal = subtotal + taxAmount - discountAmount
  const customerPaidAmount = Number.parseFloat(customerPaid) || 0
  const changeAmount = customerPaidAmount - finalTotal

  const handlePayment = async () => {
    if (selectedMethod === "cash" && customerPaidAmount < finalTotal) {
      alert("Số tiền khách đưa không đủ!")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: selectedMethod,
        amount: finalTotal,
        customerPaid: customerPaidAmount,
        change: changeAmount,
        discount: discountAmount,
        tax: taxAmount,
        customerName,
        customerPhone,
        notes,
      }

      onPaymentComplete(order.id, paymentData)
      setIsProcessing(false)
      onOpenChange(false)

      // Reset form
      setCustomerPaid("")
      setDiscount(0)
      setCustomerName("")
      setCustomerPhone("")
      setNotes("")
    }, 2000)
  }

  const handlePrintReceipt = () => {
    // In a real app, this would integrate with a receipt printer
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Thanh toán -{" "}
            {order.tableId === "takeaway" ? "Mang về" : `Bàn ${order.tableId?.replace?.("ban", "") || "N/A"}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-medium">Chi tiết đơn hàng</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              {(order.items || []).map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {index + 1}. {item.name} x{item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Tên khách hàng (tùy chọn)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Số điện thoại (tùy chọn)</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-3">
            <h3 className="font-medium">Giảm giá</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <Button
                variant={discountType === "percent" ? "default" : "outline"}
                onClick={() => setDiscountType("percent")}
              >
                %
              </Button>
              <Button
                variant={discountType === "amount" ? "default" : "outline"}
                onClick={() => setDiscountType("amount")}
              >
                VNĐ
              </Button>
            </div>
          </div>

          {/* Payment Calculation */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế VAT (10%):</span>
              <span>{taxAmount.toLocaleString("vi-VN")}đ</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-medium">Phương thức thanh toán</h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={selectedMethod === method.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={!method.enabled}
                >
                  <span className="mr-2">{method.icon}</span>
                  {method.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Cash Payment Details */}
          {selectedMethod === "cash" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerPaid">Khách đưa</Label>
                <Input
                  id="customerPaid"
                  type="number"
                  value={customerPaid}
                  onChange={(e) => setCustomerPaid(e.target.value)}
                  placeholder="Nhập số tiền khách đưa"
                />
              </div>
              {customerPaidAmount > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span>Khách đưa:</span>
                    <span>{customerPaidAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng tiền:</span>
                    <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Tiền thối:</span>
                    <span className={changeAmount >= 0 ? "text-green-600" : "text-red-600"}>
                      {changeAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (selectedMethod === "cash" && customerPaidAmount < finalTotal)}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Calculator className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thanh toán {finalTotal.toLocaleString("vi-VN")}đ
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Printer className="w-4 h-4 mr-2" />
              In hóa đơn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
