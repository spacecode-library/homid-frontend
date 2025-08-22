# Hom.ID Frontend

A professional React.js frontend for the Hom.ID platform - turning complex affiliate links into simple 8-digit codes.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Features Implemented

### 1. **Public Pages**
- **Landing Page** (`/`): Hero section with gradient backgrounds, feature showcase, and CTA
- **Search Page** (`/search`): Interactive keypad for entering Hom.IDs with search history
- **Login** (`/login`): Split-screen design with form validation
- **Register** (`/register`): User type selection (End User/Creator) with comprehensive validation

### 2. **Keypad Component**
- Mobile-first touch-friendly design
- Auto-formatting (adds hyphen after 4 digits)
- Real-time validation
- Search history for authenticated users
- Save to favorites functionality
- Instant redirect when ID is found

### 3. **Authentication System**
- JWT token management with refresh token support
- Automatic token refresh on 401 responses
- Protected routes with authentication checks
- User context provider

### 4. **Dashboard Layout**
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- User profile section
- Quick action buttons for creators

### 5. **API Integration**
- Centralized API configuration
- Request/response interceptors
- Error handling utilities
- Services for:
  - Authentication
  - Search & Discovery
  - Favorites Management

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Button, Input, ProtectedRoute
│   ├── keypad/         # Keypad component
│   └── layout/         # Dashboard layout
├── pages/              # Page components
│   ├── public/         # Public pages
│   └── dashboard/      # Protected dashboard pages
├── services/           # API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Design System

### Colors
- **Primary**: Purple to Indigo gradient (#667eea → #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Elevated with hover effects
- **Inputs**: With icon support and validation states
- **Keypad**: Large touch-friendly buttons

## API Endpoints Used

- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/profile`
- **Search**: `/api/search`, `/api/search/history`
- **Favorites**: `/api/favorites`, `/api/favorites/folders`

## Testing the App

1. **Register a new account**:
   - Navigate to `/register`
   - Choose user type (Creator for full features)
   - Fill in the registration form

2. **Try the keypad**:
   - Go to `/search`
   - Enter any 8-digit code (e.g., 1234-5678)
   - See the search functionality in action

3. **Access the dashboard**:
   - Login with your credentials
   - Explore the dashboard at `/dashboard`

## Dashboard Features

### Recently Added (Latest Update)
- **Search Page** (`/dashboard/search`): Comprehensive search interface with history
- **Favorites Page** (`/dashboard/favorites`): Complete favorites management
- **Analytics Integration**: Real-time data from backend analytics endpoints
- **4-Column Keypad Layout**: Matches FRONTEND_INTEGRATION_GUIDE.md specifications
- **Enhanced Search Results**: Better formatting and user feedback

### Navigation
- Overview: Dashboard statistics and quick actions
- Search IDs: Find and save Hom.IDs with search history
- Favorites: Manage saved IDs with folder organization
- My IDs: (Coming soon) Manage owned Hom.IDs
- Analytics: (Coming soon) Detailed performance metrics
- Billing: (Coming soon) Payment and subscription management

## Backend Integration

### Implemented Endpoints
- ✅ **Authentication**: Login, Register, Profile, Logout
- ✅ **Search**: ID lookup with history tracking
- ✅ **Favorites**: Add, remove, organize favorites
- ✅ **Analytics**: Overview, redirects, geographic, device, social data

### Response Formats
All API responses follow the backend specification:
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

## Component Architecture

### Key Components
1. **Keypad**: 4-column layout with auto-formatting
2. **FavoritesManager**: Complete CRUD operations for favorites
3. **SearchWithHistory**: Enhanced search with history display
4. **DashboardLayout**: Responsive sidebar with mobile support
5. **AuthProvider**: JWT token management with auto-refresh

## Next Steps

- [ ] Implement ID purchase flow
- [ ] Add analytics visualizations (charts and graphs)
- [ ] Build ID management interface for creators
- [ ] Add billing integration with Stripe
- [ ] Implement admin panel
- [ ] Add real-time notifications
- [ ] Optimize for production

## Performance Optimizations

- Lazy loading for routes
- Optimized Tailwind CSS with PurgeCSS
- Image optimization
- Code splitting

## Security

- XSS protection via React's built-in escaping
- CSRF protection with secure tokens
- Input validation on all forms
- Secure token storage
