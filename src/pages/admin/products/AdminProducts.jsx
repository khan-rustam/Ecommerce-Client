import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../../utils/ProductService";
import { useToast } from "../../../contexts/ToastContext";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";

// Icons
import { FaPlus, FaSearch, FaSync, FaTrash } from "react-icons/fa";

const AdminProducts = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    status: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [sort, setSort] = useState({
    field: "createdAt",
    order: "desc",
  });
  const [bulkActionModal, setBulkActionModal] = useState({
    isOpen: false,
    action: null,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
    isDeleting: false,
  });

  // Context
  const { showToast } = useToast();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts({
        ...filters,
        search: searchQuery,
        page: pagination.page,
        limit: pagination.limit,
        sort: sort.field,
        order: sort.order,
      });

      setProducts(response.products || []);

      // Map API response to our pagination structure
      setPagination((prev) => ({
        page: response.currentPage || prev.page,
        limit: prev.limit,
        total: response.total || 0,
        pages: response.totalPages || 0,
      }));

      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
      showToast("error", "Error fetching products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit, sort, searchQuery]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  // Handle bulk selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
  };

  // Open bulk action modal
  const openBulkActionModal = (action, data = null) => {
    if (selectedProducts.length === 0) {
      showToast("warning", "Please select at least one product");
      return;
    }

    setBulkActionModal({
      isOpen: true,
      action,
      data,
    });
  };

  // Close bulk action modal
  const closeBulkActionModal = () => {
    setBulkActionModal({
      isOpen: false,
      action: null,
      data: null,
    });
  };

  // Handle bulk action confirmation
  const confirmBulkAction = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setLoading(true);

      const { action, data } = bulkActionModal;

      switch (action) {
        case "delete":
          await ProductService.bulkProductsOperation(
            "delete",
            selectedProducts
          );
          showToast(
            "success",
            `${selectedProducts.length} products deleted successfully`
          );
          break;

        case "update":
          await ProductService.bulkProductsOperation(
            "update",
            selectedProducts,
            data
          );
          showToast(
            "success",
            `${selectedProducts.length} products updated successfully`
          );
          break;

        default:
          throw new Error("Invalid action");
      }

      // Refresh products
      fetchProducts();
      // Clear selections
      setSelectedProducts([]);
      // Close modal
      closeBulkActionModal();
    } catch (err) {
      console.error("Bulk action error:", err);
      showToast("error", err.message || "Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };

  // Open delete product modal
  const openDeleteModal = (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName: productName || "this product",
    });
  };

  // Close delete product modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: "",
      isDeleting: false,
    });
  };

  // Delete a single product
  const handleDeleteProduct = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      openDeleteModal(productId, product.name);
    }
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!deleteModal.productId) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await ProductService.deleteProduct(deleteModal.productId);
      showToast(
        "success",
        `Product "${deleteModal.productName}" deleted successfully`
      );
      fetchProducts();
      closeDeleteModal();
    } catch (err) {
      showToast(
        "error",
        `Failed to delete product: ${err.message || "Unknown error"}`
      );
      console.error(err);
    } finally {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="px-36 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex space-x-3">
          <button
            onClick={fetchProducts}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <Link
            to="/admin/products/create"
            className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-md hover:bg-[var(--brand-primary/60)] transition-colors duration-200 ease-in-out"
          >
            <FaPlus className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search products by name, description, category..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button
            type="submit"
            className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {selectedProducts.length > 0 && (
        <div className="bg-gray-50 p-4 mb-6 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedProducts.length} products selected
            </span>

            <div className="flex space-x-3">
              <button
                onClick={() =>
                  openBulkActionModal("update", { status: "published" })
                }
                className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Publish
              </button>

              <button
                onClick={() =>
                  openBulkActionModal("update", { status: "draft" })
                }
                className="flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Draft
              </button>

              <button
                onClick={() => openBulkActionModal("delete")}
                className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaTrash className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md text-red-600">
          {error}
        </div>
      )}

      <ProductTable
        products={products}
        loading={loading}
        pagination={pagination}
        sort={sort}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onDelete={handleDeleteProduct}
      />

      {/* Bulk Action Modal */}
      {bulkActionModal.isOpen && (
        <ProductModal
          isOpen={bulkActionModal.isOpen}
          onClose={closeBulkActionModal}
          onConfirm={confirmBulkAction}
          title={
            bulkActionModal.action === "delete"
              ? "Delete Products"
              : "Update Products"
          }
          message={
            bulkActionModal.action === "delete"
              ? `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`
              : `Are you sure you want to update ${selectedProducts.length} products?`
          }
        />
      )}

      {/* Single Product Delete Modal */}
      {deleteModal.isOpen && (
        <ProductModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone and will also delete all associated images.`}
          confirmButtonText={deleteModal.isDeleting ? "Deleting..." : "Delete"}
          confirmButtonDisabled={deleteModal.isDeleting}
          confirmButtonColor="red"
        />
      )}
    </div>
  );
};

export { AdminProducts as default };
