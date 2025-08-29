import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-orange-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
      </div>
      
      <div className="space-y-2">
        <motion.button
          onClick={() => onCategoryChange('all')}
          className={`cursor-hover w-full text-left px-3 py-2 rounded-lg transition-all ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white'
              : 'hover:bg-orange-50 text-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          All Categories
        </motion.button>
        
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`cursor-hover w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'hover:bg-orange-50 text-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;