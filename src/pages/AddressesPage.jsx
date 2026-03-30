import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Star, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAddressStore from '../store/useAddressStore';
import useAuthStore from '../store/useAuthStore';

export default function AddressesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addresses = useAddressStore((s) => s.addresses);
  const loading = useAddressStore((s) => s.loading);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);
  const addAddress = useAddressStore((s) => s.addAddress);
  const updateAddress = useAddressStore((s) => s.updateAddress);
  const deleteAddress = useAddressStore((s) => s.deleteAddress);
  const setDefaultAddress = useAddressStore((s) => s.setDefaultAddress);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: 'WI',
    zip: '',
    phone: '',
    is_default: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/account/addresses' } } });
      return;
    }
    fetchAddresses(user.id);
  }, [user, navigate, fetchAddresses]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (editingAddress) {
      const { error } = await updateAddress(editingAddress.id, formData);
      if (error) {
        toast.error('Failed to update address');
      } else {
        toast.success('Address updated successfully');
        setShowForm(false);
        setEditingAddress(null);
        resetForm();
      }
    } else {
      const { error } = await addAddress(user.id, formData);
      if (error) {
        toast.error('Failed to add address');
      } else {
        toast.success('Address added successfully');
        setShowForm(false);
        resetForm();
      }
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone || '',
      is_default: address.is_default,
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const { error } = await deleteAddress(addressId);
      if (error) {
        toast.error('Failed to delete address');
      } else {
        toast.success('Address deleted successfully');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    if (!user) return;
    const { error } = await setDefaultAddress(user.id, addressId);
    if (error) {
      toast.error('Failed to set default address');
    } else {
      toast.success('Default address updated');
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      city: '',
      state: 'WI',
      zip: '',
      phone: '',
      is_default: false,
    });
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/account')}
            className="text-hilltop-green hover:text-hilltop-green-hover font-semibold mb-4"
          >
            ← Back to Account
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-hilltop-charcoal mb-2">
                Delivery Addresses
              </h1>
              <p className="text-hilltop-gray">
                Manage your saved delivery addresses
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-hilltop-green hover:bg-hilltop-green-hover text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Address
              </button>
            )}
          </div>
        </motion.div>

        {/* Add/Edit Address Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8"
          >
            <h2 className="text-2xl font-bold text-hilltop-charcoal mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                  Label (e.g., Home, Work)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                  placeholder="Home"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                    placeholder="Stevens Point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    maxLength={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                    placeholder="WI"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                    placeholder="54481"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                    placeholder="(715) 341-3037"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-hilltop-green border-gray-300 rounded focus:ring-hilltop-green"
                />
                <label htmlFor="is_default" className="text-sm text-hilltop-charcoal">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-hilltop-gray hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Addresses List */}
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={48} className="text-hilltop-green animate-spin" />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-hilltop-charcoal mb-2">No addresses saved</h2>
            <p className="text-hilltop-gray mb-6">
              Add a delivery address to make checkout faster
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-hilltop-green hover:bg-hilltop-green-hover text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Your First Address
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow relative"
              >
                {address.is_default && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-hilltop-green text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Default
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-hilltop-charcoal mb-2">
                    {address.label}
                  </h3>
                  <div className="text-hilltop-gray space-y-1">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    {address.phone && <p className="text-sm">{address.phone}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={loading}
                      className="flex-1 px-4 py-2 border-2 border-hilltop-green text-hilltop-green hover:bg-hilltop-green hover:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Check size={16} />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 border-2 border-gray-200 text-hilltop-gray hover:border-hilltop-green hover:text-hilltop-green rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={loading}
                    className="p-2 border-2 border-gray-200 text-hilltop-gray hover:border-red-300 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
