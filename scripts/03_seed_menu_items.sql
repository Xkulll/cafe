-- Seed menu items data
INSERT INTO menu_items (id, name, price, category, description) VALUES
-- Coffee
('coffee-da', 'Cà Phê Đá', 25000, 'coffee', 'Cà phê phin truyền thống với đá'),
('coffee-nong', 'Cà Phê Nóng', 25000, 'coffee', 'Cà phê phin truyền thống nóng'),
('bac-xiu', 'Bạc Xỉu', 30000, 'coffee', 'Cà phê sữa đá kiểu Sài Gòn'),
('ca-phe-sua', 'Cà Phê Sữa', 28000, 'coffee', 'Cà phê phin với sữa đặc'),
('espresso', 'Espresso', 35000, 'coffee', 'Cà phê espresso đậm đà'),
('americano', 'Americano', 32000, 'coffee', 'Espresso pha loãng với nước nóng'),
('cappuccino', 'Cappuccino', 45000, 'coffee', 'Espresso với sữa nóng và bọt sữa'),
('latte', 'Latte', 48000, 'coffee', 'Espresso với nhiều sữa nóng'),

-- Tea & Milk Tea
('tra-sua-tran-chau', 'Trà Sữa Trân Châu Đường Đen', 40000, 'tea', 'Trà sữa với trân châu đường đen'),
('tra-sua-matcha', 'Trà Sữa Matcha', 42000, 'tea', 'Trà sữa vị matcha Nhật Bản'),
('tra-sua-thai', 'Trà Sữa Thái', 38000, 'tea', 'Trà sữa kiểu Thái Lan'),
('tra-dao', 'Trà Đào', 35000, 'tea', 'Trà đen với đào tươi'),
('tra-chanh', 'Trà Chanh', 30000, 'tea', 'Trà đen với chanh tươi'),
('tra-gung', 'Trà Gừng Mật Ong', 32000, 'tea', 'Trà gừng với mật ong'),

-- Juice & Smoothies
('nuoc-cam', 'Nước Cam Tươi', 35000, 'juice', 'Nước cam vắt tươi'),
('sinh-to-bo', 'Sinh Tố Bơ', 40000, 'juice', 'Sinh tố bơ với sữa tươi'),
('sinh-to-xoai', 'Sinh Tố Xoài', 38000, 'juice', 'Sinh tố xoài tươi'),
('nuoc-dua', 'Nước Dừa Tươi', 25000, 'juice', 'Nước dừa tươi mát'),
('da-chanh', 'Đá Chanh', 20000, 'juice', 'Nước chanh đá'),

-- Snacks & Cakes
('banh-mi', 'Bánh Mì Thịt Nướng', 25000, 'snacks', 'Bánh mì với thịt nướng'),
('banh-croissant', 'Bánh Croissant', 35000, 'snacks', 'Bánh croissant bơ'),
('banh-tiramisu', 'Bánh Tiramisu', 45000, 'snacks', 'Bánh tiramisu Ý'),
('banh-cheesecake', 'Bánh Cheesecake', 50000, 'snacks', 'Bánh cheesecake New York'),

-- Food
('com-ga', 'Cơm Gà Xối Mỡ', 65000, 'food', 'Cơm gà Hải Nam'),
('bun-bo', 'Bún Bò Huế', 55000, 'food', 'Bún bò Huế cay'),
('pho-bo', 'Phở Bò', 60000, 'food', 'Phở bò Hà Nội'),
('mi-quang', 'Mì Quảng', 58000, 'food', 'Mì Quảng đặc sản')
ON CONFLICT (id) DO NOTHING;
