-- Fix ID columns to use UUID with default generation
-- This will ensure all ID fields are properly generated automatically

-- Update orders table
ALTER TABLE orders ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update order_items table  
ALTER TABLE order_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update payments table
ALTER TABLE payments ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update tables table
ALTER TABLE tables ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update menu_items table
ALTER TABLE menu_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- For existing records without IDs, generate them
UPDATE orders SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE order_items SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE payments SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE tables SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE menu_items SET id = gen_random_uuid() WHERE id IS NULL;
