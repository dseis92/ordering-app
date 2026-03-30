import { supabase } from '../lib/supabase';
import brand from '../brand.config';

// Email service using Supabase Edge Functions
// Note: This requires setting up a Supabase Edge Function for sending emails

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(order) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'order_confirmation',
        to: order.customer_email,
        data: {
          customerName: order.customer_name,
          orderNumber: order.order_number,
          orderType: order.order_type,
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          tip: order.tip || 0,
          deliveryFee: order.delivery_fee || 0,
          total: order.total,
          estimatedTime: order.estimated_time,
          deliveryAddress: order.delivery_address,
          notes: order.notes,
          restaurantName: brand.name,
          restaurantPhone: brand.phone,
          restaurantAddress: brand.address.full,
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(order) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'order_status_update',
        to: order.customer_email,
        data: {
          customerName: order.customer_name,
          orderNumber: order.order_number,
          status: order.status,
          orderType: order.order_type,
          estimatedTime: order.estimated_time,
          restaurantName: brand.name,
          restaurantPhone: brand.phone,
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error };
  }
}

/**
 * Format currency for email display
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Generate order confirmation email HTML
 */
export function generateOrderConfirmationHTML(orderData) {
  const items = typeof orderData.items === 'string'
    ? JSON.parse(orderData.items)
    : orderData.items;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a4f39; color: #ffffff; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .order-number { font-size: 24px; font-weight: bold; color: #0a4f39; text-align: center; margin: 20px 0; }
    .status-badge { background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 14px; }
    .info-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .info-label { color: #6b7280; }
    .info-value { font-weight: 600; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background-color: #0a4f39; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${orderData.restaurantName}</h1>
      <p>Thank you for your order!</p>
    </div>

    <div class="content">
      <div style="text-align: center; margin: 20px 0;">
        <span class="status-badge">✓ Order Confirmed</span>
      </div>

      <p>Hi ${orderData.customerName},</p>
      <p>We've received your order and we're getting started on it right away!</p>

      <div class="order-number">
        Order #${orderData.orderNumber}
      </div>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Order Type:</span>
          <span class="info-value" style="text-transform: capitalize;">${orderData.orderType}</span>
        </div>
        ${orderData.estimatedTime ? `
        <div class="info-row">
          <span class="info-label">Estimated ${orderData.orderType === 'pickup' ? 'Pickup' : 'Delivery'} Time:</span>
          <span class="info-value">${orderData.estimatedTime} minutes</span>
        </div>
        ` : ''}
        ${orderData.deliveryAddress ? `
        <div class="info-row">
          <span class="info-label">Delivery Address:</span>
          <span class="info-value">${orderData.deliveryAddress}</span>
        </div>
        ` : ''}
        ${orderData.orderType === 'pickup' ? `
        <div class="info-row">
          <span class="info-label">Pickup Location:</span>
          <span class="info-value">${orderData.restaurantAddress}</span>
        </div>
        ` : ''}
      </div>

      <h2>Order Details</h2>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
          <tr>
            <td>
              ${item.name}
              ${item.selectedOptions && Object.keys(item.selectedOptions).length > 0 ? `
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                  ${Object.values(item.selectedOptions).join(', ')}
                </div>
              ` : ''}
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
          </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">Subtotal</td>
            <td style="text-align: right;">${formatCurrency(parseFloat(orderData.subtotal))}</td>
          </tr>
          ${parseFloat(orderData.tip) > 0 ? `
          <tr>
            <td colspan="2">Tip</td>
            <td style="text-align: right;">${formatCurrency(parseFloat(orderData.tip))}</td>
          </tr>
          ` : ''}
          ${parseFloat(orderData.deliveryFee) > 0 ? `
          <tr>
            <td colspan="2">Delivery Fee</td>
            <td style="text-align: right;">${formatCurrency(parseFloat(orderData.deliveryFee))}</td>
          </tr>
          ` : ''}
          <tr>
            <td colspan="2">Tax</td>
            <td style="text-align: right;">${formatCurrency(parseFloat(orderData.tax))}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2">Total</td>
            <td style="text-align: right;">${formatCurrency(parseFloat(orderData.total))}</td>
          </tr>
        </tfoot>
      </table>

      ${orderData.notes ? `
      <div class="info-box">
        <strong>Special Instructions:</strong>
        <p style="margin: 8px 0 0 0;">${orderData.notes}</p>
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${window.location.origin}/orders/${orderData.orderNumber}" class="button">Track Your Order</a>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        Questions about your order?<br>
        Call us at <strong>${orderData.restaurantPhone}</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>${orderData.restaurantName}</strong></p>
      <p>${orderData.restaurantAddress}</p>
      <p>${orderData.restaurantPhone}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate order status update email HTML
 */
export function generateStatusUpdateHTML(orderData) {
  const statusMessages = {
    received: {
      title: 'Order Received',
      message: 'We\'ve received your order and will start preparing it shortly.',
      emoji: '✓',
      color: '#3b82f6',
    },
    preparing: {
      title: 'Preparing Your Order',
      message: 'Our kitchen is busy preparing your delicious food!',
      emoji: '👨‍🍳',
      color: '#f59e0b',
    },
    ready: {
      title: 'Order Ready',
      message: orderData.orderType === 'pickup'
        ? 'Your order is ready for pickup!'
        : 'Your order is ready and will be out for delivery soon!',
      emoji: '✓',
      color: '#10b981',
    },
    out_for_delivery: {
      title: 'Out for Delivery',
      message: 'Your order is on its way!',
      emoji: '🚗',
      color: '#8b5cf6',
    },
    completed: {
      title: 'Order Completed',
      message: 'Thank you for your order! We hope you enjoyed your meal.',
      emoji: '🎉',
      color: '#10b981',
    },
  };

  const status = statusMessages[orderData.status] || statusMessages.received;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0a4f39; color: #ffffff; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; text-align: center; }
    .status-icon { font-size: 64px; margin: 20px 0; }
    .status-title { font-size: 28px; font-weight: bold; color: ${status.color}; margin: 20px 0; }
    .status-message { font-size: 18px; color: #6b7280; margin: 20px 0; }
    .order-number { font-size: 20px; font-weight: bold; color: #0a4f39; margin: 20px 0; }
    .button { display: inline-block; background-color: #0a4f39; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${orderData.restaurantName}</h1>
    </div>

    <div class="content">
      <div class="status-icon">${status.emoji}</div>
      <div class="status-title">${status.title}</div>
      <div class="status-message">${status.message}</div>

      <div class="order-number">Order #${orderData.orderNumber}</div>

      ${orderData.estimatedTime && orderData.status !== 'completed' ? `
      <p style="color: #6b7280;">
        Estimated ${orderData.orderType === 'pickup' ? 'pickup' : 'delivery'} time: <strong>${orderData.estimatedTime} minutes</strong>
      </p>
      ` : ''}

      <a href="${window.location.origin}/orders/${orderData.orderNumber}" class="button">Track Your Order</a>

      <p style="margin-top: 30px; color: #6b7280;">
        Questions? Call us at <strong>${orderData.restaurantPhone}</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>${orderData.restaurantName}</strong></p>
      <p>${orderData.restaurantPhone}</p>
    </div>
  </div>
</body>
</html>
  `;
}
