import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useFavoritesStore from '../store/useFavoritesStore';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { formatCurrency } from '../lib/formatters';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const favorites = useFavoritesStore((s) => s.favorites);
  const loading = useFavoritesStore((s) => s.loading);
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const addToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/account/favorites' } } });
      return;
    }
    fetchFavorites(user.id);
  }, [user, navigate, fetchFavorites]);

  const handleAddToCart = (favorite) => {
    const item = favorite.menu_items;
    if (!item) {
      toast.error('Menu item not found');
      return;
    }

    const customization = favorite.customization || {};

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      totalPrice: item.price,
      selectedOptions: customization,
      cartId: `${item.id}-${Date.now()}-${Math.random()}`,
    });

    toast.success('Added to cart');
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (window.confirm('Remove this item from favorites?')) {
      const { error } = await removeFavorite(favoriteId);
      if (error) {
        toast.error('Failed to remove favorite');
      } else {
        toast.success('Removed from favorites');
      }
    }
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
                Favorite Items
              </h1>
              <p className="text-hilltop-gray">
                Your saved menu items for quick reordering
              </p>
            </div>
          </div>
        </motion.div>

        {/* Favorites List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={48} className="text-hilltop-green animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-hilltop-charcoal mb-2">No favorites yet</h2>
            <p className="text-hilltop-gray mb-6">
              Save your favorite menu items for quick access
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-hilltop-green hover:bg-hilltop-green-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {favorites.map((favorite, index) => {
              const item = favorite.menu_items;
              if (!item) return null;

              return (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Item Image */}
                  {item.image && (
                    <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Item Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-hilltop-charcoal">
                          {item.name}
                        </h3>
                        <Heart
                          size={20}
                          className="text-red-500 fill-red-500 flex-shrink-0"
                        />
                      </div>
                      <p className="text-sm text-hilltop-gray mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-xl font-bold text-hilltop-green">
                        {formatCurrency(parseFloat(item.price))}
                      </p>

                      {/* Customizations */}
                      {favorite.customization && Object.keys(favorite.customization).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-hilltop-charcoal mb-1">
                            Saved Customizations:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(favorite.customization).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-xs bg-white px-2 py-1 rounded-full text-hilltop-gray border border-gray-200"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(favorite)}
                        className="flex-1 bg-hilltop-green hover:bg-hilltop-green-hover text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        disabled={loading}
                        className="p-3 border-2 border-gray-200 text-hilltop-gray hover:border-red-300 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
