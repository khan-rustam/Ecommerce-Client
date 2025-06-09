import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Product, BackendProduct, Review, Question } from "../types";
import ProductService from "../utils/ProductService";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useSelector } from 'react-redux';
import { get, post } from "../utils/authFetch";
import axios from 'axios';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<
    (Product | BackendProduct)[]
  >([]);

  // Check if we're coming from an update operation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromUpdate = searchParams.get("fromUpdate");

    if (fromUpdate === "true") {
      // Redirect to admin products page
      navigate("/admin/products");
    }
  }, [location, navigate]);

  const { addToCart, cartItems } = useCart();
  const { addToWishlist, isInWishlist, wishlistItems } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { user } = useAuth();

  const reduxUser = useSelector((state: any) => state.user.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Add state for questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionForm, setQuestionForm] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const [allWarehouses, setAllWarehouses] = useState<any[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Fetching product details for ID:", id);

        try {
          // Get the product data
          const productData = await ProductService.getProduct(id);

          if (!productData) {
            throw new Error("Product not found");
          }

          console.log("Product data received:", productData);
          setProduct(productData);

          // Get the category ID (handling both frontend and backend product formats)
          const categoryId =
            "category" in productData &&
            typeof productData.category === "object" &&
            productData.category?._id
              ? productData.category._id
              : productData.category;

          // Fetch related products if we have a category
          if (categoryId) {
            try {
              console.log(
                "Fetching related products for category:",
                categoryId
              );
              const relatedResponse = await ProductService.getProducts({
                category: categoryId,
                limit: 4,
              });

              // Filter out the current product from related products
              const currentProductId =
                "_id" in productData
                  ? productData._id
                  : (productData as Product).id;
              const filteredRelated =
                relatedResponse.products?.filter((p: any) => {
                  const relatedId = p._id || p.id;
                  return relatedId !== currentProductId;
                }) || [];

              console.log("Related products found:", filteredRelated.length);
              setRelatedProducts(filteredRelated);
            } catch (relatedError) {
              console.error("Error fetching related products:", relatedError);
              // Continue with the main product even if related products fail
            }
          }
        } catch (apiError: any) {
          console.error("Error fetching product:", apiError);
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Reset selections when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [id]);

  // Get count of this product in cart
  const getCartCount = () => {
    if (!product) return 0;
    const id = getProductId(product);
    const item = cartItems.find((item) => getProductId(item.product) === id);
    return item ? item.quantity || 1 : 0;
  };
  // Get count of this product in wishlist
  const getWishlistCount = () => {
    if (!product) return 0;
    const id = getProductId(product);
    return wishlistItems.some((item) => getProductId(item) === id) ? 1 : 0;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product as Product);
      toast.success(
        <span>
          Added to cart!{" "}
          <button
            onClick={() => navigate("/cart")}
            className="ml-2 underline text-blue-600"
          >
            View Cart
          </button>
        </span>
      );
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product as Product);
      toast.success(
        <span>
          Added to wishlist!{" "}
          <button
            onClick={() => navigate("/wishlist")}
            className="ml-2 underline text-pink-600"
          >
            View Wishlist
          </button>
        </span>
      );
    }
  };

  const increaseQuantity = () => {
    const stockAmount = "stock" in product! ? product!.stock : 10;
    if (product && quantity < stockAmount) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Helper function to get product ID
  const getProductId = (product: Product | BackendProduct): string | number => {
    if ("_id" in product) {
      return product._id;
    }
    return product.id;
  };

  // Helper function to get brand name
  const getBrandName = (product: Product | BackendProduct): string | undefined => {
    if ('brand' in product) {
      if (typeof product.brand === 'object' && product.brand?.name) return product.brand.name;
      if (typeof product.brand === 'string') return product.brand;
    }
    return undefined;
  };

  // Helper function to get SKU
  const getSku = (product: Product | BackendProduct): string | undefined => {
    if ('sku' in product) return product.sku as string;
    return undefined;
  };

  // Helper function to check if product is in wishlist
  const isProductInWishlist = (): boolean => {
    if (!product) return false;
    const id = getProductId(product);
    return isInWishlist(id);
  };

  // Helper function to get product images
  const getProductImages = (): string[] => {
    if (!product) return [];
    if (!product.images) return [];

    if (typeof product.images[0] === "string") {
      return product.images as string[];
    } else {
      return (product.images as any[]).map((img) => img.url || "");
    }
  };

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewLoading(true);
      try {
        let res = await get(`/reviews/product/${id}`);
        setReviews(res);
      } catch (err) {
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id, reviewSubmitted]);

  // Fetch questions for this product
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return;
      setQuestionLoading(true);
      try {
        let res = await get(`/questions/product/${id}`);
        setQuestions(res);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestions([]);
      } finally {
        setQuestionLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  // Handle question submission
  const handleSubmitQuestion = async () => {
    if (!id || !questionForm.trim() || !user) return;

    setQuestionSubmitted(true);
    try {
      let res = await post('/questions', {
        productId: id,
        question: questionForm,
      });
      toast.success('Question submitted successfully!');
      setQuestionForm("");
      setQuestionSubmitted(false);
      // Optionally re-fetch questions after submission, or add the new question to the state
      // For simplicity now, we won't auto-update the list until admin approves
    } catch (err) {
      console.error('Error submitting question:', err);
      toast.error('Failed to submit question.');
      setQuestionSubmitted(false);
    }
  };

  useEffect(() => {
    axios.get('/api/warehouses').then(res => setAllWarehouses(res.data)).catch(() => setAllWarehouses([]));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const images = getProductImages();

  const discountPercentage =
    ("discount" in product && product.discount) ||
    (product.salePrice && product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0);

  // Helper function to render category name safely
  const renderCategoryName = () => {
    if (typeof product.category === "object" && product.category?.name) {
      return product.category.name;
    }
    return String(product.category);
  };

  // Helper function to get category URL safely
  const getCategoryUrl = () => {
    if (typeof product.category === "object" && product.category?.slug) {
      return `/category/${product.category.slug}`;
    }
    return `/category/${product.category}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm">
        <Link
          to="/"
          className="text-gray-600 hover:text-[var(--brand-primary)]"
        >
          Home
        </Link>
        <ChevronRight size={16} className="mx-1 text-gray-400" />
        <Link
          to={getCategoryUrl()}
          className="text-gray-600 hover:text-[var(--brand-primary)] capitalize"
        >
          {renderCategoryName()}
        </Link>
        {"subcategory" in product && product.subcategory && (
          <>
            <ChevronRight size={16} className="mx-1 text-gray-400" />
            <Link
              to={`/category/${product.category}/${product.subcategory}`}
              className="text-gray-600 hover:text-[var(--brand-primary)] capitalize"
            >
              {product.subcategory}
            </Link>
          </>
        )}
        <ChevronRight size={16} className="mx-1 text-gray-400" />
        <span className="text-gray-800 font-medium truncate">
          {product.name}
        </span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[selectedImage] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-orange-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {product.name}
          </h1>

          {/* Meta Info */}
          <div className="mb-4 text-sm text-gray-500 flex flex-wrap gap-4">
            {getSku(product) && (
              <span><span className="font-semibold">SKU:</span> {getSku(product)}</span>
            )}
            {getBrandName(product) && (
              <span><span className="font-semibold">Brand:</span> {getBrandName(product)}</span>
            )}
            <span><span className="font-semibold">Category:</span> {renderCategoryName()}</span>
            {product.tags && product.tags.length > 0 && (
              <span><span className="font-semibold">Tags:</span> {product.tags.join(', ')}</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i <
                    Math.floor("rating" in product ? product.rating || 0 : 4)
                      ? "currentColor"
                      : "none"
                  }
                  className="text-yellow-400"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {"rating" in product ? product.rating : 4} (
              {Math.floor(Math.random() * 100) + 10} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-6">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ("stock" in product && product.stock > 10) ||
                ("stockStatus" in product && product.stockStatus === "in_stock")
                  ? "bg-green-100 text-green-800"
                  : ("stock" in product && product.stock > 0) ||
                    ("stockStatus" in product &&
                      product.stockStatus === "on_backorder")
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {"stockStatus" in product && product.stockStatus === "in_stock"
                ? "In Stock"
                : "stockStatus" in product &&
                  product.stockStatus === "out_of_stock"
                ? "Out of Stock"
                : "stockStatus" in product &&
                  product.stockStatus === "on_backorder"
                ? "On Backorder"
                : "stock" in product && product.stock > 10
                ? "In Stock"
                : "stock" in product && product.stock > 0
                ? `Only ${product.stock} left`
                : "Out of Stock"}
            </span>
          </div>

          {/* After stock status, before description */}
          {Array.isArray((product as any).warehouses) && (product as any).warehouses.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-800">Available in Warehouses</h3>
              <table className="w-full text-sm border rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Warehouse</th>
                    <th className="p-2 text-left">Stock</th>
                    <th className="p-2 text-left">Delivery Time</th>
                    <th className="p-2 text-left">Delivery Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {(product as any).warehouses.map((w: any) => {
                    const wh = allWarehouses.find((aw) => aw._id === (w.warehouseId?._id || w.warehouseId || w.id));
                    return (
                      <tr key={w.warehouseId?._id || w.warehouseId || w.id}>
                        <td className="p-2">{wh ? wh.name : w.warehouseId?.name || w.warehouseId || w.id}</td>
                        <td className="p-2">{w.stock}</td>
                        <td className="p-2">{wh ? wh.deliveryTime : '-'}</td>
                        <td className="p-2">{wh ? `₹${wh.deliveryCost}` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Description */}
          <div
            className="text-gray-600 mb-8"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Shipping & Returns */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2 text-gray-800">
              Shipping & Returns
            </h3>
            <ul className="list-disc pl-5 text-gray-500 text-sm">
              <li>Free shipping on orders over $99</li>
              <li>Easy 7-day returns for unused items</li>
              <li>Cash on delivery available</li>
              <li>Ships within 1-2 business days</li>
            </ul>
          </div>

          {/* Customer Reviews */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2 text-gray-800">
              Customer Reviews
            </h3>
            <div className="space-y-4">
              {reviewLoading ? (
                <div className="text-gray-400">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-400">No reviews yet.</div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span className="font-semibold text-gray-700">
                        {review.userName}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ml-2 text-xs text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className="inline text-yellow-400"
                          />
                        ))}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">{review.comment}</div>
                  </div>
                ))
              )}
            </div>
            {/* Review Submission Form */}
            {user ? (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-800">Write a Review</h4>
                {reviewSubmitted ? (
                  <div className="text-green-600 font-medium">Thank you! Your review is submitted and pending approval.</div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!reviewForm.rating || !reviewForm.comment.trim()) {
                        toast.error("Please provide a rating and comment.");
                        return;
                      }
                      try {
                        if (!product) return;
                        console.log('About to send review POST');
                        console.log('POST URL:', `/reviews`);
                        console.log('POST Payload:', {
                          product: (product as any)._id || (product as any).id,
                          rating: reviewForm.rating,
                          comment: reviewForm.comment,
                          userName: reduxUser?.username,
                          user: reduxUser?.id,
                        });
                        await post(`/reviews`, {
                          product: (product as any)._id || (product as any).id,
                          rating: reviewForm.rating,
                          comment: reviewForm.comment,
                          userName: reduxUser?.username,
                          user: reduxUser?.id,
                        });
                        setReviewForm({ rating: 0, comment: "" });
                        setReviewSubmitted(true);
                        toast.success("Review submitted and pending approval.");
                      } catch (err) {
                        toast.error("Failed to submit review.");
                      }
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <span className="mr-2 font-medium">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                          className={
                            star <= reviewForm.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          <Star size={20} fill={star <= reviewForm.rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full border rounded p-2 mb-2"
                      rows={3}
                      placeholder="Write your review..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    />
                    <button
                      type="submit"
                      className="bg-[var(--brand-primary)] text-white px-4 py-2 rounded hover:bg-[var(--brand-primary-hover)]"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-8 text-gray-500">
                Please <Link to="/account/login" className="text-blue-600 underline">login</Link> to write a review.
              </div>
            )}
          </div>

          {/* Questions & Answers Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Questions & Answers</h2>
            {questionLoading ? (
              <p>Loading questions...</p>
            ) : questions.length === 0 ? (
              <p>No questions asked yet. Be the first to ask!</p>
            ) : (
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q._id} className="border rounded-lg p-4 bg-gray-50">
                    <p className="font-semibold">Q: {q.question}</p>
                    {q.answer && (
                      <p className="mt-2 ml-4 text-gray-700">A: {q.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Ask a Question Form */}
            {user ? (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Ask a Question</h3>
                <textarea
                  className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Type your question here..."
                  value={questionForm}
                  onChange={(e) => setQuestionForm(e.target.value)}
                ></textarea>
                <button
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={handleSubmitQuestion}
                  disabled={!questionForm.trim() || questionSubmitted}
                >
                  {questionSubmitted ? "Submitting..." : "Submit Question"}
                </button>
              </div>
            ) : (
              <p className="mt-8">Please <Link to="/auth/login" className="text-blue-600 underline">login</Link> to ask a question.</p>
            )}
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="relative">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary)] hover:from-[var(--brand-primary/80)] hover:to-[var(--brand-primary/80)] text-white hover:text-black py-3 px-6 rounded-md transition-all flex items-center justify-center shadow-lg group"
                disabled={
                  ("stock" in product && product.stock <= 0) ||
                  ("stockStatus" in product &&
                    product.stockStatus === "out_of_stock")
                }
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--brand-primary)] text-white text-xs rounded-full px-2 py-0.5 animate-bounce shadow">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={handleAddToWishlist}
                className={`p-3 rounded-md border-2 transition-all duration-200 shadow group ${
                  isProductInWishlist()
                    ? "border-pink-500 text-pink-600 bg-pink-50 hover:bg-pink-100"
                    : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={20}
                  fill={isProductInWishlist() ? "currentColor" : "none"}
                  className="transition-all duration-200 group-hover:scale-110"
                />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 animate-bounce shadow">
                    {getWishlistCount()}
                  </span>
                )}
              </button>
            </div>
            <button className="p-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          {/* Tags */}
          {"tags" in product && product.tags && product.tags.length > 0 && (
            <div className="mt-8">
              <span className="font-medium mr-2">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={getProductId(relatedProduct)} className="product-card">
                {/* You can create a separate RelatedProductCard component or reuse ProductCard */}
                <Link to={`/product/${getProductId(relatedProduct)}`}>
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={
                        typeof relatedProduct.images[0] === "string"
                          ? relatedProduct.images[0]
                          : (relatedProduct.images[0] as any)?.url ||
                            "https://via.placeholder.com/300"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="mt-1">
                    {relatedProduct.salePrice ? (
                      <div className="flex items-center">
                        <span className="text-red-600 font-semibold">
                          ${relatedProduct.salePrice.toFixed(2)}
                        </span>
                        <span className="ml-2 text-gray-500 text-sm line-through">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
