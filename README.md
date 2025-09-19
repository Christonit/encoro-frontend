# Encoro Frontend

Encoro  event management platform built with Next.js, featuring event discovery, business profiles, and social networking capabilities.

## 🚀 Features

- **Event Discovery**: Browse events by categories (Music, Art, Nightlife, Gastronomy, Tourism, Wellness, Education, Entertainment, Sports)
- **Business Profiles**: Create and manage business profiles with custom schedules and social links
- **User Authentication**: Secure login with Google and Facebook OAuth
- **Event Management**: Create, edit, and manage events with media uploads
- **Location Services**: City-based event filtering and location autocomplete
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Analytics**: PostHog integration for user behavior tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with React 19
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: NextAuth.js with OAuth providers
- **Styling**: Tailwind CSS 4 with SCSS
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Analytics**: PostHog
- **Image Optimization**: Next.js Image component
- **Form Handling**: Formik with Yup validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd encoro-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=encoro_database
DB_HOSTNAME=localhost
DB_PORT=5432

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# API Configuration
NEXT_PUBLIC_SERVER_ADDRESS=http://localhost:3000/api

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Environment
ENV=development
```

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE encoro_database;

# Create user (optional)
CREATE USER encoro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE encoro_database TO encoro_user;
```

#### Run Database Migrations

```bash
# Run migrations to create tables
npx sequelize-cli db:migrate

# (Optional) Seed the database with sample data
npx sequelize-cli db:seed:all
```

### 5. OAuth Provider Setup

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

#### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and App Secret to your `.env.local`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```


## 📁 Project Structure

```
encoro-frontend/
├── database/                 # Database configuration and migrations
│   ├── config.mjs           # Database connection config
│   ├── connection.js        # Sequelize connection
│   ├── migrations/          # Database migrations
│   ├── models/              # Sequelize models
│   └── seeders/             # Database seeders
├── public/                  # Static assets
│   ├── images/             # Image assets
│   └── icons/              # Icon assets
├── src/
│   ├── components/         # React components
│   │   ├── cards/         # Card components
│   │   ├── complex/       # Complex UI components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── interfaces/        # TypeScript type definitions
│   ├── lib/               # Utility functions and API client
│   ├── pages/             # Next.js pages and API routes
│   │   ├── api/           # API routes
│   │   └── [category]/    # Dynamic category pages
│   └── styles/            # Global styles and SCSS files
├── components.json         # UI components configuration
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🗄️ Database Management

### Seeding Database

```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed 20230111051120-demo-events.js
```

## 🎨 Styling and UI

The project uses Tailwind CSS 4 with custom SCSS files. Key styling files:

- `src/styles/globals.css` - Global styles and Tailwind imports
- `src/styles/app.scss` - Custom SCSS styles
- `src/styles/components/` - Component-specific styles

## 🔐 Authentication

The application uses NextAuth.js with the following providers:

- **Google OAuth**: For Google account login
- **Facebook OAuth**: For Facebook account login

User sessions are stored in the PostgreSQL database using Sequelize adapter.

## 📊 Analytics

PostHog is integrated for user behavior tracking and analytics. Configure the following environment variables:

- `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog instance URL (default: https://app.posthog.com)

## 🚀 Deployment

### Manual Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Configure your web server to proxy requests to port 3000

