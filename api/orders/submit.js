import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template for restaurant notification
function createRestaurantEmail(order) {
  const itemsList = order.items
    .map(
      (item) =>
        `<li style="margin-bottom: 10px;">
          <strong>${item.name}</strong> x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
          ${item.selectedOptions ? `<br/><small style="color: #666;">${formatOptions(item.selectedOptions)}</small>` : ''}
        </li>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Order - Hilltop Pub and Grill</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0a4f39; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">🔔 New Order Received!</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0a4f39; margin-top: 0;">Order #${order.orderNumber}</h2>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #0a4f39;">Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${order.customer.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${order.customer.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.customer.phone}</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #0a4f39;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
            ${order.orderType === 'delivery' ? `<p style="margin: 5px 0;"><strong>Address:</strong> ${order.deliveryAddress}</p>` : ''}
            ${order.notes ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${order.notes}</p>` : ''}
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #0a4f39;">Items Ordered</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              ${itemsList}
            </ul>
          </div>

          <div style="background-color: #0a4f39; color: white; padding: 15px; border-radius: 6px; text-align: right;">
            <p style="margin: 5px 0;">Subtotal: $${order.subtotal.toFixed(2)}</p>
            ${order.orderType === 'delivery' ? `<p style="margin: 5px 0;">Delivery Fee: $${order.deliveryFee.toFixed(2)}</p>` : ''}
            <p style="margin: 5px 0;">Tax: $${order.tax.toFixed(2)}</p>
            <h2 style="margin: 10px 0 0 0; font-size: 24px;">Total: $${order.total.toFixed(2)}</h2>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <strong>⚠️ Payment Status:</strong> Payment on ${order.orderType === 'delivery' ? 'delivery' : 'pickup'}
          </div>
        </div>
      </body>
    </html>
  `;
}

// Email template for customer confirmation
function createCustomerEmail(order) {
  const itemsList = order.items
    .map(
      (item) =>
        `<li style="margin-bottom: 10px;">
          <strong>${item.name}</strong> x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
          ${item.selectedOptions ? `<br/><small style="color: #666;">${formatOptions(item.selectedOptions)}</small>` : ''}
        </li>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Hilltop Pub and Grill</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0a4f39; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">✅ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your order, ${order.customer.name}!</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0a4f39; margin-top: 0;">Order #${order.orderNumber}</h2>

          <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #28a745;">
            <strong>Estimated ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time:</strong> ${order.estimatedTime} minutes
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #0a4f39;">Order Details</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              ${itemsList}
            </ul>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px; text-align: right;">
            <p style="margin: 5px 0;">Subtotal: $${order.subtotal.toFixed(2)}</p>
            ${order.orderType === 'delivery' ? `<p style="margin: 5px 0;">Delivery Fee: $${order.deliveryFee.toFixed(2)}</p>` : ''}
            <p style="margin: 5px 0;">Tax: $${order.tax.toFixed(2)}</p>
            <h2 style="margin: 10px 0 0 0; font-size: 24px; color: #0a4f39;">Total: $${order.total.toFixed(2)}</h2>
          </div>

          ${order.orderType === 'delivery'
            ? `<div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; color: #0a4f39;">Delivery Address</h3>
                <p style="margin: 5px 0;">${order.deliveryAddress}</p>
              </div>`
            : `<div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; color: #0a4f39;">Pickup Location</h3>
                <p style="margin: 5px 0;">Hilltop Pub and Grill</p>
                <p style="margin: 5px 0;">4901 Main St., Stevens Point, WI 54481</p>
                <p style="margin: 5px 0;">(715) 341-3037</p>
              </div>`
          }

          ${order.notes ? `<div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #0a4f39;">Special Instructions</h3>
            <p style="margin: 5px 0;">${order.notes}</p>
          </div>` : ''}

          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Questions about your order? Call us at (715) 341-3037</p>
            <p style="margin-top: 15px;">
              <a href="https://hilltoppubandgrill.com" style="color: #0a4f39; text-decoration: none;">hilltoppubandgrill.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper to format selected options
function formatOptions(selectedOptions) {
  return Object.entries(selectedOptions)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HT${timestamp}${random}`;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderData = req.body;

    // Create order object with generated order number and timestamp
    const order = {
      ...orderData,
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Send email to restaurant
    const restaurantEmail = await resend.emails.send({
      from: 'Hilltop Orders <orders@resend.dev>', // Update with your verified domain
      to: process.env.RESTRAUNT_EMAIL || 'orders@hilltoppubandgrill.com',
      subject: `🔔 New ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order #${order.orderNumber}`,
      html: createRestaurantEmail(order),
    });

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: 'Hilltop Pub and Grill <noreply@resend.dev>', // Update with your verified domain
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNumber} - Hilltop Pub and Grill`,
      html: createCustomerEmail(order),
    });

    // Return success with order details
    return res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        estimatedTime: order.estimatedTime,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({
      error: 'Failed to process order',
      message: error.message,
    });
  }
}
