# Crazure Consulting Website

A modern, responsive website for Crazure Consulting with Azure Entra (formerly Azure AD) SSO authentication.

## Features

- **Azure Entra SSO**: Secure authentication using Microsoft's identity platform
- **Modern UI**: Built with Next.js 15, React, and Tailwind CSS
- **Responsive Design**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Client Portal**: Authenticated users can access their account information

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Microsoft Authentication Library (MSAL) for React
- **Deployment Ready**: Optimized for Vercel, Azure Static Web Apps, or any Node.js host

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- An Azure account with access to create App Registrations

### Installation

1. Clone the repository and navigate to the website directory:
   ```bash
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Azure Entra SSO (see [SETUP.md](./SETUP.md) for detailed instructions)

4. Create your `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

5. Edit `.env.local` with your Azure App Registration details

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
website/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthProvider.tsx   # MSAL authentication provider
│   ├── SignInButton.tsx   # Sign in button component
│   ├── SignOutButton.tsx  # Sign out button component
│   └── UserProfile.tsx    # User profile display
├── lib/                   # Utility functions and config
│   └── msalConfig.ts      # MSAL configuration
├── public/               # Static assets
├── .env.local.example    # Environment variables template
├── SETUP.md             # Azure SSO setup guide
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User visits the website
2. User clicks "Sign in with Microsoft"
3. MSAL redirects to Microsoft login page
4. User authenticates with their Microsoft account
5. User is redirected back to the website
6. User profile information is displayed

## Configuration

See [SETUP.md](./SETUP.md) for detailed Azure Entra SSO configuration instructions.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Azure Static Web Apps

1. Create a Static Web App in Azure Portal
2. Connect to your GitHub repository
3. Configure build settings:
   - App location: `/website`
   - Api location: (leave empty)
   - Output location: `.next`
4. Add environment variables in Configuration
5. Deploy

### Custom Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run start
   ```

## Security

- Environment variables are never committed to the repository
- Authentication tokens are stored in session storage
- All authentication is handled by Microsoft's secure platform
- HTTPS is required for production deployments

## Support

For issues or questions, please contact: contact@crazureconsulting.com

## License

© 2025 Crazure Consulting. All rights reserved.
