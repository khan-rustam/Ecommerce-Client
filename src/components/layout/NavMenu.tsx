import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Contact } from 'lucide-react';

type NavMenuProps = {
  showMenu: boolean;
};

const categories = [
  { name: 'HOME', path: '/' },
  { 
    name: 'MUSICAL INSTRUMENTS & GEAR', 
    path: '/category/music', 
    hasSubMenu: true,
    subCategories: [
      { name: 'Accessories', path: '/category/music/accessories' },
      { name: 'Drum', path: '/category/music/drum' },
      { name: 'Mouth Instruments', path: '/category/music/mouth' },
      { name: 'Percussion', path: '/category/music/percussion' },
      { name: 'String Instruments', path: '/category/music/string' },
    ]
  },
  { name: 'COPPER UTENSILS', path: '/category/copper' },
  { name: 'CRAFTS', path: '/category/crafts' },
  { name: 'TOYS & HOBBIES', path: '/category/toys' },
  { name: 'HOME DECOR', path: '/category/decor' },
  { name: 'FASHION', path: '/category/fashion' },
  { 
    name: 'CONTACT', 
    path: '/contact',
    icon: Contact
  },
];

const NavMenu = ({ showMenu }: NavMenuProps) => {
  return (
    <nav className="bg-purple-100 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="relative group">
            <button className="flex items-center space-x-1 bg-purple-500 text-white py-3 px-4">
              <span>Browse Categories</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute z-10 left-0 top-full w-56 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <ul>
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link 
                      to={category.path}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      {category.icon && <category.icon size={16} className="mr-2" />}
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="flex">
            {categories.map((category) => (
              <li key={category.name} className="relative group">
                <Link 
                  to={category.path}
                  className="flex items-center px-4 py-3 hover:bg-gray-100"
                >
                  {category.icon && <category.icon size={16} className="mr-2" />}
                  {category.name}
                  {category.hasSubMenu && <ChevronDown size={16} className="ml-1" />}
                </Link>
                {category.hasSubMenu && category.subCategories && (
                  <div className="absolute z-10 left-0 top-full w-48 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <ul>
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.name}>
                          <Link 
                            to={subCategory.path}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${showMenu ? 'block' : 'hidden'}`}>
          <ul className="py-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link 
                  to={category.path}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  {category.icon && <category.icon size={16} className="mr-2" />}
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;