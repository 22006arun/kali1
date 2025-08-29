/**
 * Firebase Setup Instructions
 * 
 * To use this application with Firebase:
 * 
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Authentication with Email/Password
 * 3. Create a Firestore database in production mode
 * 4. Update the config in src/firebase/config.ts with your project details
 * 
 * Required Firestore Collections:
 * - users: User profiles with role-based access
 * - products: Product catalog with categories
 * - orders: Customer orders with verification status
 * 
 * Demo Admin Account:
 * Email: admin@mkathiban.com
 * Password: admin123
 * Role: admin
 * 
 * To create the admin account, you'll need to:
 * 1. Sign up with the above credentials
 * 2. Manually update the user document in Firestore to set role: 'admin'
 */

export const DEMO_ADMIN = {
  email: 'admin@mkathiban.com',
  password: 'admin123',
  role: 'admin'
};

export const CATEGORIES = [
  'One sound crackers',
  'Electric crackers',
  'Deluxe crackers',
  'Garland crackers',
  'Ground chakkar',
  'Flower pots',
  'Atom bomb',
  'Rockets',
  'Twinkling Stars and Candles',
  'Kids special and candles',
  'Night aerial Attractions',
  'Aerial and festival repeating shots',
  'Festival mega repeating shots',
  'Sparklers',
  'Gift boxes and family pack',
  '2025 special crackers'
];