import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Phone, MapPin, Eye, X } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
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
  orderDate: any;
  verificationNotes?: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser?.uid),
        orderBy('orderDate', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Demo data
      setOrders([
        {
          id: 'demo-order-1',
          customerInfo: {
            name: 'John Doe',
            phone: '9876543210',
            address: 'No. 123, Gandhi Street, Viruthunagar - 626001'
          },
          items: [
            { id: '1', name: 'Premium Sparklers', price: 150, quantity: 2, category: 'Sparklers' },
            { id: '2', name: 'Flower Pot Deluxe', price: 200, quantity: 1, category: 'Flower pots' }
          ],
          totalAmount: 500,
          status: 'verified',
          orderDate: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Order placed - Waiting for verification call';
      case 'verified': return 'Order verified - Being prepared for delivery';
      case 'completed': return 'Order delivered successfully';
      case 'cancelled': return 'Order was cancelled';
      default: return 'Unknown status';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {order.orderDate?.toDate ? 
                          order.orderDate.toDate().toLocaleDateString() : 
                          'Recently'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">{getStatusMessage(order.status)}</p>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • 
                        <span className="font-semibold text-orange-600 ml-1">
                          ₹{order.totalAmount}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-hover bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order #{selectedOrder.id.slice(-6)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="cursor-hover text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Order Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{getStatusMessage(selectedOrder.status)}</p>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{selectedOrder.customerInfo.phone}</span>
                    {selectedOrder.customerInfo.alternatePhone && (
                      <span className="ml-2 text-gray-500">
                        / {selectedOrder.customerInfo.alternatePhone}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                    <span>{selectedOrder.customerInfo.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price} × {item.quantity}</p>
                        <p className="text-sm text-gray-600">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-orange-600">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Payment: Cash on Delivery</p>
                </div>
              </div>

              {selectedOrder.verificationNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Verification Notes</h4>
                  <p className="text-sm text-blue-700">{selectedOrder.verificationNotes}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;