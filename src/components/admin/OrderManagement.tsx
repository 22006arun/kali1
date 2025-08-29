import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, Phone, MapPin, Calendar, Package } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

interface Order {
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
  orderDate: any;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationNotes?: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
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
          id: 'demo-1',
          userId: 'user-1',
          customerInfo: {
            name: 'Rajesh Kumar',
            phone: '9876543210',
            address: 'No. 123, Gandhi Street, Viruthunagar - 626001',
            alternatePhone: '8765432109'
          },
          items: [
            { id: '1', name: 'Premium Sparklers', price: 150, quantity: 2, category: 'Sparklers' },
            { id: '2', name: 'Flower Pot Deluxe', price: 200, quantity: 1, category: 'Flower pots' }
          ],
          totalAmount: 500,
          status: 'pending',
          paymentMethod: 'cod',
          orderDate: new Date(),
          verificationStatus: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOrder = async (orderId: string, isVerified: boolean) => {
    try {
      const updateData = {
        verificationStatus: isVerified ? 'verified' : 'failed',
        status: isVerified ? 'verified' : 'cancelled',
        verificationNotes: verificationNotes || (isVerified ? 'Order verified successfully' : 'Verification failed')
      };

      await updateDoc(doc(db, 'orders', orderId), updateData);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updateData } : order
      ));
      
      setSelectedOrder(null);
      setVerificationNotes('');
      toast.success(isVerified ? 'Order verified successfully!' : 'Order cancelled');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'completed' });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      ));
      toast.success('Order marked as completed!');
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-mono text-sm">#{order.id.slice(-6)}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold">{order.customerInfo.name}</p>
                      <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-orange-600">₹{order.totalAmount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {order.orderDate?.toDate ? 
                      order.orderDate.toDate().toLocaleDateString() : 
                      new Date().toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-hover text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {order.status === 'verified' && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="cursor-hover text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                Order Details #{selectedOrder.id.slice(-6)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="cursor-hover text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                  {selectedOrder.customerInfo.alternatePhone && (
                    <p><strong>Alt Phone:</strong> {selectedOrder.customerInfo.alternatePhone}</p>
                  )}
                </div>
                <div>
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-1" />
                    <span>{selectedOrder.customerInfo.address}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h3>
              <div className="space-y-2">
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
              </div>
            </div>

            {/* Verification */}
            {selectedOrder.status === 'pending' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Order Verification</h3>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  placeholder="Add verification notes..."
                />
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => handleVerifyOrder(selectedOrder.id, true)}
                    className="cursor-hover flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="h-5 w-5" />
                    <span>Verify Order</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleVerifyOrder(selectedOrder.id, false)}
                    className="cursor-hover flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel Order</span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderManagement;