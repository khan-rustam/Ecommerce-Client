import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryShowcaseProps {
  title: string;
  categories: Category[];
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ title, categories }) => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold inline-block relative">
            {title}
            <span className="absolute bottom-0 left-1/2 w-16 h-0.5 bg-orange-500 transform -translate-x-1/2"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.slug}`} 
              key={category.id}
              className="group"
            >
              <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="py-4 px-2 text-center bg-gray-50 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;