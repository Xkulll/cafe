-- Seed tables data
INSERT INTO tables (id, name, type, capacity, floor) VALUES
('takeaway', 'Mang về', 'takeaway', NULL, NULL),
('vip1', 'Phòng VIP 1', 'vip', 6, 'Lầu 2'),
('vip2', 'Phòng VIP 2', 'vip', 6, 'Lầu 2'),
('vip3', 'Phòng VIP 3', 'vip', 6, 'Lầu 2'),
('vip4', 'Phòng VIP 4', 'vip', 6, 'Lầu 2'),
('vip5', 'Phòng VIP 5', 'vip', 6, 'Lầu 2'),
('vip6', 'Phòng VIP 6', 'vip', 6, 'Lầu 2'),
('vip7', 'Phòng VIP 7', 'vip', 6, 'Lầu 2'),
('vip8', 'Phòng VIP 8', 'vip', 6, 'Lầu 2'),
('vip9', 'Phòng VIP 9', 'vip', 6, 'Lầu 2'),
('vip10', 'Phòng VIP 10', 'vip', 6, 'Lầu 2'),
('ban1', 'Bàn 1', 'regular', 4, 'Lầu 1'),
('ban2', 'Bàn 2', 'regular', 4, 'Lầu 1'),
('ban3', 'Bàn 3', 'regular', 4, 'Lầu 1'),
('ban4', 'Bàn 4', 'regular', 4, 'Lầu 1'),
('ban5', 'Bàn 5', 'regular', 4, 'Lầu 1'),
('ban6', 'Bàn 6', 'regular', 4, 'Lầu 2'),
('ban7', 'Bàn 7', 'regular', 4, 'Lầu 1'),
('ban8', 'Bàn 8', 'regular', 4, 'Lầu 1'),
('ban9', 'Bàn 9', 'regular', 4, 'Lầu 1')
ON CONFLICT (id) DO NOTHING;
