import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Product } from '../../pages/Products';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Generate demo products for development
      const demoProducts = generateDemoProducts();
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoProducts = (): Product[] => {
    const demoProducts: Product[] = [];
    categories.forEach((cat, catIndex) => {
      for (let i = 1; i <= 3; i++) {
        demoProducts.push({
          id: `demo-${catIndex}-${i}`,
          name: `Premium ${cat} ${i}`,
          category: cat,
          price: Math.floor(Math.random() * 500) + 100,
          description: `High-quality ${cat.toLowerCase()} with vibrant colors and amazing effects.`,
          image: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=400',
          inStock: Math.random() > 0.1,
          featured: Math.random() > 0.7
        });
      }
    });
    return demoProducts;
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      const newProduct = { id: docRef.id, ...productData };
      setProducts([...products, newProduct]);
      setShowForm(false);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), productData);
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
      ));
      setEditingProduct(null);
      setShowForm(false);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <motion.button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="cursor-hover bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{product.category}</td>
                  <td className="py-4 px-4 font-semibold text-orange-600">₹{product.price}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="cursor-hover text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="cursor-hover text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;