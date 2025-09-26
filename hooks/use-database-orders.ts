"use client"

import { useState, useEffect, useCallback } from "react"
import { ordersDB, paymentsDB } from "@/lib/database"
import type { Order, OrderItem } from "@/types"

export function useDatabaseOrders() {
  const [orders, setOrders] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load orders for all tables
  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const ordersMap = await ordersDB.getAllActiveOrders()
      setOrders(ordersMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders")
      console.error("Error loading orders:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addItemToOrder = useCallback(
    async (tableId: string, item: Omit<OrderItem, "id" | "order_id" | "created_at">) => {
      try {
        setError(null)
        const existingOrder = orders[tableId]

        if (existingOrder) {
          const existingItemIndex =
            existingOrder.order_items?.findIndex((orderItem) => orderItem.menu_item_id === item.menu_item_id) ?? -1

          if (existingItemIndex >= 0 && existingOrder.order_items) {
            // Update existing item quantity
            const existingItem = existingOrder.order_items[existingItemIndex]
            const newQuantity = existingItem.quantity + item.quantity
            await ordersDB.updateItem(existingItem.id, newQuantity)
          } else {
            // Add new item
            await ordersDB.addItem(existingOrder.id, item)
          }

          // Recalculate total
          const updatedItems = existingOrder.order_items || []
          const newTotal =
            updatedItems.reduce((sum, orderItem) => {
              if (orderItem.menu_item_id === item.menu_item_id && existingItemIndex >= 0) {
                return sum + item.price * (orderItem.quantity + item.quantity)
              }
              return sum + orderItem.price * orderItem.quantity
            }, 0) + (existingItemIndex < 0 ? item.price * item.quantity : 0)

          await ordersDB.update(existingOrder.id, { total: newTotal })
        } else {
          const newOrder = await ordersDB.create({
            table_id: tableId,
            status: "pending",
            total: item.price * item.quantity,
          })

          await ordersDB.addItem(newOrder.id, item)
        }

        // Refresh orders
        await loadOrders()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item")
        console.error("Error adding item:", err)
      }
    },
    [orders, loadOrders],
  )

  const updateItemQuantity = useCallback(
    async (tableId: string, itemId: string, quantity: number) => {
      try {
        setError(null)
        const order = orders[tableId]
        if (!order) return

        if (quantity <= 0) {
          await ordersDB.removeItem(itemId)
        } else {
          await ordersDB.updateItem(itemId, quantity)
        }

        // Recalculate total
        const updatedItems = (order.order_items || [])
          .filter((item) => (quantity > 0 ? true : item.id !== itemId))
          .map((item) => (item.id === itemId ? { ...item, quantity } : item))

        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        if (updatedItems.length === 0) {
          await ordersDB.delete(order.id)
        } else {
          await ordersDB.update(order.id, { total: newTotal })
        }

        // Refresh orders
        await loadOrders()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item")
        console.error("Error updating item:", err)
      }
    },
    [orders, loadOrders],
  )

  const removeItemFromOrder = useCallback(
    (tableId: string, itemId: string) => {
      updateItemQuantity(tableId, itemId, 0)
    },
    [updateItemQuantity],
  )

  const clearOrder = useCallback(
    async (tableId: string) => {
      try {
        setError(null)
        const order = orders[tableId]
        if (order) {
          await ordersDB.delete(order.id)
        }

        // Refresh orders
        await loadOrders()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clear order")
        console.error("Error clearing order:", err)
      }
    },
    [orders, loadOrders],
  )

  const updateOrderStatus = useCallback(
    async (tableId: string, status: Order["status"]) => {
      try {
        setError(null)
        const order = orders[tableId]
        if (!order) return

        await ordersDB.update(order.id, { status })

        // Refresh orders
        await loadOrders()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update order status")
        console.error("Error updating order status:", err)
      }
    },
    [orders, loadOrders],
  )

  const processPayment = useCallback(
    async (orderId: string, paymentData: any) => {
      try {
        setError(null)
        const tableId = Object.keys(orders).find((key) => orders[key].id === orderId)
        if (!tableId) return

        await paymentsDB.create({
          order_id: orderId,
          amount: paymentData.amount,
          method: paymentData.method,
          status: "completed",
          reference: paymentData.reference,
          customer_paid: paymentData.customerPaid,
          change_amount: paymentData.changeAmount,
        })

        // Update order status
        await ordersDB.update(orderId, {
          status: "completed",
          customer_name: paymentData.customerName,
          customer_phone: paymentData.customerPhone,
        })

        // Refresh orders
        await loadOrders()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process payment")
        console.error("Error processing payment:", err)
      }
    },
    [orders, loadOrders],
  )

  // Load orders on mount
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return {
    orders,
    loading,
    error,
    addItemToOrder,
    updateItemQuantity,
    removeItemFromOrder,
    clearOrder,
    updateOrderStatus,
    processPayment,
    refreshOrders: loadOrders,
  }
}
