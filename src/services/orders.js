import { supabase } from '../lib/supabase';

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `HT${timestamp}${random}`;
}

// Create a new order
export async function createOrder(orderData) {
  const orderNumber = generateOrderNumber();

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        order_number: orderNumber,
        order_type: orderData.orderType,
        status: 'received',
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        delivery_address: orderData.deliveryAddress || null,
        items: orderData.items,
        notes: orderData.notes || null,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        delivery_fee: orderData.deliveryFee || 0,
        total: orderData.total,
        estimated_time: orderData.estimatedTime,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all orders
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get orders by customer email
export async function getOrdersByEmail(email) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  const updates = {
    status,
    updated_at: new Date().toISOString(),
  };

  // If marking as completed, set completed_at
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('order_number', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Subscribe to real-time order updates
export function subscribeToOrders(callback) {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
