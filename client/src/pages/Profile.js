import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, logout } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  UserIcon,
  ShoppingBagIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
  const { orders: userOrders = [], isLoading: ordersLoading = false } = useSelector((state) => state.order || {});

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      });
    }

    // Fetch user orders
    dispatch(fetchOrders());
  }, [dispatch, isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error) {
      setUpdateError(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      navigate('/');
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserIcon className="w-5 h-5 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5 inline mr-2" />
                Order History ({userOrders?.length || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                {updateError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {updateError}
                  </div>
                )}

                {updateSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {updateSuccess}
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    {isEditing ? (
                      <>
                        <XMarkIcon className="w-5 h-5 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <PencilIcon className="w-5 h-5 mr-1" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : userOrders && userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <img
                                src={item.product?.images?.[0]?.url || '/api/placeholder/60/60'}
                                alt={item.product?.name || 'Product'}
                                className="w-15 h-15 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.product?.name || 'Product not found'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ${item.price}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                              <p className="text-sm text-gray-600">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => navigate(`/orders/${order._id}`)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                              >
                                <EyeIcon className="w-4 h-4 mr-1" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">
                      When you place your first order, it will appear here.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
