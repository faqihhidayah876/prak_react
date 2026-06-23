-- ============================================================
-- FIX: Fungsi is_admin() yang benar
-- 
-- Masalah sebelumnya: Membaca role dari JWT claims, tapi
-- Supabase tidak menyimpan 'role' di JWT secara default.
-- Akibatnya is_admin() selalu return false.
--
-- Solusi: Gunakan SECURITY DEFINER + query ke tabel profiles
-- langsung. Karena SECURITY DEFINER, fungsi ini berjalan
-- dengan hak akses pembuat fungsi (bukan user), jadi TIDAK
-- akan kena recursive RLS.
-- ============================================================

-- Hapus fungsi lama (CASCADE untuk hapus policy yang bergantung padanya)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Buat fungsi baru yang benar
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Hapus policy lama (di-drop dulu biar bersih)
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

-- Buat ulang semua policy
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin())
  WITH CHECK (is_admin() OR auth.uid() = id);

CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_admin" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (is_admin());

CREATE POLICY "orders_select_own_or_admin" ON orders
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT WITH CHECK (NOT is_admin() AND user_id = auth.uid());

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE USING (is_admin());

CREATE POLICY "order_items_select_own_or_admin" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    AND NOT is_admin()
  );

-- ============================================================
-- FIX: Stored procedure untuk decrement stock
-- (dipakai oleh createOrderWithItems)
-- ============================================================
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id uuid, quantity int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - quantity)
  WHERE id = product_id;
END;
$$;