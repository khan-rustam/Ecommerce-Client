export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  stock: number;
  rating?: number;
  tags?: string[];
  featured?: boolean;
  new?: boolean;
}

export interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
  };
  stock: number;
  rating: number;
  numReviews: number;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isTrending: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image: string;
  subcategories?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export interface Review {
  _id: string;
  product: string | BackendProduct;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isCustomStore: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  user: string | { _id: string; username: string };
  product: string | { _id: string; name: string };
  question: string;
  answer: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}