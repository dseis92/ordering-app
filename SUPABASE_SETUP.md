# Supabase Setup Guide

Follow these steps to set up the Supabase database for Hilltop Pub and Grill.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

## Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `hilltop-ordering`
   - **Database Password**: (create a strong password - save this!)
   - **Region**: Choose closest to Stevens Point, WI (US East or US Central)
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 3: Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** button (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - that's correct!

## Step 4: Create Admin User

1. Go to **"Authentication"** > **"Users"** in the left sidebar
2. Click **"Add user"** > **"Create new user"**
3. Fill in:
   - **Email**: `admin@hilltoppubandgrill.com`
   - **Password**: (create a strong password - this is for admin login!)
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

## Step 5: Get API Keys

1. Go to **"Project Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 6: Add Environment Variables

1. In this project, create a file called `.env.local` (if it doesn't exist)
2. Add these lines (replace with your actual values):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 7: Update Vercel Environment Variables

1. Go to your Vercel dashboard
2. Click on your `ordering-app` project
3. Go to **Settings** > **Environment Variables**
4. Add two variables:
   - **Name**: `VITE_SUPABASE_URL`, **Value**: (your Supabase URL)
   - **Name**: `VITE_SUPABASE_ANON_KEY`, **Value**: (your anon key)
5. Click **"Save"**

## Step 8: Verify Setup

1. Restart your development server (`npm run dev`)
2. Check browser console - no Supabase errors should appear
3. Try creating a test order - it should save to the database!
4. Check Supabase dashboard > **"Table Editor"** > **"orders"** - your order should appear!

## What's Now Working

✅ **Orders** - Saved to central database, visible to all admins
✅ **Menu Management** - Changes apply to all customers instantly
✅ **Admin Auth** - Secure authentication through Supabase
✅ **Sold-Out Status** - Real-time updates across all devices
✅ **Order History** - Synced across devices (by email)
✅ **Loyalty Points** - Synced across devices (by email)

## Troubleshooting

**Can't connect to Supabase?**
- Check that `.env.local` file exists and has correct values
- Restart dev server after adding environment variables
- Check browser console for specific error messages

**Orders not appearing in database?**
- Check that RLS policies are enabled (they're in the SQL schema)
- Verify anon key is correct
- Check Supabase logs: Dashboard > Logs

**Admin can't log in?**
- Make sure you created the admin user in Step 4
- Use the email and password from Step 4 (not the database password!)
- Check that admin_users table has the entry

## Database Access

To view your data:
1. Supabase Dashboard > **"Table Editor"**
2. Click any table to see all records
3. You can manually edit data here if needed

## Security Notes

- The `anon` key is safe to expose in frontend code
- Never commit `.env.local` to git (it's in `.gitignore`)
- Supabase RLS (Row Level Security) protects your data
- Admin authentication is handled securely by Supabase Auth
