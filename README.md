# 🎂 Age Calculator App

A modern, secure web application for calculating ages and managing important events. Built with React, Firebase Authentication, and Firestore, featuring token-based security and user-specific data management.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-19.0.0-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-ffa611)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646cff)

## ✨ Features

### 🎯 Core Functionality
- **Age Calculator**: Calculate precise age in years, months, and days from any date
- **Event Management**: Create, read, update, and delete events with full CRUD operations
- **Multiple Event Types**: Support for Birthday, Anniversary, Meeting, Holiday, Celebration, and more
- **Smart Sorting**: Sort events by date or upcoming countdown
- **Countdown Timer**: See how long until the next occurrence of each event

### 🔐 Authentication & Security
- **Multiple Sign-In Methods**:
  - Email/Password authentication
  - Google Sign-In (one-click authentication)
- **Token-Based Security**: All CRUD operations use Firebase ID tokens for secure data access
- **User-Specific Data**: Each user can only access and modify their own events
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Management**: Persistent authentication across page refreshes

### 💾 Data Management
- **Firestore Integration**: Cloud-based database for reliable data storage
- **Real-Time Updates**: Events are instantly reflected after operations
- **Data Validation**: Client-side validation for all inputs
- **Ownership Verification**: Automatic verification of event ownership before updates/deletes

### 🎨 User Interface
- **Modern Design**: Clean, minimalist UI with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Modal-Based Interactions**: Intuitive modal windows for forms and confirmations
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages for all scenarios

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd age-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google providers)
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.js`

4. **Set up Firestore Security Rules**
   - Deploy the rules from `firestore.rules` to your Firebase project
   - You can deploy using Firebase CLI:
     ```bash
     firebase deploy --only firestore:rules
     ```
   - Or copy the rules manually in Firebase Console → Firestore Database → Rules

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📦 Available Scripts

### `npm run dev`
Starts the development server with Vite. The app will be available at `http://localhost:5173` with hot module replacement.

### `npm run build`
Creates an optimized production build in the `dist` folder. The build is minified and ready for deployment.

### `npm run preview`
Previews the production build locally before deploying.

### `npm run deploy`
Builds and deploys the app to GitHub Pages (if configured).

### `npm test`
Runs the test suite using Vitest.

## 🏗️ Project Structure

```
age-calculator/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AgeCalculator.js    # Age calculation component
│   │   ├── Auth.js             # Authentication component
│   │   ├── EventForm.js        # Event creation form
│   │   ├── EventList.js        # Event display and management
│   │   └── PrivateRoute.js     # Protected route wrapper
│   ├── contexts/           # React contexts
│   │   └── AuthContext.js      # Authentication context provider
│   ├── styles/             # CSS stylesheets
│   │   ├── App.css
│   │   ├── Auth.css
│   │   ├── EventList.css
│   │   ├── Form.css
│   │   └── AgeCalculator.css
│   ├── utils/              # Utility functions
│   │   └── firebaseAuth.js     # Firebase auth helpers
│   ├── App.js              # Main app component
│   ├── firebase.js         # Firebase configuration
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── firestore.rules         # Firestore security rules
├── vite.config.js          # Vite configuration
├── vitest.config.js        # Vitest configuration
└── package.json            # Project dependencies
```

## 🔧 Configuration

### Firebase Setup

1. **Enable Authentication Providers**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google"

2. **Configure Firestore**:
   - Go to Firebase Console → Firestore Database
   - Create database in production mode
   - Deploy security rules from `firestore.rules`

3. **Update Firebase Config**:
   ```javascript
   // src/firebase.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other config
   };
   ```

## 🔒 Security Features

### Token-Based Authentication
- All database operations require valid Firebase ID tokens
- Tokens are automatically refreshed by Firebase SDK
- Unauthenticated users are redirected to login

### Firestore Security Rules
The `firestore.rules` file enforces:
- Users can only **read** their own events
- Users can only **create** events with their own userId
- Users can only **update** their own events
- Users can only **delete** their own events

### Client-Side Security
- Ownership verification before UPDATE/DELETE operations
- Authentication checks before all CRUD operations
- User ID validation in all database queries

## 📱 Usage Guide

