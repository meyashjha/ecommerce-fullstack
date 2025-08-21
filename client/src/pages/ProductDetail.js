import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, addProductReview } from '../store/slices/productSlice';
import { addToCart, addItemLocally, updateCartItem, updateItemLocally, removeFromCart, removeItemLocally } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  // Check if product is in cart
  const cartItem = cartItems.find(item => 
    item.product._id === product?._id || item.product === product?._id
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product._id, quantity }));
    } else {
      dispatch(addItemLocally({ product, quantity }));
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart();
      return;
    }

    if (isAuthenticated) {
      dispatch(updateCartItem({ itemId: cartItem._id, quantity: newQuantity }));
    } else {
      dispatch(updateItemLocally({ itemId: cartItem._id, quantity: newQuantity }));
    }
  };

  const handleRemoveFromCart = () => {
    if (isAuthenticated) {
      dispatch(removeFromCart(cartItem._id));
    } else {
      dispatch(removeItemLocally(cartItem._id));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await dispatch(addProductReview({
      productId: product._id,
      reviewData: reviewForm
    }));

    if (addProductReview.fulfilled.match(result)) {
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      // Refresh product data
      dispatch(fetchProductById(id));
    }
  };

  const renderStars = (rating, interactive = false, onClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onClick && onClick(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          disabled={!interactive}
        >
          {filled ? (
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon className="h-5 w-5 text-gray-300" />
          )}
        </button>
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: '/api/placeholder/600/600', alt: product.name }];
  const userHasReviewed = product.reviews?.some(review => review.user?._id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Products
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]?.url}
                alt={images[selectedImageIndex]?.alt || product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600 capitalize">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(product.rating?.average || 0))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600">${product.price}</div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <dt className="font-medium text-gray-900">{key}:</dt>
                      <dd className="text-gray-700">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">✗ Out of Stock</p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                {!cartItem ? (
                  // Not in cart - show quantity selector and Add to Cart button
                  <>
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantity" className="font-medium">Quantity:</label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                      
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <HeartIcon className="h-5 w-5" />
                      </button>
                      
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  // In cart - show quantity controls
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium mb-3 flex items-center">
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Added to Cart
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          
                          <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                          
                          <button
                            onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                            disabled={cartItem.quantity >= product.stock}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleRemoveFromCart}
                        className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        Remove from Cart
                      </button>
                      
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <HeartIcon className="h-5 w-5" />
                      </button>
                      
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {isAuthenticated && !userHasReviewed && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {renderStars(reviewForm.rating, true, (rating) => 
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
