"use client"

import { useState } from "react"
import { TableLayout } from "@/components/table-layout"
import { OrderPanel } from "@/components/order-panel"
import { MenuPanel } from "@/components/menu-panel"
import { useDatabaseOrders } from "@/hooks/use-database-orders"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Coffee, Table } from "lucide-react"
import type { MenuItemType } from "@/types"

type ViewType = "tables" | "menu"

export default function CafeManagement() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>("tables")
  const {
    orders,
    loading,
    error,
    addItemToOrder,
    updateItemQuantity,
    removeItemFromOrder,
    clearOrder,
    updateOrderStatus,
    processPayment,
    refreshOrders,
  } = useDatabaseOrders()

  const handleAddMenuItem = (menuItem: MenuItemType) => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi thêm món!")
      return
    }

    addItemToOrder(selectedTable, {
      menu_item_id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header with Navigation */}
      <div className="bg-primary text-primary-foreground rounded-xl mb-4 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={currentView === "tables" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("tables")}
                  className={
                    currentView === "tables"
                      ? "bg-white text-primary font-medium px-6 py-2 rounded-lg"
                      : "text-primary-foreground hover:bg-white/10 px-6 py-2 rounded-lg"
                  }
                >
                  <Table className="w-4 h-4 mr-2" />
                  Phòng bàn
                </Button>
                <Button
                  variant={currentView === "menu" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("menu")}
                  className={
                    currentView === "menu"
                      ? "bg-white text-primary font-medium px-6 py-2 rounded-lg"
                      : "text-primary-foreground hover:bg-white/10 px-6 py-2 rounded-lg"
                  }
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Thực đơn
                </Button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm món (F3)"
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/30 w-80"
                />
                <svg
                  className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 h-[calc(100vh-140px)]">
        {/* Left Section with Sidebar and Main Content */}
        <div className="flex-1 flex gap-4">
          {/* Category Sidebar for Menu View */}
          {currentView === "menu" && (
            <div className="w-48 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <Button variant="default" className="w-full justify-start text-sm rounded-lg bg-primary text-white">
                    Tất cả
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-lg hover:bg-gray-100">
                    CAFE
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-lg hover:bg-gray-100">
                    NƯỚC GIẢI KHÁC
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-lg hover:bg-gray-100">
                    Nước Ngọt
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-lg hover:bg-gray-100">
                    COCKTAIL
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-lg hover:bg-gray-100">
                    Combo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {currentView === "tables" && (
              <TableLayout selectedTable={selectedTable} onTableSelect={setSelectedTable} orders={orders} />
            )}

            {currentView === "menu" && <MenuPanel onAddItem={handleAddMenuItem} />}
          </div>
        </div>

        {/* Right Section - Order Panel */}
        <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <OrderPanel
            selectedTable={selectedTable}
            orders={orders}
            onUpdateItemQuantity={updateItemQuantity}
            onRemoveItem={removeItemFromOrder}
            onClearOrder={clearOrder}
            onUpdateOrderStatus={updateOrderStatus}
            onProcessPayment={processPayment}
          />
        </div>
      </div>
    </div>
  )
}
