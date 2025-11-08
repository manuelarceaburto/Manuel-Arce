# Crazure Consulting Website - Setup Guide

## Azure Entra SSO Configuration

### Step 1: Create an Azure App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** (now called **Microsoft Entra ID**)
3. Click on **App registrations** in the left sidebar
4. Click **New registration**
5. Fill in the following:
   - **Name**: Crazure Consulting Website
   - **Supported account types**: Choose based on your needs:
     - Single tenant (your organization only)
     - Multi-tenant (any Azure AD organization)
     - Multi-tenant + personal Microsoft accounts
   - **Redirect URI**:
     - Platform: **Single-page application (SPA)**
     - URL: `http://localhost:3000` (for development)
6. Click **Register**

### Step 2: Configure Authentication

1. After registration, go to **Authentication** in the left sidebar
2. Under **Platform configurations**, ensure your redirect URI is listed
3. Under **Implicit grant and hybrid flows**, make sure:
   - **Access tokens** is checked
   - **ID tokens** is checked
4. Click **Save**

### Step 3: Add API Permissions

1. Click on **API permissions** in the left sidebar
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add the following permission:
   - `User.Read` (should be added by default)
6. Click **Add permissions**

### Step 4: Get Your Configuration Values

1. Go to **Overview** in the left sidebar
2. Copy the following values:
   - **Application (client) ID** - This is your `NEXT_PUBLIC_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** - This is your `NEXT_PUBLIC_AZURE_TENANT_ID`

### Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-actual-client-id
   NEXT_PUBLIC_AZURE_TENANT_ID=your-actual-tenant-id
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
   ```

### Step 6: Run the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Click the "Sign in with Microsoft" button to test the authentication

## Production Deployment

When deploying to production:

1. In your Azure App Registration, add your production URL as a redirect URI:
   - Go to **Authentication** > **Add URI**
   - Add: `https://crazureconsulting.com`

2. Update your production environment variables:
   ```env
   NEXT_PUBLIC_REDIRECT_URI=https://crazureconsulting.com
   ```

## Troubleshooting

### "AADSTS50011: The redirect URI specified in the request does not match"
- Make sure the redirect URI in your Azure App Registration matches exactly with `NEXT_PUBLIC_REDIRECT_URI`
- Remember to add both development and production URLs

### "AADSTS700016: Application not found in the directory"
- Check that `NEXT_PUBLIC_AZURE_CLIENT_ID` is correct
- Verify that `NEXT_PUBLIC_AZURE_TENANT_ID` is correct

### Authentication doesn't work
- Clear your browser cache and cookies
- Check the browser console for error messages
- Verify all environment variables are set correctly

## Next Steps

After setting up authentication, you can:
- Add protected routes and pages
- Implement role-based access control
- Add more features to the dashboard
- Customize the UI/UX
- Add additional Azure services integration
