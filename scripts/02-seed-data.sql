-- Insert sample tables
INSERT INTO tables (id, name, type, status, capacity, floor) VALUES
('ban1', 'Bàn 1', 'regular', 'available', 4, 'Lầu 1'),
('ban2', 'Bàn 2', 'regular', 'available', 4, 'Lầu 1'),
('ban3', 'Bàn 3', 'regular', 'available', 6, 'Lầu 1'),
('ban4', 'Bàn 4', 'vip', 'available', 8, 'Lầu 2'),
('ban5', 'Bàn 5', 'vip', 'available', 6, 'Lầu 2'),
('ban6', 'Bàn 6', 'regular', 'occupied', 4, 'Lầu 2'),
('ban7', 'Bàn 7', 'regular', 'available', 4, 'Lầu 2'),
('ban8', 'Bàn 8', 'regular', 'reserved', 4, 'Lầu 2'),
('takeaway', 'Mang về', 'takeaway', 'available', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, name, price, category, available, description) VALUES
-- Coffee
('coffee-da', 'Cà Phê Đá', 25000, 'coffee', true, 'Cà phê đen truyền thống với đá'),
('coffee-nong', 'Cà Phê Nóng', 25000, 'coffee', true, 'Cà phê đen nóng'),
('bac-xiu', 'Bạc Xỉu', 30000, 'coffee', true, 'Cà phê sữa đá ngọt nhẹ'),
('ca-phe-sua', 'Cà Phê Sữa', 28000, 'coffee', true, 'Cà phê sữa đá đậm đà'),
('espresso', 'Espresso', 35000, 'coffee', true, 'Cà phê espresso nguyên chất'),
('americano', 'Americano', 32000, 'coffee', true, 'Espresso pha loãng với nước nóng'),
('cappuccino', 'Cappuccino', 45000, 'coffee', true, 'Espresso với sữa nóng và bọt sữa'),
('latte', 'Latte', 48000, 'coffee', true, 'Espresso với nhiều sữa nóng'),

-- Tea & Milk Tea
('tra-sua-tran-chau', 'Trà Sữa Trân Châu Đường Đen', 40000, 'tea', true, 'Trà sữa với trân châu đường đen'),
('tra-sua-matcha', 'Trà Sữa Matcha', 42000, 'tea', true, 'Trà sữa vị matcha Nhật Bản'),
('tra-sua-thai', 'Trà Sữa Thái', 38000, 'tea', true, 'Trà sữa kiểu Thái Lan'),
('tra-dao', 'Trà Đào', 35000, 'tea', true, 'Trà đào tươi mát'),
('tra-chanh', 'Trà Chanh', 30000, 'tea', true, 'Trà chanh tươi'),
('tra-gung', 'Trà Gừng Mật Ong', 32000, 'tea', true, 'Trà gừng với mật ong'),

-- Juice & Smoothies
('nuoc-cam', 'Nước Cam Tươi', 35000, 'juice', true, 'Nước cam vắt tươi'),
('sinh-to-bo', 'Sinh Tố Bơ', 40000, 'juice', true, 'Sinh tố bơ béo ngậy'),
('sinh-to-xoai', 'Sinh Tố Xoài', 38000, 'juice', true, 'Sinh tố xoài tươi'),
('nuoc-dua', 'Nước Dừa Tươi', 25000, 'juice', true, 'Nước dừa tươi mát'),
('da-chanh', 'Đá Chanh', 20000, 'juice', true, 'Nước chanh đá'),

-- Snacks & Cakes
('banh-mi', 'Bánh Mì Thịt Nướng', 25000, 'snacks', true, 'Bánh mì thịt nướng'),
('banh-croissant', 'Bánh Croissant', 35000, 'snacks', true, 'Bánh croissant bơ'),
('banh-tiramisu', 'Bánh Tiramisu', 45000, 'snacks', true, 'Bánh tiramisu Ý'),
('banh-cheesecake', 'Bánh Cheesecake', 50000, 'snacks', true, 'Bánh cheesecake New York'),

-- Food
('com-ga', 'Cơm Gà Xối Mỡ', 65000, 'food', true, 'Cơm gà Hải Nam'),
('bun-bo', 'Bún Bò Huế', 55000, 'food', true, 'Bún bò Huế cay nồng'),
('pho-bo', 'Phở Bò', 60000, 'food', true, 'Phở bò Hà Nội'),
('mi-quang', 'Mì Quảng', 58000, 'food', true, 'Mì Quảng đặc sản Quảng Nam')
ON CONFLICT (id) DO NOTHING;
