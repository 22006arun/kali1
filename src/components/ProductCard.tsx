import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Product } from '../pages/Products';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-hover"
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <Sparkles className="h-5 w-5 text-orange-500 flex-shrink-0" />
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        <p className="text-gray-700 mb-4 text-sm line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">
            ₹{product.price}
          </span>
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="cursor-hover bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;