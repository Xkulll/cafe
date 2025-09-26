"use client"

import { useState, useCallback } from "react"
import type { Order, OrderItem } from "@/types"

export function useOrders() {
  const [orders, setOrders] = useState<Record<string, Order>>({
    ban6: {
      id: "order-1",
      tableId: "ban6",
      items: [
        {
          id: "1",
          menuItemId: "coffee-da",
          name: "Cà Phê Đá",
          price: 25000,
          quantity: 3,
        },
        {
          id: "2",
          menuItemId: "bac-xiu",
          name: "Bạc Xỉu",
          price: 30000,
          quantity: 2,
        },
        {
          id: "3",
          menuItemId: "tra-sua-tran-chau",
          name: "Trà Sữa Trân Châu Đường Đen",
          price: 40000,
          quantity: 1,
        },
      ],
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      total: 175000,
    },
  })

  const addItemToOrder = useCallback((tableId: string, item: Omit<OrderItem, "id">) => {
    setOrders((prev) => {
      const existingOrder = prev[tableId]
      const newItem: OrderItem = {
        ...item,
        id: Date.now().toString(),
      }

      if (existingOrder) {
        // Check if item already exists, if so, increase quantity
        const existingItemIndex = existingOrder.items.findIndex((orderItem) => orderItem.menuItemId === item.menuItemId)

        let updatedItems
        if (existingItemIndex >= 0) {
          updatedItems = existingOrder.items.map((orderItem, index) =>
            index === existingItemIndex ? { ...orderItem, quantity: orderItem.quantity + item.quantity } : orderItem,
          )
        } else {
          updatedItems = [...existingOrder.items, newItem]
        }

        const updatedOrder = {
          ...existingOrder,
          items: updatedItems,
          updatedAt: new Date(),
          total: updatedItems.reduce((sum, orderItem) => sum + orderItem.price * orderItem.quantity, 0),
        }

        return {
          ...prev,
          [tableId]: updatedOrder,
        }
      } else {
        // Create new order
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          tableId,
          items: [newItem],
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
          total: item.price * item.quantity,
        }

        return {
          ...prev,
          [tableId]: newOrder,
        }
      }
    })
  }, [])

  const updateItemQuantity = useCallback((tableId: string, itemId: string, quantity: number) => {
    setOrders((prev) => {
      const order = prev[tableId]
      if (!order) return prev

      const updatedItems =
        quantity > 0
          ? order.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
          : order.items.filter((item) => item.id !== itemId)

      const updatedOrder = {
        ...order,
        items: updatedItems,
        updatedAt: new Date(),
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }

      if (updatedItems.length === 0) {
        const { [tableId]: removed, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [tableId]: updatedOrder,
      }
    })
  }, [])

  const removeItemFromOrder = useCallback(
    (tableId: string, itemId: string) => {
      updateItemQuantity(tableId, itemId, 0)
    },
    [updateItemQuantity],
  )

  const clearOrder = useCallback((tableId: string) => {
    setOrders((prev) => {
      const { [tableId]: removed, ...rest } = prev
      return rest
    })
  }, [])

  const updateOrderStatus = useCallback((tableId: string, status: Order["status"]) => {
    setOrders((prev) => {
      const order = prev[tableId]
      if (!order) return prev

      return {
        ...prev,
        [tableId]: {
          ...order,
          status,
          updatedAt: new Date(),
        },
      }
    })
  }, [])

  const processPayment = useCallback((orderId: string, paymentData: any) => {
    setOrders((prev) => {
      const tableId = Object.keys(prev).find((key) => prev[key].id === orderId)
      if (!tableId) return prev

      const order = prev[tableId]
      const updatedOrder = {
        ...order,
        status: "paid" as const,
        updatedAt: new Date(),
        customerName: paymentData.customerName,
        customerPhone: paymentData.customerPhone,
      }

      return {
        ...prev,
        [tableId]: updatedOrder,
      }
    })
  }, [])

  return {
    orders,
    addItemToOrder,
    updateItemQuantity,
    removeItemFromOrder,
    clearOrder,
    updateOrderStatus,
    processPayment,
  }
}
