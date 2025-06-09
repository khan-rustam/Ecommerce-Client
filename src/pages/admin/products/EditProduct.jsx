import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductForm from "../../../components/ProductManager/ProductForm";
import ProductService from "../../../utils/ProductService.ts";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetchLoading(true);
        console.log("Fetching product with ID:", id);

        if (!id) {
          throw new Error("Product ID is missing");
        }

        const productData = await ProductService.getProduct(id);

        if (!productData) {
          throw new Error("Product not found");
        }

        console.log("Product data received:", productData);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(`Failed to load product: ${err.message || "Unknown error"}`);
        toast.error("Failed to load product details");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (productData) => {
    setIsLoading(true);
    try {
      await ProductService.updateProduct(id, productData);
      toast.success("Product updated successfully");
      // Redirect to admin products page
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
          {error || "Product not found"}
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditProduct;
