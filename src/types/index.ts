export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    alternatePhone?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'verified' | 'completed' | 'cancelled';
  paymentMethod: string;
  orderDate: Date;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationNotes?: string;
}