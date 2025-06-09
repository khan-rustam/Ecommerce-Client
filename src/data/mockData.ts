import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/2253916/pexels-photo-2253916.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 11, name: 'Cases', slug: 'cases' },
      { id: 12, name: 'Stands', slug: 'stands' },
    ],
  },
  {
    id: 2,
    name: 'Drum',
    slug: 'drum',
    image: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 21, name: 'Tabla', slug: 'tabla' },
      { id: 22, name: 'Dholak', slug: 'dholak' },
    ],
  },
  {
    id: 3,
    name: 'Mouth Instruments',
    slug: 'mouth-instruments',
    image: 'https://images.pexels.com/photos/11368044/pexels-photo-11368044.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 31, name: 'Flute', slug: 'flute' },
      { id: 32, name: 'Shehnai', slug: 'shehnai' },
    ],
  },
  {
    id: 4,
    name: 'Percussion',
    slug: 'percussion',
    image: 'https://images.pexels.com/photos/8470961/pexels-photo-8470961.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 41, name: 'Ghungroo', slug: 'ghungroo' },
      { id: 42, name: 'Manjira', slug: 'manjira' },
    ],
  },
  {
    id: 5,
    name: 'Crafts',
    slug: 'crafts',
    image: 'https://images.pexels.com/photos/6045068/pexels-photo-6045068.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 51, name: 'Pottery', slug: 'pottery' },
      { id: 52, name: 'Woodwork', slug: 'woodwork' },
    ],
  },
  {
    id: 6,
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.pexels.com/photos/1268504/pexels-photo-1268504.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 61, name: 'Wall Art', slug: 'wall-art' },
      { id: 62, name: 'Tapestry', slug: 'tapestry' },
    ],
  },
  {
    id: 7,
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.pexels.com/photos/2148721/pexels-photo-2148721.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 71, name: 'Fabrics', slug: 'fabrics' },
      { id: 72, name: 'Jewelry', slug: 'jewelry' },
    ],
  },
  {
    id: 8,
    name: 'Copper Utensils',
    slug: 'copper-utensils',
    image: 'https://images.pexels.com/photos/161528/kitchen-copper-pots-cooking-pan-161528.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: [
      { id: 81, name: 'Cookware', slug: 'cookware' },
      { id: 82, name: 'Tableware', slug: 'tableware' },
    ],
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Professional Tabla Set with Cushions and Cover',
    description: 'Handcrafted professional tabla set with dayan (right hand drum) and bayan (left hand drum). Includes cushions and cover for protection during transport.',
    price: 299.99,
    salePrice: 249.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/11295363/pexels-photo-11295363.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'music',
    subcategory: 'drum',
    stock: 12,
    rating: 4.8,
    tags: ['percussion', 'tabla', 'classical music'],
    featured: true
  },
  {
    id: 2,
    name: 'Bamboo Flute (Bansuri) Professional Grade',
    description: 'Professional grade bamboo flute (Bansuri) made from seasoned bamboo. Perfect for classical Indian music performances.',
    price: 89.99,
    salePrice: 74.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/11368044/pexels-photo-11368044.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/18187758/pexels-photo-18187758/free-photo-of-close-up-of-a-musical-pipe.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'music',
    subcategory: 'mouth-instruments',
    stock: 20,
    rating: 4.5,
    tags: ['wind instruments', 'bamboo', 'bansuri'],
    featured: true
  },
  {
    id: 3,
    name: 'Handcrafted Copper Water Bottle with Ayurvedic Benefits',
    description: 'Traditional handcrafted copper water bottle. Store water overnight for Ayurvedic health benefits. Leak-proof cap and elegant design.',
    price: 34.99,
    salePrice: 29.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1797908/pexels-photo-1797908.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'copper-utensils',
    subcategory: 'tableware',
    stock: 50,
    rating: 4.9,
    tags: ['copper', 'ayurveda', 'water bottle', 'health'],
    featured: true
  },
  {
    id: 4,
    name: 'Handloom Cotton Saree with Traditional Block Print',
    description: 'Authentic handloom cotton saree with traditional block printing. Each piece is unique and showcases the artistry of Indian textile craftsmen.',
    price: 79.99,
    salePrice: 64.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/2148721/pexels-photo-2148721.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/10571352/pexels-photo-10571352.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'fashion',
    subcategory: 'fabrics',
    stock: 15,
    rating: 4.6,
    tags: ['saree', 'handloom', 'block print', 'traditional wear'],
    featured: true,
    new: true
  },
  {
    id: 5,
    name: 'Handcrafted Brass Peacock Wall Hanging',
    description: 'Intricately designed peacock wall hanging made from brass. Perfect for adding an elegant touch to your home decor.',
    price: 59.99,
    salePrice: 49.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/1268504/pexels-photo-1268504.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/18062025/pexels-photo-18062025/free-photo-of-wood-fashion-vintage-design.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'home-decor',
    subcategory: 'wall-art',
    stock: 30,
    rating: 4.7,
    tags: ['wall hanging', 'brass', 'peacock', 'artistic'],
    new: true
  },
  {
    id: 6,
    name: 'Handmade Marble Chess Set with Traditional Designs',
    description: 'Exquisite chess set crafted from premium marble with traditional Indian designs. Each piece is handcrafted by skilled artisans.',
    price: 129.99,
    salePrice: 109.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/1152662/pexels-photo-1152662.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/411195/pexels-photo-411195.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'toys',
    subcategory: 'board-games',
    stock: 8,
    rating: 5.0,
    tags: ['chess', 'marble', 'board game', 'premium'],
    featured: true
  },
  {
    id: 7,
    name: 'Professional Harmonium with Coupler',
    description: 'Professional grade harmonium with coupler function. Made with premium materials for superior sound quality. Comes with carrying bag.',
    price: 449.99,
    salePrice: 379.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2252558/pexels-photo-2252558.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'music',
    subcategory: 'keyboard',
    stock: 5,
    rating: 4.9,
    tags: ['harmonium', 'keyboard', 'professional', 'classical music'],
    featured: true
  },
  {
    id: 8,
    name: 'Handcrafted Wooden Elephant with Intricate Carvings',
    description: 'Beautifully carved wooden elephant showcasing traditional Indian craftsmanship. Each piece is unique with detailed hand carvings.',
    price: 89.99,
    salePrice: 74.99,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/6045068/pexels-photo-6045068.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/927451/pexels-photo-927451.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    category: 'crafts',
    subcategory: 'woodwork',
    stock: 20,
    rating: 4.7,
    tags: ['woodwork', 'elephant', 'carving', 'home decor'],
    new: true
  },
];

export const trendingProducts: Product[] = [
  {
    id: 101,
    name: 'Trending Sitar',
    description: 'A trending sitar loved by musicians worldwide.',
    price: 399.99,
    salePrice: 349.99,
    discount: 12,
    images: [
      'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&w=800&q=80',
    ],
    category: 'music',
    subcategory: 'string',
    stock: 10,
    rating: 4.9,
    tags: ['trending', 'sitar'],
    featured: true,
  },
  // ...add more trending products as needed
];

export const customerStories = [
  {
    id: 1,
    name: 'Priya Sharma',
    story: 'I found the perfect tabla set for my son. The quality is amazing and delivery was super fast!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Amit Verma',
    story: 'The handcrafted flute exceeded my expectations. Will definitely shop again!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  // ...add more stories as needed
];