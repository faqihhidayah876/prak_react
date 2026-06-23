-- ============================================================
-- FIX: Create missing profiles for existing users
-- Run this if you created users BEFORE the trigger was active
-- ============================================================

-- Insert missing profiles for any auth user that doesn't have one
INSERT INTO public.profiles (id, email, full_name, role, points, tier)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1), 'User'),
  'member',
  0,
  'bronze'
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Set admin role for specific user (GANTI EMAIL INI!)
-- ============================================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'faqih@gmail.com';