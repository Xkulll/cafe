import type { MenuItem } from "@/types"

export const menuCategories = [
  { id: "coffee", name: "Cà Phê", icon: "☕" },
  { id: "tea", name: "Trà & Trà Sữa", icon: "🍵" },
  { id: "juice", name: "Nước Ép & Sinh Tố", icon: "🥤" },
  { id: "snacks", name: "Bánh & Snacks", icon: "🍰" },
  { id: "food", name: "Món Ăn", icon: "🍜" },
]

export const menuItems: MenuItem[] = [
  // Coffee
  { id: "coffee-da", name: "Cà Phê Đá", price: 25000, category: "coffee", available: true },
  { id: "coffee-nong", name: "Cà Phê Nóng", price: 25000, category: "coffee", available: true },
  { id: "bac-xiu", name: "Bạc Xỉu", price: 30000, category: "coffee", available: true },
  { id: "ca-phe-sua", name: "Cà Phê Sữa", price: 28000, category: "coffee", available: true },
  { id: "espresso", name: "Espresso", price: 35000, category: "coffee", available: true },
  { id: "americano", name: "Americano", price: 32000, category: "coffee", available: true },
  { id: "cappuccino", name: "Cappuccino", price: 45000, category: "coffee", available: true },
  { id: "latte", name: "Latte", price: 48000, category: "coffee", available: true },

  // Tea & Milk Tea
  { id: "tra-sua-tran-chau", name: "Trà Sữa Trân Châu Đường Đen", price: 40000, category: "tea", available: true },
  { id: "tra-sua-matcha", name: "Trà Sữa Matcha", price: 42000, category: "tea", available: true },
  { id: "tra-sua-thai", name: "Trà Sữa Thái", price: 38000, category: "tea", available: true },
  { id: "tra-dao", name: "Trà Đào", price: 35000, category: "tea", available: true },
  { id: "tra-chanh", name: "Trà Chanh", price: 30000, category: "tea", available: true },
  { id: "tra-gung", name: "Trà Gừng Mật Ong", price: 32000, category: "tea", available: true },

  // Juice & Smoothies
  { id: "nuoc-cam", name: "Nước Cam Tươi", price: 35000, category: "juice", available: true },
  { id: "sinh-to-bo", name: "Sinh Tố Bơ", price: 40000, category: "juice", available: true },
  { id: "sinh-to-xoai", name: "Sinh Tố Xoài", price: 38000, category: "juice", available: true },
  { id: "nuoc-dua", name: "Nước Dừa Tươi", price: 25000, category: "juice", available: true },
  { id: "da-chanh", name: "Đá Chanh", price: 20000, category: "juice", available: true },

  // Snacks & Cakes
  { id: "banh-mi", name: "Bánh Mì Thịt Nướng", price: 25000, category: "snacks", available: true },
  { id: "banh-croissant", name: "Bánh Croissant", price: 35000, category: "snacks", available: true },
  { id: "banh-tiramisu", name: "Bánh Tiramisu", price: 45000, category: "snacks", available: true },
  { id: "banh-cheesecake", name: "Bánh Cheesecake", price: 50000, category: "snacks", available: true },

  // Food
  { id: "com-ga", name: "Cơm Gà Xối Mỡ", price: 65000, category: "food", available: true },
  { id: "bun-bo", name: "Bún Bò Huế", price: 55000, category: "food", available: true },
  { id: "pho-bo", name: "Phở Bò", price: 60000, category: "food", available: true },
  { id: "mi-quang", name: "Mì Quảng", price: 58000, category: "food", available: true },
]
