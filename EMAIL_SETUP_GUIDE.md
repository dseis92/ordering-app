# Email Notifications Setup Guide

This guide explains how to set up email notifications for order confirmations and status updates.

## Option 1: Supabase Edge Function + Resend (Recommended)

### Prerequisites
- Supabase account
- Resend account (https://resend.com/signup)
- Supabase CLI installed

### Step 1: Get Resend API Key

1. Sign up at https://resend.com/signup
2. Go to **API Keys** in the dashboard
3. Create a new API key
4. Copy the key (starts with `re_`)

### Step 2: Create Supabase Edge Function

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Create the edge function:
   ```bash
   supabase functions new send-email
   ```

5. Replace the contents of `supabase/functions/send-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();

    let subject = "";
    let html = "";

    if (type === "order_confirmation") {
      subject = `Order Confirmation #${data.orderNumber}`;
      html = generateOrderConfirmationHTML(data);
    } else if (type === "order_status_update") {
      subject = `Order Update #${data.orderNumber}`;
      html = generateStatusUpdateHTML(data);
    } else {
      throw new Error("Invalid email type");
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Hilltop Pub and Grill <orders@yourdomain.com>",
        to: [to],
        subject,
        html,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: resData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

function generateOrderConfirmationHTML(data) {
  // Copy the HTML generation logic from src/services/email.js
  // (See the generateOrderConfirmationHTML function)
  return \`Your order confirmation email HTML here\`;
}

function generateStatusUpdateHTML(data) {
  // Copy the HTML generation logic from src/services/email.js
  // (See the generateStatusUpdateHTML function)
  return \`Your status update email HTML here\`;
}
```

### Step 3: Set Environment Variables

1. Set the Resend API key in Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_api_key_here
   ```

### Step 4: Deploy the Edge Function

```bash
supabase functions deploy send-email
```

### Step 5: Verify Your Domain in Resend

1. Go to Resend dashboard → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records they provide to your domain
4. Wait for verification (usually a few minutes)

### Step 6: Update the From Address

In the edge function code, change:
```typescript
from: "Hilltop Pub and Grill <orders@yourdomain.com>",
```

To your verified domain email.

## Option 2: Direct Email API (Alternative)

If you prefer not to use Supabase Edge Functions, you can use a backend API:

1. Create a serverless function (Vercel, Netlify, etc.)
2. Use Resend or SendGrid SDK
3. Update `src/services/email.js` to call your API endpoint

Example Vercel serverless function (`api/send-email.js`):

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, to, data } = req.body;

  try {
    const emailData = await resend.emails.send({
      from: 'orders@yourdomain.com',
      to: [to],
      subject: type === 'order_confirmation'
        ? `Order Confirmation #${data.orderNumber}`
        : `Order Update #${data.orderNumber}`,
      html: generateEmailHTML(type, data),
    });

    res.status(200).json({ success: true, data: emailData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

## Testing Emails

1. Place a test order on your site
2. Check the browser console for email sending logs
3. Check your email inbox for the confirmation
4. Update the order status from the admin dashboard
5. Check for status update emails

## Troubleshooting

### Emails not sending:
- Check Supabase function logs: `supabase functions logs send-email`
- Verify Resend API key is set correctly
- Check domain verification in Resend
- Ensure CORS headers are set properly

### Emails going to spam:
- Verify your domain in Resend
- Add SPF and DKIM records
- Start with a verified email address for testing

### Edge function errors:
- Check the function logs in Supabase dashboard
- Verify the edge function is deployed
- Test with curl to isolate issues

## Production Checklist

- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] API key added to Supabase secrets
- [ ] Edge function deployed
- [ ] Test order confirmation email
- [ ] Test status update emails
- [ ] Update "from" email address to your domain
- [ ] Add unsubscribe link (if needed)
- [ ] Set up email analytics in Resend
