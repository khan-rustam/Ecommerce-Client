import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronUp, FaChevronDown } from "react-icons/fa";

const ProductTable = ({
  products,
  loading,
  pagination,
  sort,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onPageChange,
  onLimitChange,
  onSortChange,
  onDelete,
}) => {
  // Get sort icon based on field and current sort state
  const getSortIcon = (field) => {
    if (sort.field !== field) return null;
    return sort.order === "asc" ? (
      <FaChevronUp className="ml-1" />
    ) : (
      <FaChevronDown className="ml-1" />
    );
  };

  // Handle sort click
  const handleSortClick = (field) => {
    onSortChange(field);
  };

  // Format currency
  const formatCurrency = (amount, currency = "₹") => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  // Safely access pagination properties with defaults
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;
  const pages = pagination?.pages || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {loading && products.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={onSelectAll}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    <button
                      className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortClick("name")}
                    >
                      Product {getSortIcon("name")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    <button
                      className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortClick("price")}
                    >
                      Price {getSortIcon("price")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    <button
                      className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortClick("stock")}
                    >
                      Stock {getSortIcon("stock")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    <button
                      className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortClick("status")}
                    >
                      Status {getSortIcon("status")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    <button
                      className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                      onClick={() => handleSortClick("createdAt")}
                    >
                      Date {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => onSelectProduct(product._id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.images[0].url || product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(product.price, product.currency || "₹")}
                      </div>
                      {product.onSale && (
                        <div className="text-sm text-red-500">
                          {formatCurrency(
                            product.salePrice,
                            product.currency || "₹"
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock || product.stockQuantity || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.stockStatus === "in_stock" ? (
                          <span className="text-green-500">In stock</span>
                        ) : product.stockStatus === "out_of_stock" ? (
                          <span className="text-red-500">Out of stock</span>
                        ) : product.stockStatus === "on_backorder" ? (
                          <span className="text-yellow-500">Backorder</span>
                        ) : (
                          <span className="text-gray-500">Discontinued</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.status === "published"
                            ? "bg-green-100 text-green-800"
                            : product.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status ||
                          (product.isHidden ? "Hidden" : "Published")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {total > 0 ? (page - 1) * limit + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={limit}
                  onChange={(e) => onLimitChange(e.target.value)}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>

                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* First page or ellipsis */}
                    {page > 2 && (
                      <>
                        <button
                          onClick={() => onPageChange(1)}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          1
                        </button>
                        {page > 3 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Previous page if not first */}
                    {page > 1 && (
                      <button
                        onClick={() => onPageChange(page - 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {page - 1}
                      </button>
                    )}

                    {/* Current page */}
                    <button
                      className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600"
                      aria-current="page"
                    >
                      {page}
                    </button>

                    {/* Next page if not last */}
                    {page < pages && (
                      <button
                        onClick={() => onPageChange(page + 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {page + 1}
                      </button>
                    )}

                    {/* Last page or ellipsis */}
                    {page < pages - 1 && (
                      <>
                        {page < pages - 2 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => onPageChange(pages)}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          {pages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onPageChange(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTable;
