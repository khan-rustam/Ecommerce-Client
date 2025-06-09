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
    <nav className="bg-primary/10 border-t border-b border-accent/20 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="relative group">
            <button className="flex items-center space-x-1 bg-primary text-white py-3 px-5 rounded-t-xl font-semibold shadow-md hover:bg-accent transition-colors">
              <span>Browse Categories</span>
              <ChevronDown size={18} />
            </button>
            <div className="absolute z-10 left-0 top-full w-60 bg-background shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-2 border-accent/20">
              <ul>
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link 
                      to={category.path}
                      className="flex items-center px-5 py-3 hover:bg-accent/10 hover:text-accent font-medium rounded-lg transition-colors"
                    >
                      {category.icon && <category.icon size={18} className="mr-2" />}
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="flex ml-6">
            {categories.map((category) => (
              <li key={category.name} className="relative group">
                <Link 
                  to={category.path}
                  className="flex items-center px-5 py-3 hover:bg-accent/10 hover:text-accent font-semibold rounded-lg transition-colors"
                >
                  {category.icon && <category.icon size={18} className="mr-2" />}
                  {category.name}
                  {category.hasSubMenu && <ChevronDown size={18} className="ml-1" />}
                </Link>
                {category.hasSubMenu && category.subCategories && (
                  <div className="absolute z-10 left-0 top-full w-52 bg-background shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-2 border-accent/20">
                    <ul>
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.name}>
                          <Link 
                            to={subCategory.path}
                            className="block px-5 py-3 hover:bg-accent/10 hover:text-accent font-medium rounded-lg transition-colors"
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
                  className="flex items-center px-5 py-3 hover:bg-accent/10 hover:text-accent font-semibold rounded-lg transition-colors"
                >
                  {category.icon && <category.icon size={18} className="mr-2" />}
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