### Creating an Account
1. Click on any protected route (you'll be redirected to login)
2. Choose between:
   - **Email/Password**: Enter email and password, toggle to "Sign Up" for new accounts
   - **Google Sign-In**: Click "Continue with Google" for one-click authentication

### Adding Events
1. After logging in, click the **"➕ Add"** button
2. Fill in the event details:
   - Event Name (e.g., "John's Birthday")
   - Event Date (select from date picker)
   - Event Type (choose from dropdown)
3. Click **"Save Event"**

### Viewing Events
- All your events are displayed in cards showing:
  - Event name and type
  - Original date
  - Current age (years, months, days)
  - Countdown to next occurrence

### Sorting Events
- Click the **"🔄 Sort"** button to cycle through sorting options:
  - Oldest first
  - Newest first
  - Upcoming soon
  - Upcoming later

### Editing Events
1. Click **"✏️ Edit"** on any event card
2. Modify the event details in the modal
3. Click **"💾 Save Changes"**

### Deleting Events
1. Click **"🗑️ Delete"** on any event card
2. Confirm deletion in the popup
3. Event is permanently removed

### Calculating Age
1. Click the **"📅 Calculate"** button
2. Enter a birth date or reference date
3. View the calculated age in years, months, and days

## 🛠️ Technologies Used

- **React 19.0.0** - UI library
- **React Router DOM 7.1.1** - Client-side routing
- **Firebase 11.1.0** - Backend services
  - Authentication (Email/Password, Google)
  - Firestore (NoSQL database)
- **React Firebase Hooks 5.1.1** - Firebase integration hooks
- **Vite 7.1.12** - Build tool and dev server
- **Vitest 4.0.6** - Testing framework

## 🏛️ Technical Architecture

### Firebase Authentication with Tokenization

This project implements a comprehensive authentication system using **Firebase Authentication** with **token-based security**:

#### Authentication Methods
- **Email/Password Authentication**: Traditional email and password sign-up/sign-in
- **Google OAuth**: One-click Google Sign-In using Firebase's Google Auth Provider
- **Session Persistence**: Uses `browserLocalPersistence` for 7-day session management

#### Token-Based Security Implementation
- **Firebase ID Tokens**: All database operations require valid Firebase ID tokens
- **Automatic Token Refresh**: Firebase SDK automatically refreshes tokens before expiration
- **Token Validation**: Every CRUD operation validates the token before execution
- **Client-Side Token Management**: 
  - `getAuthToken()` utility function retrieves current user's ID token
  - Tokens are validated for each database operation
  - Expired sessions are automatically signed out

#### Session Management
- **7-Day Session Duration**: Users remain logged in for 7 days from initial login
- **localStorage Tracking**: Login timestamps stored in localStorage for session tracking
- **Automatic Expiration**: Sessions automatically expire after 7 days
- **Persistent Sessions**: Authentication state persists across browser sessions and page refreshes

#### Code Location
- `src/utils/firebaseAuth.js` - Core authentication utilities and token management
- `src/contexts/AuthContext.js` - Authentication context provider using `react-firebase-hooks`
- `src/components/Auth.js` - Authentication UI component
- `src/firebase.js` - Firebase configuration and persistence setup

### Firebase Firestore Database

The application uses **Firebase Firestore** (NoSQL cloud database) for all data storage:

#### Database Structure
```
Collection: age-calculator
├── Document ID (auto-generated)
    ├── name: string
    ├── date: string (ISO format)
    ├── type: string
    ├── userId: string (Firebase UID)
    ├── createdAt: string (ISO timestamp)
    └── updatedAt: string (ISO timestamp)
```

#### Data Operations
- **CREATE**: New events are created with userId, ensuring user ownership
- **READ**: Events are queried and filtered by userId for user-specific data
- **UPDATE**: Event ownership is verified before allowing updates
- **DELETE**: Event ownership is verified before allowing deletion

#### Security Implementation
- **User-Specific Queries**: All Firestore queries include `where('userId', '==', userId)`
- **Ownership Verification**: Client-side checks ensure users can only modify their own data
- **Security Rules**: Backend Firestore security rules enforce data access at database level
- **Token Inclusion**: All Firestore operations automatically include Firebase ID tokens

#### Code Location
- `src/components/EventForm.js` - CREATE operations
- `src/components/EventList.js` - READ, UPDATE, DELETE operations
- `firestore.rules` - Server-side security rules

### Security Architecture

#### Multi-Layer Security
1. **Frontend Validation**
   - Authentication checks before all operations
   - Ownership verification for UPDATE/DELETE
   - User ID validation in queries

2. **Backend Security Rules**
   - Firestore rules enforce data access policies
   - Token validation at database level
   - User ID matching requirements

3. **Token-Based Authentication**
   - All requests include Firebase ID tokens
   - Automatic token refresh mechanism
   - Session expiration handling

#### Protected Routes
- **React Router Integration**: Uses `PrivateRoute` component to protect routes
- **Automatic Redirects**: Unauthenticated users are redirected to `/auth`
- **Route Guards**: All protected routes check authentication state

### State Management

#### React Context API
- **AuthContext**: Manages global authentication state
- **useAuth Hook**: Provides user, loading, and error states throughout the app
- **Real-Time Updates**: Authentication state updates trigger component re-renders

#### Local State Management
- **Component-Level State**: Each component manages its own local state (forms, modals, etc.)
- **Event State**: Events are stored in component state after fetching from Firestore
- **Optimistic Updates**: UI updates immediately, then syncs with database

### Data Flow

```
User Action → Auth Check → Token Retrieval → Firestore Query → Data Validation → UI Update
     ↓              ↓              ↓               ↓                ↓              ↓
  Component → useAuth() → getAuthToken() → Firestore API → Security Rules → React State
```

### Performance Optimizations

- **Code Splitting**: Route-based code splitting with React Router
- **Lazy Loading**: Components loaded on-demand
- **Efficient Queries**: Indexed queries by userId for fast data retrieval
- **Optimized Builds**: Vite provides fast builds and HMR (Hot Module Replacement)

### Error Handling

- **Authentication Errors**: User-friendly error messages for auth failures
- **Firestore Errors**: Graceful handling of database errors
- **Network Errors**: Retry mechanisms and error states
- **Validation Errors**: Client-side validation with clear error messages

### CI/CD Pipeline & Deployment

#### GitHub to Vercel Auto-Deployment

This project uses a **continuous integration and continuous deployment (CI/CD)** pipeline for automated deployments:

- **Source Control**: GitHub repository hosts the codebase
- **Automatic Deployment**: Vercel automatically deploys on every push to the main/master branch
- **Build Process**: 
  - Vercel detects changes via GitHub webhooks
  - Runs `npm run build` to create production build
  - Outputs to `dist` directory (configured in `vercel.json`)
- **Preview Deployments**: Every pull request gets a unique preview URL
- **Zero-Downtime Deployments**: New deployments go live instantly without service interruption

#### Vercel Configuration

The `vercel.json` file configures:
- **Output Directory**: `dist` (Vite's build output)
- **Build Command**: `npm run build`
- **Framework**: Vite
- **Route Handling**: Rewrites all routes to `index.html` for SPA routing support

#### Deployment Flow

```
Git Push → GitHub Webhook → Vercel Build → Production Deployment → Live Site
   ↓              ↓               ↓                  ↓                 ↓
  Code       Trigger         npm run build      Deploy to CDN    https://*.vercel.app
```

#### Environment & Configuration

- **Environment Variables**: Can be configured in Vercel dashboard
- **Build Settings**: Automatically detected from `vercel.json`
- **Domain Management**: Custom domains can be configured in Vercel
- **Analytics**: Built-in deployment analytics and performance monitoring

#### Deployment Features

- **Instant Rollbacks**: One-click rollback to previous deployments
- **Deployment History**: Complete history of all deployments
- **Build Logs**: Real-time build logs for debugging
- **Edge Network**: Global CDN for fast content delivery
- **HTTPS**: Automatic SSL certificates for all deployments

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the project owner.

## 📞 Support

For issues related to:
- **Firebase Setup**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **Deployment**: Refer to Vite's [Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- **Security Rules**: See `firestore.rules` file and Firebase Console

## 🎯 Future Enhancements

Potential features for future releases:
- [ ] Dark mode support
- [ ] Event reminders/notifications
- [ ] Export events to calendar
- [ ] Share events with other users
- [ ] Recurring events support
- [ ] Multiple date formats
- [ ] Custom event type creation
- [ ] Event search and filtering

---

**Built with ❤️ using React and Firebase**
