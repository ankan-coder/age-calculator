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
