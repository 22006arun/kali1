import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="bg-white rounded-lg shadow-xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Shield className="h-12 w-12 text-red-600 mr-2" />
              <Sparkles className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-600 mt-2">
              Administrative login for M.K. Athiban Crackers
            </p>
          </div>

          {/* Demo Admin Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Demo Admin Credentials</h4>
            <p className="text-sm text-blue-700">
              Email: admin@mkathiban.com<br />
              Password: admin123
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="cursor-hover w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Authenticating...' : 'Admin Login'}
            </motion.button>
          </form>

          {/* Back to User Login */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="cursor-hover text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              ← Back to User Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;