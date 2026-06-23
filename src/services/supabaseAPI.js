import { supabase } from "../lib/supabase";

// ========================================================
// PROFILES (Customers)
// ========================================================
export const profilesAPI = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(profile) {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================================
// PRODUCTS
// ========================================================
export const productsAPI = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async fetchById(id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(product) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ========================================================
// ORDERS
// ========================================================
export const ordersAPI = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name))")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async fetchById(id) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name))")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ========================================================
// TIER & DISCOUNT UTILITY
// ========================================================
export const TIER_DISCOUNTS = {
  bronze: 5,
  silver: 10,
  gold: 15,
  platinum: 20,
};

/**
 * Menentukan tier berdasarkan akumulasi poin.
 * Bronze: 0-99, Silver: 100-299, Gold: 300-599, Platinum: 600+
 */
export function determineTier(points) {
  if (points >= 600) return "platinum";
  if (points >= 300) return "gold";
  if (points >= 100) return "silver";
  return "bronze";
}

/**
 * Menghitung final amount setelah diskon berdasarkan tier user
 */
export function calculateFinalAmount(totalAmount, tier) {
  const discount = TIER_DISCOUNTS[tier] || 0;
  const discountAmount = Math.round((totalAmount * discount) / 100);
  return {
    totalAmount,
    discountPercentage: discount,
    discountAmount,
    finalAmount: totalAmount - discountAmount,
  };
}

/**
 * Membuat pesanan baru (Create Order) dengan perhitungan diskon otomatis
 */
export async function createOrderWithItems(userId, tier, items) {
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  // Hitung total amount dari items
  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of items) {
    // Ambil harga produk dari database
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .select("price, name")
      .eq("id", item.product_id)
      .single();

    if (prodErr || !product) {
      throw new Error(`Product ${item.product_id} not found`);
    }

    // Cek stock
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    const lineTotal = Number(product.price) * item.quantity;
    totalAmount += lineTotal;

    orderItemsData.push({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(product.price),
    });
  }

  // Hitung diskon berdasarkan tier
  const { discountPercentage, finalAmount } = calculateFinalAmount(
    totalAmount,
    tier
  );

  // Kurangi stok produk via RPC function
  for (const item of items) {
    try {
      await supabase.rpc("decrement_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    } catch (stockErr) {
      console.error("Stock decrement error (fallback):", stockErr);
      // Fallback: decrement stock manually
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (product) {
        await supabase
          .from("products")
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq("id", item.product_id);
      }
    }
  }

  // Buat order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      discount_percentage: discountPercentage,
      final_amount: finalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (orderErr) throw orderErr;

  // Buat order_items
  const itemsWithOrderId = orderItemsData.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsErr) throw itemsErr;

  // Update poin user (1 poin per Rp 1000 belanja)
  const pointsEarned = Math.floor(totalAmount / 1000);
  const { data: profile } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();

  if (profile) {
    const newPoints = (profile.points || 0) + pointsEarned;
    const newTier = determineTier(newPoints);

    await supabase
      .from("profiles")
      .update({ points: newPoints, tier: newTier })
      .eq("id", userId);
  }

  return { order, orderItems: itemsWithOrderId, pointsEarned };
}