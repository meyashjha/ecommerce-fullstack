import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  updateItemLocally,
  removeItemLocally,
  clearCartLocally
} from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, totalAmount, totalItems, isLoading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item when quantity reaches 0
      handleRemoveItem(itemId);
      return;
    }
    
    if (isAuthenticated) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    } else {
      dispatch(updateItemLocally({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    if (isAuthenticated) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(removeItemLocally(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      if (isAuthenticated) {
        dispatch(clearCart());
      } else {
        dispatch(clearCartLocally());
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to="/products"
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart ({totalItems} items)
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || '/api/placeholder/200/200'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1 capitalize">
                        {item.product.category}
                      </p>
                      <p className="text-blue-600 font-semibold mt-2">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-600 hover:text-red-700 mt-2 flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.product.stock < item.quantity && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Only {item.product.stock} items available in stock. 
                        Please update your quantity.
                      </p>
                    </div>
                  )}

                  {item.product.stock < 10 && item.product.stock >= item.quantity && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-800 text-sm">
                        Only {item.product.stock} items left in stock
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">
                      {totalAmount >= 50 ? 'Free' : '$5.99'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      ${(totalAmount + (totalAmount >= 50 ? 0 : 5.99) + (totalAmount * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {totalAmount < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      💡 Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={items.some(item => item.product.stock < item.quantity)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You'll be redirected to login first
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
