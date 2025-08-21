import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, fetchCategories, setFilters, clearFilters } from '../store/slices/productSlice';
import { addToCart, addItemLocally, updateCartItem, removeFromCart, updateItemLocally, removeItemLocally } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FunnelIcon, 
  StarIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  const { 
    products, 
    categories, 
    pagination, 
    filters, 
    isLoading, 
    error 
  } = useSelector((state) => state.products);
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') || '1',
    };
    
    setLocalFilters(urlFilters);
    dispatch(setFilters(urlFilters));
  }, [searchParams, dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    dispatch(fetchProducts(Object.fromEntries(params)));
  }, [filters, dispatch]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && key !== 'page') newParams.set(key, value);
    });
    
    setSearchParams(newParams);
    dispatch(setFilters({ ...localFilters, page: '1' }));
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setSearchParams({});
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    dispatch(setFilters({ ...filters, page: page.toString() }));
  };

  const handleAddToCart = async (product) => {
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addItemLocally({ product, quantity: 1 }));
    }
  };

  const handleUpdateQuantity = (product, newQuantity) => {
    const cartItem = cartItems.find(item => 
      item.product._id === product._id || item.product === product._id
    );
    
    if (newQuantity < 1) {
      // Remove item when quantity reaches 0
      handleRemoveFromCart(product);
      return;
    }
    
    if (isAuthenticated) {
      dispatch(updateCartItem({ itemId: cartItem._id, quantity: newQuantity }));
    } else {
      dispatch(updateItemLocally({ itemId: cartItem._id, quantity: newQuantity }));
    }
  };

  const handleRemoveFromCart = (product) => {
    const cartItem = cartItems.find(item => 
      item.product._id === product._id || item.product === product._id
    );
    
    if (isAuthenticated) {
      dispatch(removeFromCart(cartItem._id));
    } else {
      dispatch(removeItemLocally(cartItem._id));
    }
  };

  const getCartItem = (product) => {
    return cartItems.find(item => 
      item.product._id === product._id || item.product === product._id
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            Error loading products: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Products
            {pagination.totalProducts > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({pagination.totalProducts} items)
              </span>
            )}
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            {/* Sort Dropdown */}
            <select
              value={localFilters.sort}
              onChange={(e) => {
                handleFilterChange('sort', e.target.value);
                applyFilters();
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <Link to={`/products/${product._id}`}>
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                          <img
                            src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                            alt={product.name}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(product.rating?.average || 0)}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            ({product.rating?.count || 0})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            ${product.price}
                          </span>
                          
                          {(() => {
                            const cartItem = getCartItem(product);
                            return cartItem ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(product, cartItem.quantity - 1)}
                                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </button>
                                
                                <span className="w-8 text-center font-semibold text-sm">{cartItem.quantity}</span>
                                
                                <button
                                  onClick={() => handleUpdateQuantity(product, cartItem.quantity + 1)}
                                  disabled={cartItem.quantity >= product.stock}
                                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                Add to Cart
                              </button>
                            );
                          })()}
                        </div>
                        
                        {product.stock < 10 && product.stock > 0 && (
                          <p className="text-orange-600 text-sm mt-2">
                            Only {product.stock} left in stock
                          </p>
                        )}
                        
                        {product.stock === 0 && (
                          <p className="text-red-600 text-sm mt-2">Out of stock</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded-lg ${
                            pagination.currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
