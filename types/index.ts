export interface MenuItemType {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  description?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  name: string
  price: number
  quantity: number
  notes?: string
  created_at?: string
}

export interface Order {
  id: string
  table_id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "paid"
  total: number
  discount?: number
  tax?: number
  customer_name?: string
  customer_phone?: string
  notes?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface Table {
  id: string
  name: string
  type: "regular" | "vip" | "takeaway"
  status: "available" | "occupied" | "reserved" | "cleaning"
  capacity?: number
  floor?: string
  created_at?: string
  updated_at?: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  method: string
  status: "pending" | "completed" | "failed"
  reference?: string
  customer_paid?: number
  change_amount?: number
  created_at: string
  updated_at: string
}

export interface MenuItem extends MenuItemType {}

export interface Receipt {
  id: string
  orderId: string
  paymentId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  createdAt: Date
  customerName?: string
  customerPhone?: string
}
