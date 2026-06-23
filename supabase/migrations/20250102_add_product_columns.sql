-- ============================================================
-- ADD missing columns: category & brand to products table
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text;

-- ============================================================
-- SEED DATA: Produk Awal untuk Testing
-- ============================================================
INSERT INTO products (name, description, price, stock, category, brand)
VALUES
  ('Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam suwir, dan kerupuk', 45000, 50, 'Makanan', 'Sedap Kitchen'),
  ('Mie Ayam Bakso', 'Mie ayam dengan bakso sapi dan pangsit', 35000, 40, 'Makanan', 'Sedap Kitchen'),
  ('Es Teh Manis', 'Teh manis segar dengan es batu', 8000, 100, 'Minuman', 'Sedap Beverages'),
  ('Es Jeruk', 'Jus jeruk peras segar', 12000, 80, 'Minuman', 'Sedap Beverages'),
  ('Ayam Bakar Madu', 'Ayam bakar dengan bumbu madu special', 55000, 30, 'Makanan', 'Sedap Kitchen'),
  ('Es Campur', 'Es campur dengan berbagai topping', 18000, 60, 'Minuman', 'Sedap Beverages'),
  ('Pisang Goreng', 'Pisang goreng crispy dengan topping coklat', 15000, 70, 'Cemilan', 'Sedap Snacks'),
  ('Kentang Goreng', 'Kentang goreng crispy dengan saus sambal', 20000, 65, 'Cemilan', 'Sedap Snacks'),
  ('Nasi Uduk', 'Nasi uduk komplit dengan lauk pauk', 40000, 35, 'Makanan', 'Sedap Kitchen'),
  ('Sate Ayam', 'Sate ayam dengan bumbu kacang', 50000, 25, 'Makanan', 'Sedap Kitchen');