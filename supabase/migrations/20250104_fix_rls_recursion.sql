-- ============================================================
-- FIX: Infinite recursion di RLS policy profiles
-- 
-- Masalah: (SELECT role FROM profiles WHERE id = auth.uid())
-- memicu recursive loop karena policy SELECT juga query profiles.
--
-- Solusi: Gunakan auth.jwt() untuk membaca role langsung
-- dari token JWT tanpa perlu query tabel profiles.
-- ============================================================

-- Hapus SEMUA policy yang sudah ada (termasuk yang dari migration pertama)
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;
DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin" ON products;
DROP POLICY IF EXISTS "orders_select_own_or_admin" ON orders;
DROP POLICY IF EXISTS "orders_insert_member" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
DROP POLICY IF EXISTS "order_items_select_own_or_admin" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_member" ON order_items;

-- Buat fungsi helper untuk cek role admin via JWT
-- Ini menghindari recursive loop karena tidak query ke tabel profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin',
    false
  );
$$;

-- Buat ulang policy profiles (tanpa recursive)
-- Admin bisa SELECT semua, member hanya dirinya sendiri
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR
    is_admin()
  );

-- Admin bisa UPDATE semua, member hanya update dirinya sendiri
-- (kolom role/points/tier tetap tidak bisa diubah member)
CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR
    is_admin()
  )
  WITH CHECK (
    CASE
      WHEN is_admin() THEN true
      WHEN auth.uid() = id THEN true
      ELSE false
    END
  );

-- Policy products
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_admin" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (is_admin());

-- Policy orders
CREATE POLICY "orders_select_own_or_admin" ON orders
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    is_admin()
  );

CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT
  WITH CHECK (
    NOT is_admin()
    AND
    user_id = auth.uid()
  );

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE USING (is_admin());

-- Policy order_items
CREATE POLICY "order_items_select_own_or_admin" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    OR
    is_admin()
  );

CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    AND
    NOT is_admin()
  );