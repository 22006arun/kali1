import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  Plus
} from 'lucide-react';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import AdminStats from '../components/admin/AdminStats';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/admin/')[1] || '';

  const menuItems = [
    { path: '', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { path: 'products', label: 'Products', icon: <Package className="h-5 w-5" /> },
    { path: 'orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { path: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600">M.K. Athiban Crackers</p>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                className={`cursor-hover flex items-center px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                  currentPath === item.path ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminStats />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;