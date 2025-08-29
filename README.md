# M.K. Athiban Crackers - E-commerce Platform

A comprehensive e-commerce platform for M.K. Athiban Crackers, specializing in premium fireworks and crackers from Viruthunagar.

## Features

### Customer Features
- Browse 16 different categories of crackers
- Add products to shopping cart
- Cash on Delivery (COD) payment system
- Order tracking and history
- User authentication and profile management

### Admin Features
- Complete product management (add, edit, delete)
- Order verification and management system
- User management and analytics
- Sales dashboard with comprehensive statistics
- Role-based access control

## Store Information

**M.K. Athiban Crackers**
- Address: Viruthunagar Main Road, Amathur, Viruthunagar DT
- Email: tkpprakash27@gmail.com
- Phone: 6374363805, 8056862419

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Routing**: React Router DOM

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `src/firebase/config.ts` with your Firebase config

4. Create admin account:
   - Email: admin@mkathiban.com
   - Password: admin123
   - Manually set role to 'admin' in Firestore

5. Start the development server:
   ```bash
   npm run dev
   ```

## Product Categories

1. One sound crackers
2. Electric crackers
3. Deluxe crackers
4. Garland crackers
5. Ground chakkar
6. Flower pots
7. Atom bomb
8. Rockets
9. Twinkling Stars and Candles
10. Kids special and candles
11. Night aerial Attractions
12. Aerial and festival repeating shots
13. Festival mega repeating shots
14. Sparklers
15. Gift boxes and family pack
16. 2025 special crackers

## Firebase Collections

### Users Collection
```javascript
{
  uid: string,
  email: string,
  name: string,
  phone: string,
  address: string,
  role: 'user' | 'admin',
  createdAt: timestamp
}
```

### Products Collection
```javascript
{
  name: string,
  category: string,
  price: number,
  description: string,
  image: string,
  inStock: boolean,
  featured: boolean
}
```

### Orders Collection
```javascript
{
  userId: string,
  customerInfo: {
    name: string,
    phone: string,
    address: string,
    alternatePhone: string
  },
  items: array,
  totalAmount: number,
  status: 'pending' | 'verified' | 'completed' | 'cancelled',
  paymentMethod: 'cod',
  orderDate: timestamp,
  verificationStatus: 'pending' | 'verified' | 'failed',
  verificationNotes: string
}
```

## Payment Process

1. **Customer places order** - Order status: 'pending'
2. **Admin verification call** - Verify customer details and address
3. **Order verification** - Status updated to 'verified' or 'cancelled'
4. **Delivery preparation** - Products prepared for delivery
5. **Cash on delivery** - Payment collected at delivery, status: 'completed'

## Design Features

- Custom interactive cursor
- Responsive design for all devices
- Smooth animations and transitions
- Festive color scheme with orange and red gradients
- Premium user experience with attention to detail

## Security

- Role-based access control
- Firebase Authentication
- Protected admin routes
- Secure user data handling
- Order verification system

## License

Private license for M.K. Athiban Crackers