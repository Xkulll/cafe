import { createClient } from "@/lib/supabase/client"
import type { Order, OrderItem, MenuItemType, Table, Payment } from "@/types"

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Database operations for tables
export const tablesDB = {
  async getAll(): Promise<Table[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("tables").select("*").order("name")

    if (error) throw error
    return data || []
  },

  async updateStatus(id: string, status: Table["status"]) {
    const supabase = createClient()
    const { error } = await supabase
      .from("tables")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
  },
}

// Database operations for menu items
export const menuItemsDB = {
  async getAll(): Promise<MenuItemType[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error
    return data || []
  },

  async getByCategory(category: string): Promise<MenuItemType[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category", category)
      .eq("available", true)
      .order("name")

    if (error) throw error
    return data || []
  },
}

// Database operations for orders
export const ordersDB = {
  async create(orderData: {
    table_id: string
    status: string
    total: number
    discount?: number
    tax?: number
    customer_name?: string
    customer_phone?: string
    notes?: string
  }): Promise<Order> {
    const supabase = createClient()

    const orderId = generateUUID()
    console.log("[v0] Creating order with ID:", orderId)

    const { data, error } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating order:", error)
      throw error
    }
    console.log("[v0] Order created successfully:", data)
    return data
  },

  async getByTableId(tableId: string): Promise<Order | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("table_id", tableId)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async getAllActiveOrders(): Promise<Record<string, Order>> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .neq("status", "completed")
      .order("created_at", { ascending: false })

    if (error) throw error

    const ordersMap: Record<string, Order> = {}
    data?.forEach((order) => {
      ordersMap[order.table_id] = order
    })

    return ordersMap
  },

  async update(id: string, updates: Partial<Order>) {
    const supabase = createClient()
    console.log("[v0] Updating order:", id, updates)
    const { error } = await supabase
      .from("orders")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("[v0] Error updating order:", error)
      throw error
    }
  },

  async addItem(orderId: string, item: Omit<OrderItem, "id" | "order_id" | "created_at">) {
    const supabase = createClient()

    const itemId = generateUUID()
    console.log("[v0] Adding item to order:", orderId, "with item ID:", itemId)

    const { error } = await supabase.from("order_items").insert({
      id: itemId,
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      notes: item.notes,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error adding item:", error)
      throw error
    }
  },

  async updateItem(itemId: string, quantity: number) {
    const supabase = createClient()
    const { error } = await supabase.from("order_items").update({ quantity }).eq("id", itemId)

    if (error) throw error
  },

  async removeItem(itemId: string) {
    const supabase = createClient()
    const { error } = await supabase.from("order_items").delete().eq("id", itemId)

    if (error) throw error
  },

  async delete(id: string) {
    const supabase = createClient()
    // First delete all order items
    await supabase.from("order_items").delete().eq("order_id", id)

    // Then delete the order
    const { error } = await supabase.from("orders").delete().eq("id", id)
    if (error) throw error
  },
}

// Database operations for payments
export const paymentsDB = {
  async create(payment: Omit<Payment, "id" | "created_at" | "updated_at">): Promise<Payment> {
    const supabase = createClient()

    const paymentId = generateUUID()
    console.log("[v0] Creating payment with ID:", paymentId, "for order:", payment.order_id)

    const { data: orderExists, error: orderCheckError } = await supabase
      .from("orders")
      .select("id")
      .eq("id", payment.order_id)
      .single()

    if (orderCheckError || !orderExists) {
      console.error("[v0] Order not found for payment:", payment.order_id, orderCheckError)
      throw new Error(`Order ${payment.order_id} not found`)
    }

    const { data, error } = await supabase
      .from("payments")
      .insert({
        id: paymentId,
        ...payment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating payment:", error)
      throw error
    }

    console.log("[v0] Payment created successfully:", data)
    return data
  },

  async getByOrderId(orderId: string): Promise<Payment[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },
}
