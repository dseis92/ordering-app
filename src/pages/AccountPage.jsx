import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Package, MapPin, Heart, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import brand from '../brand.config';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
      return;
    }
    setFullName(user.user_metadata?.full_name || '');
  }, [user, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile({ full_name: fullName });

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
      setEditing(false);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-hilltop-charcoal mb-2">
            My Account
          </h1>
          <p className="text-hilltop-gray">
            Manage your profile, orders, and preferences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-hilltop-charcoal">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-hilltop-green hover:text-hilltop-green-hover font-semibold"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-hilltop-gray w-5 h-5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-hilltop-gray w-5 h-5" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-hilltop-gray mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFullName(user.user_metadata?.full_name || '');
                    }}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-hilltop-gray hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-hilltop-gray">Full Name</label>
                  <p className="text-lg font-semibold text-hilltop-charcoal">
                    {user.user_metadata?.full_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-hilltop-gray">Email</label>
                  <p className="text-lg font-semibold text-hilltop-charcoal">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-hilltop-gray">Member Since</label>
                  <p className="text-lg font-semibold text-hilltop-charcoal">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Link
              to="/orders"
              className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-hilltop-green/30 transition-all group"
            >
              <Package className="w-8 h-8 text-hilltop-green mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-hilltop-charcoal mb-1">My Orders</h3>
              <p className="text-sm text-hilltop-gray">View order history</p>
            </Link>

            <Link
              to="/account/addresses"
              className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-hilltop-green/30 transition-all group"
            >
              <MapPin className="w-8 h-8 text-hilltop-green mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-hilltop-charcoal mb-1">Addresses</h3>
              <p className="text-sm text-hilltop-gray">Manage delivery addresses</p>
            </Link>

            <Link
              to="/account/favorites"
              className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-hilltop-green/30 transition-all group"
            >
              <Heart className="w-8 h-8 text-hilltop-green mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-hilltop-charcoal mb-1">Favorites</h3>
              <p className="text-sm text-hilltop-gray">Your favorite items</p>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-red-300 transition-all group text-left"
            >
              <LogOut className="w-8 h-8 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-hilltop-charcoal mb-1">Sign Out</h3>
              <p className="text-sm text-hilltop-gray">Log out of your account</p>
            </button>
          </motion.div>
        </div>

        {/* Back to Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            to="/"
            className="text-hilltop-green hover:text-hilltop-green-hover font-semibold inline-flex items-center gap-2"
          >
            ← Back to Menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
