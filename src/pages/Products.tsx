import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Sparkles } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import toast from 'react-hot-toast';

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

const Products: React.FC = () => {
  const { category } = useParams();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(decodeURIComponent(category));
    }
  }, [category]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Demo data for development
      setProducts(generateDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoProducts = (): Product[] => {
    const demoProducts: Product[] = [];
    categories.forEach((cat, catIndex) => {
      for (let i = 1; i <= 3; i++) {
        demoProducts.push({
          id: `${catIndex}-${i}`,
          name: `Premium ${cat} ${i}`,
          category: cat,
          price: Math.floor(Math.random() * 500) + 100,
          description: `High-quality ${cat.toLowerCase()} with vibrant colors and amazing effects. Perfect for celebrations and festivals.`,
          image: `https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=400`,
          inStock: Math.random() > 0.1,
          featured: Math.random() > 0.7
        });
      }
    });
    return demoProducts;
  };

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image
    });
    toast.success('Added to cart!');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Premium Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover our wide range of quality crackers and fireworks
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Filter */}
          <div className="lg:w-1/4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;