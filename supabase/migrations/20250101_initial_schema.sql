-- ============================================================
-- SCHEMA: E-Commerce Backend - Sedap Admin Dashboard
-- WARNING: Execute this SQL in Supabase SQL Editor
-- ============================================================

-- 0. EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABEL profiles (relasi 1-to-1 dengan auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text NOT NULL,
  role        text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  points      integer DEFAULT 0,
  tier        text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 2. TABEL products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  description text,
  price       numeric NOT NULL,
  stock       integer NOT NULL DEFAULT 0,
  image_url   text,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 3. TABEL orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid NOT NULL REFERENCES profiles(id),
  total_amount        numeric NOT NULL,
  discount_percentage integer NOT NULL,
  final_amount        numeric NOT NULL,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at          timestamptz DEFAULT now()
);

-- ============================================================
-- 4. TABEL order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES products(id),
  quantity    integer NOT NULL,
  unit_price  numeric NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 5. TRIGGER: Auto-create profile saat user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, points, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    'member',
    0,
    'bronze'
  );
  RETURN NEW;
END;
$$;

-- Hapus trigger lama jika ada, lalu buat ulang
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 6a. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6b. RLS: profiles
-- Member hanya bisa melihat dirinya sendiri, admin lihat semua
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member bisa update dirinya (kecuali role, points, tier), admin bisa update semua
CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    -- Jika member update dirinya, jangan izinkan ubah role/points/tier
    CASE
      WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN TRUE
      WHEN auth.uid() = id THEN (
        -- Hanya izinkan update kolom tertentu (full_name, email)
        -- Kolom role, points, tier tidak boleh diubah oleh member
        (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid())) AND
        (points IS NULL OR points = (SELECT points FROM profiles WHERE id = auth.uid())) AND
        (tier IS NULL OR tier = (SELECT tier FROM profiles WHERE id = auth.uid()))
      )
      ELSE FALSE
    END
  );

-- 6c. RLS: products
-- Semua orang bisa SELECT (publik)
CREATE POLICY "products_select_public" ON products
  FOR SELECT
  USING (true);

-- Hanya admin bisa INSERT
CREATE POLICY "products_insert_admin" ON products
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Hanya admin bisa UPDATE
CREATE POLICY "products_update_admin" ON products
  FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Hanya admin bisa DELETE
CREATE POLICY "products_delete_admin" ON products
  FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 6d. RLS: orders
-- Member lihat pesanan sendiri, admin lihat semua
CREATE POLICY "orders_select_own_or_admin" ON orders
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member bisa INSERT (user_id harus dirinya sendiri)
CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'member'
    AND
    user_id = auth.uid()
  );

-- Hanya admin bisa UPDATE status
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 6e. RLS: order_items
-- Member lihat item pesanan sendiri, admin lihat semua
CREATE POLICY "order_items_select_own_or_admin" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member bisa INSERT (hanya untuk order miliknya)
CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'member'
  );

-- ============================================================
-- 7. SEED DATA (Opsional) - Akun Admin & Produk Awal
-- ============================================================
-- CATATAN: Untuk akun admin, buat user dulu via Supabase Auth UI / API,
-- lalu update role manual:
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin@sedap.com';
--
-- Atau jalankan setelah user dibuat:
--    INSERT INTO profiles (id, email, full_name, role)
--    VALUES ('UUID_USER_DARI_AUTH', 'admin@sedap.com', 'Admin Sedap', 'admin')
--    ON CONFLICT (id) DO UPDATE SET role = 'admin';