import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Shield, Truck } from 'lucide-react';

const Home: React.FC = () => {
  const categories = [
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

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Quality Products',
      description: 'All our crackers are tested and certified for safety'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order at your doorstep'
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: 'Wide Selection',
      description: '16 different categories of premium crackers'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              M.K. Athiban Crackers
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium Quality Fireworks & Crackers from Viruthunagar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="cursor-hover bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Shop Now
              </Link>
              <a
                href="tel:6374363805"
                className="cursor-hover border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all"
              >
                Call Us: 6374363805
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose M.K. Athiban Crackers?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-all cursor-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="text-orange-500 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={index}
                to={`/products/${encodeURIComponent(category)}`}
                className="cursor-hover group"
              >
                <motion.div
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all group-hover:bg-orange-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-orange-500 mx-auto mb-2 group-hover:text-orange-600" />
                    <h3 className="font-semibold text-sm text-gray-800 group-hover:text-orange-800">
                      {category}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="cursor-hover inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              View All Categories
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Our Store</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p>Viruthunagar Main Road</p>
              <p>Amathur, Viruthunagar DT</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p>📞 6374363805</p>
              <p>📞 8056862419</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p>tkpprakash27@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;