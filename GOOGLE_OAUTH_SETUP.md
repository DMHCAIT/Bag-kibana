# Google OAuth Setup Guide

This guide will help you enable Google Sign-In for your Kibana e-commerce website.

## Step 1: Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to enable it
4. You'll need to get credentials from Google Cloud Console first

## Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. If prompted, configure the OAuth consent screen first:
   - User Type: **External**
   - App name: **Kibana Life**
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email` and `profile`
   - Add test users if in testing mode

6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Kibana Life Web**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - Authorized redirect URIs:
     ```
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```
   
7. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Supabase with Google Credentials

1. Back in Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste your **Client ID** from Google
4. Paste your **Client Secret** from Google
5. Click **Save**

## Step 4: Update Site URL (Important!)

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

## Step 5: Test the Integration

### Local Testing
1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/signin
3. Click "Continue with Google"
4. You should be redirected to Google sign-in
5. After signing in, you should be redirected back to /account

### Production Testing
1. Deploy your code to production (Vercel)
2. Make sure the environment variables are set in Vercel
3. Test the Google sign-in flow

## Environment Variables

Make sure these are set in your `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Files Modified

- ✅ `contexts/AuthContext.tsx` - Added Supabase Google OAuth support
- ✅ `app/signin/page.tsx` - Updated Google sign-in button
- ✅ `app/auth/callback/route.ts` - Created OAuth callback handler

## User Flow

1. User clicks "Continue with Google" on signin page
2. User is redirected to Google sign-in
3. User authorizes the app
4. Google redirects back to `/auth/callback?code=...`
5. Callback handler exchanges code for session
6. User is redirected to `/account` page
7. AuthContext syncs with Supabase session
8. User is logged in

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure the redirect URI in Google Cloud Console matches exactly
- Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- No trailing slashes

### Google sign-in doesn't redirect back
- Check Supabase Site URL is set correctly
- Check Redirect URLs include your domain
- Check browser console for errors

### User not appearing in Supabase
- Go to Supabase Dashboard → **Authentication** → **Users**
- Check if user was created
- If not, check the logs in Dashboard → **API** → **Logs**

## Security Notes

1. **Never commit** `.env.local` file to git
2. Keep your Google Client Secret secure
3. Use environment variables in production (Vercel)
4. Regularly rotate your API keys

## Additional Features

Once Google OAuth is working, you can:
- Get user's profile picture: `session.user.user_metadata.avatar_url`
- Pre-fill user details in checkout
- Sync user data with your orders table
- Enable other OAuth providers (Facebook, Apple, etc.)

## Support

- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
