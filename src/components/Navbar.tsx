import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Sparkles, LogOut, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-hover">
            <Sparkles className="h-8 w-8 text-orange-500" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">M.K. Athiban</span>
              <span className="text-sm text-orange-600 -mt-1">Crackers</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors cursor-hover">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 transition-colors cursor-hover">
              Products
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="relative cursor-hover">
                    <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600 transition-colors" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                
                {!isAdmin && (
                  <Link to="/orders" className="cursor-hover">
                    <Package className="h-6 w-6 text-gray-700 hover:text-orange-600 transition-colors" />
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" className="cursor-hover">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      Admin Panel
                    </span>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-sm text-gray-700">{userProfile?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="cursor-hover p-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="cursor-hover bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="cursor-hover text-gray-700 hover:text-orange-600 transition-colors text-sm"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;