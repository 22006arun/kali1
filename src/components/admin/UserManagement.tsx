import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Mail, Phone, Calendar } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: any;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'user'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Demo data
      setUsers([
        {
          id: 'user-1',
          email: 'rajesh@example.com',
          name: 'Rajesh Kumar',
          phone: '9876543210',
          address: 'Gandhi Street, Viruthunagar',
          role: 'user',
          createdAt: new Date()
        },
        {
          id: 'user-2',
          email: 'priya@example.com',
          name: 'Priya Sharma',
          phone: '8765432109',
          address: 'Main Road, Amathur',
          role: 'user',
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-5 w-5 mr-2" />
          <span>{users.length} Total Users</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Customer
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Joined: {user.createdAt?.toDate ? 
                    user.createdAt.toDate().toLocaleDateString() : 
                    'Recently'}
                </span>
              </div>
            </div>

            {user.address && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Address:</p>
                <p className="text-sm text-gray-700">{user.address}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;