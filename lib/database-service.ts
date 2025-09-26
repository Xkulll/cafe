import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Table, Order, OrderItem, MenuItemType, Payment } from "@/types"

export class DatabaseService {
  private supabase = createClient()

  // Tables operations
  async getTables(): Promise<Table[]> {
    const { data, error } = await this.supabase.from("tables").select("*").order("name")

    if (error) throw error
    return data || []
  }

  async updateTableStatus(tableId: string, status: "available" | "occupied" | "reserved"): Promise<void> {
    const { error } = await this.supabase
      .from("tables")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", tableId)

    if (error) throw error
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItemType[]> {
    const { data, error } = await this.supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error
    return data || []
  }

  // Orders operations
  async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<string> {
    const { data, error } = await this.supabase
      .from("orders")
      .insert({
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) throw error
  }

  async getOrdersByTable(tableId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          menu_item_id,
          name,
          quantity,
          price,
          notes
        )
      `)
      .eq("table_id", tableId)
      .neq("status", "completed")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Order items operations
  async addOrderItem(orderItem: Omit<OrderItem, "id" | "created_at">): Promise<void> {
    const { error } = await this.supabase.from("order_items").insert({
      ...orderItem,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  }

  async updateOrderItem(itemId: string, updates: Partial<OrderItem>): Promise<void> {
    const { error } = await this.supabase.from("order_items").update(updates).eq("id", itemId)

    if (error) throw error
  }

  async deleteOrderItem(itemId: string): Promise<void> {
    const { error } = await this.supabase.from("order_items").delete().eq("id", itemId)

    if (error) throw error
  }

  // Payment operations
  async createPayment(payment: Omit<Payment, "id" | "created_at" | "updated_at">): Promise<string> {
    const { data, error } = await this.supabase
      .from("payments")
      .insert({
        ...payment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  }
}

export class ServerDatabaseService {
  private async getSupabase() {
    return await createServerClient()
  }

  async getTables(): Promise<Table[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("tables").select("*").order("name")

    if (error) throw error
    return data || []
  }

  async getMenuItems(): Promise<MenuItemType[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error
    return data || []
  }
}

export const dbService = new DatabaseService()
export const serverDbService = new ServerDatabaseService()
