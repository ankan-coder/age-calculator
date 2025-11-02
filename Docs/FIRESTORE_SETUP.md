# Firestore Security Rules Setup

## Overview
This project uses Firebase Authentication tokens to secure CRUD operations. All database operations require authentication and are user-specific.

## Security Rules
The `firestore.rules` file contains security rules that enforce:
- Users can only **read** events they created
- Users can only **create** events with their own userId
- Users can only **update** their own events
- Users can only **delete** their own events

## Deploying Security Rules

### Using Firebase CLI:
1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not done already):
   ```bash
   firebase init firestore
   ```

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Using Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy and paste the content from `firestore.rules`
5. Click **Publish**

## Composite Index Requirement

Since we query by `userId` and order by `date`, you may need to create a composite index:

1. When you first run the app, Firestore will show an error with a link to create the index
2. Click the link to create the index automatically, OR
3. Manually create it in Firebase Console:
   - Go to Firestore Database → Indexes
   - Click "Create Index"
   - Collection: `age-calculator`
   - Fields: `userId` (Ascending), `date` (Ascending)
   - Click "Create"

## Token Usage

The application automatically:
- Retrieves Firebase ID tokens before each operation
- Validates user authentication
- Filters data by userId
- Verifies ownership before updates/deletes

All tokens are handled automatically by the Firebase SDK and included in every request.

