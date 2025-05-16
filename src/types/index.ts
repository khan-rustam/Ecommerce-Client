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