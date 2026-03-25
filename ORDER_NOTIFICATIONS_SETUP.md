# Order Notification System Setup

This guide will help you set up the email notification system for Hilltop Pub and Grill's online ordering app.

## Overview

When customers place orders, the system automatically:
1. Sends an email to the restaurant with full order details
2. Sends a confirmation email to the customer
3. Stores the order information

## Prerequisites

- Vercel account (for deployment)
- Resend account (for sending emails)

## Step 1: Get a Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up for a free account
2. Once logged in, navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name like "Hilltop Ordering App"
5. Copy the API key (starts with `re_...`)
   - ⚠️ Save this key somewhere safe - you won't be able to see it again!

### Resend Free Tier Limits
- 100 emails per day
- 3,000 emails per month
- Perfect for testing and small-scale deployment

## Step 2: Configure Environment Variables in Vercel

### Via Vercel Dashboard:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `ordering-app` project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar
5. Add the following variables:

   **Variable 1:**
   - Key: `RESEND_API_KEY`
   - Value: `re_your_actual_api_key_here` (paste your Resend API key)
   - Environments: Select **Production**, **Preview**, and **Development**

   **Variable 2:**
   - Key: `RESTAURANT_EMAIL`
   - Value: `orders@hilltoppubandgrill.com` (or whichever email should receive orders)
   - Environments: Select **Production**, **Preview**, and **Development**

6. Click **Save** for each variable

### Via Vercel CLI (Alternative):

```bash
vercel env add RESEND_API_KEY
# Paste your Resend API key when prompted

vercel env add RESTAURANT_EMAIL
# Enter the restaurant's email when prompted
```

## Step 3: Local Development Setup

For testing locally, create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your actual values:
RESEND_API_KEY=re_your_actual_api_key_here
RESTAURANT_EMAIL=orders@hilltoppubandgrill.com
```

⚠️ **Important:** Never commit `.env.local` to git - it's already in `.gitignore`

## Step 4: Verify Email Domain (Optional but Recommended)

For production use, you should verify a custom domain with Resend:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `hilltoppubandgrill.com`)
4. Add the provided DNS records to your domain registrar
5. Wait for verification (usually takes a few minutes to hours)

Once verified, update the email sender addresses in `/api/orders/submit.js`:
```javascript
from: 'orders@hilltoppubandgrill.com'  // Instead of orders@resend.dev
```

### Benefits of Domain Verification:
- Professional sender addresses
- Better email deliverability
- No "via resend.dev" label in emails
- Higher sending limits

## Step 5: Redeploy to Vercel

After adding environment variables, you need to redeploy:

```bash
git add .
git commit -m "Add order notification system"
git push origin main
```

Or manually trigger a redeploy in Vercel dashboard:
1. Go to your project
2. Click **Deployments**
3. Click the **⋮** menu on the latest deployment
4. Click **Redeploy**

## Testing the Order Flow

### 1. Test Locally

```bash
npm run dev
```

1. Add items to cart
2. Go to checkout
3. Fill in all required information
4. Use a real email address you can check
5. Submit the order
6. Check both emails:
   - Restaurant should receive order details
   - Customer should receive confirmation

### 2. Test in Production

1. Visit your deployed Vercel URL
2. Place a test order
3. Verify emails are received

## Troubleshooting

### Emails Not Sending

1. **Check Vercel Logs:**
   ```bash
   vercel logs --follow
   ```
   Or in dashboard: Project → Deployments → [Latest] → Functions tab

2. **Verify Environment Variables:**
   ```bash
   vercel env ls
   ```

3. **Check Resend Dashboard:**
   - Go to [https://resend.com/emails](https://resend.com/emails)
   - View sent emails and delivery status
   - Check for any errors

### Common Issues

**"API key not found"**
- Make sure `RESEND_API_KEY` is set in Vercel environment variables
- Redeploy after adding variables

**"Email failed to send"**
- Check that the recipient email is valid
- For unverified domains, you can only send to addresses you've verified in Resend

**"Rate limit exceeded"**
- Free tier: 100 emails/day, 3,000/month
- Consider upgrading Resend plan for production

## Email Templates

The system sends beautifully formatted HTML emails:

### Restaurant Notification Email Includes:
- Order number
- Customer information (name, email, phone)
- Order type (pickup/delivery)
- Delivery address (if applicable)
- All ordered items with quantities and customizations
- Special instructions/notes
- Complete pricing breakdown
- Payment status notice

### Customer Confirmation Email Includes:
- Order number
- Estimated pickup/delivery time
- Order summary
- Total cost breakdown
- Pickup location or delivery confirmation
- Special instructions
- Restaurant contact information

## Next Steps

1. **Set up a dedicated email:** Create `orders@hilltoppubandgrill.com` for receiving orders
2. **Mobile notifications:** Consider adding SMS alerts via Twilio for instant notifications
3. **Order management:** Build a dashboard for restaurant staff to view and manage orders
4. **Email monitoring:** Regularly check Resend dashboard for delivery issues

## Support

- **Resend Documentation:** [https://resend.com/docs](https://resend.com/docs)
- **Vercel Environment Variables:** [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)

---

**Need help?** Contact the development team or check the Resend/Vercel documentation linked above.
