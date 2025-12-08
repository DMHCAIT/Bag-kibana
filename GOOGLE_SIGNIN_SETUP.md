# Google Sign-In Setup Guide

## ✅ Code is Ready - Just Need Google Client ID

The real Google Sign-In is now implemented! You just need to get your Google OAuth credentials.

## Steps to Enable Real Google Sign-In:

### 1. **Go to Google Cloud Console**
Visit: https://console.cloud.google.com/

### 2. **Create/Select Project**
- Click "Select a project" at the top
- Click "New Project"
- Name: "Kibana Lifestyle" (or any name)
- Click "Create"

### 3. **Enable Google APIs**
- In the left sidebar, go to: **APIs & Services** → **Library**
- Search for: "Google+ API" or "Google Identity Services"
- Click on it and press **"Enable"**

### 4. **Create OAuth Credentials**
- Go to: **APIs & Services** → **Credentials**
- Click: **"+ CREATE CREDENTIALS"**
- Select: **"OAuth client ID"**

### 5. **Configure OAuth Consent Screen** (if asked)
- User Type: **External**
- Click **"Create"**
- Fill in:
  - App name: **Kibana Lifestyle**
  - User support email: **your email**
  - Developer contact: **your email**
- Click **"Save and Continue"**
- Skip "Scopes" → Click **"Save and Continue"**
- Skip "Test users" → Click **"Save and Continue"**

### 6. **Create Web Application Credentials**
Back at Credentials page:
- Application type: **Web application**
- Name: **Kibana Web Client**

**Authorized JavaScript origins:**
```
http://localhost:3000
https://kibanalife.com
https://www.kibanalife.com
https://kibana-homepage.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000
https://kibanalife.com
https://www.kibanalife.com
https://kibana-homepage.vercel.app
```

- Click **"Create"**

### 7. **Copy Your Client ID**
You'll see a popup with:
- **Client ID**: Something like `123456789-abc123xyz.apps.googleusercontent.com`
- **Client Secret**: (you don't need this for our implementation)

**Copy the Client ID!**

### 8. **Add Client ID to Your Project**

**For LOCAL development:**
Edit `.env.local` file and replace:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
```

**For VERCEL deployment:**
1. Go to: https://vercel.com/dmhcait/kibana-homepage/settings/environment-variables
2. Add new environment variable:
   - **Key**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value**: Your Client ID from Google
   - **Environment**: Production, Preview, Development (check all)
3. Click **"Save"**
4. Redeploy your site (or Vercel will auto-redeploy)

### 9. **Test It!**
- Go to your sign-in page
- Click "Continue with Google"
- **Google popup will appear**
- Select your Google account
- After signing in, it will:
  - Get your **real Gmail address**
  - Get your **real name** from Google
  - Get your **profile picture**
  - Auto-create account and log you in

## What's Different Now:

### ❌ Before (Mock):
- Created fake email like `user1234567@gmail.com`
- Used "Google User" as name
- No real Google authentication

### ✅ After (Real):
- **Real Google OAuth popup**
- Gets **actual Gmail address**
- Gets **actual name** from Google account
- Gets **profile picture** from Google
- User can choose which Google account to use
- Secure authentication

## Features:
- ✅ Real Google Sign-In popup
- ✅ Fetches actual user data from Google
- ✅ Works on all devices (desktop, mobile)
- ✅ No password needed
- ✅ Secure OAuth 2.0 flow
- ✅ Profile picture support

## Troubleshooting:

**"Popup closed" error:**
- Make sure popup blockers are disabled
- Check that your domain is in Authorized JavaScript origins

**"redirect_uri_mismatch" error:**
- Add your exact URL to Authorized redirect URIs in Google Console
- Include both http and https versions

**Client ID not found:**
- Make sure environment variable is set in both local and Vercel
- Restart development server after adding env variable
- Redeploy on Vercel after adding env variable

## Need Help?
If you get stuck, let me know which step!
