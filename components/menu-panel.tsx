"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ImageIcon } from "lucide-react"
import { menuItemsDB } from "@/lib/database"
import type { MenuItemType } from "@/types"
import { cn } from "@/lib/utils"

interface MenuPanelProps {
  onAddItem: (item: MenuItemType) => void
  searchQuery?: string
}

export const menuCategories = [
  { id: "coffee", name: "Cà Phê", icon: "☕" },
  { id: "tea", name: "Trà & Trà Sữa", icon: "🍵" },
  { id: "juice", name: "Nước Ép & Sinh Tố", icon: "🥤" },
  { id: "snacks", name: "Bánh & Snacks", icon: "🍰" },
  { id: "food", name: "Món Ăn", icon: "🍜" },
]

export function MenuPanel({ onAddItem, searchQuery = "" }: MenuPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("coffee")
  const [search, setSearch] = useState(searchQuery)
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const items = await menuItemsDB.getAll()
        setMenuItems(items)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menu items")
        console.error("Error loading menu items:", err)
      } finally {
        setLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  const sampleMenuItems = [
    {
      id: "bo-huc",
      name: "Bò Húc",
      price: 15000,
      category: "coffee",
      image_url: "/images/bo-huc.jpg",
      available: true,
    },
    {
      id: "cafe-den",
      name: "Cafe Đen",
      price: 15000,
      category: "coffee",
      image_url: "/images/cafe-den.jpg",
      available: true,
    },
    {
      id: "ca-phe-sua",
      name: "Cà Phê Sữa",
      price: 20000,
      category: "coffee",
      image_url: "/images/ca-phe-sua.jpg",
      available: true,
    },
    {
      id: "nuoc-cam",
      name: "Nước Cam",
      price: 25000,
      category: "juice",
      image_url: "/images/nuoc-cam.jpg",
      available: true,
    },
    {
      id: "bac-xiu",
      name: "Bạc Xỉu",
      price: 22000,
      category: "coffee",
      image_url: "/images/bac-xiu.jpg",
      available: true,
    },
  ]

  // Use sample data if no items loaded from database
  const displayItems = menuItems.length > 0 ? menuItems : sampleMenuItems

  const filteredItems = displayItems.filter((item) => {
    const matchesCategory = selectedCategory === "coffee" || item.category === selectedCategory
    const matchesSearch = search === "" || item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const handleAddItem = (item: MenuItemType) => {
    onAddItem(item)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải thực đơn...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-2">Lỗi tải thực đơn</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Thực Đơn</h2>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 hover:shadow-xl group",
                  "bg-white hover:bg-gray-50 border border-gray-200 rounded-xl overflow-hidden",
                )}
                onClick={() => handleAddItem(item)}
              >
                <div className="p-4 text-center min-h-[180px] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                    {item.image_url ? (
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors text-center line-clamp-2 mb-2 text-gray-800">
                      {item.name}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2">({getCategoryName(item.category)})</div>
                    <div className="font-bold text-base text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      {item.price.toLocaleString("vi-VN")}
                    </div>
                  </div>

                  {!item.available && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs rounded-lg">
                      Hết món
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-3xl mb-2">🔍</div>
              <p>Không tìm thấy món nào</p>
              <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getCategoryName(categoryId: string): string {
  const category = menuCategories.find((cat) => cat.id === categoryId)
  return category?.name || "Khác"
}
