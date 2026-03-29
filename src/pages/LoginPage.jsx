import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import brand from '../brand.config';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 mx-auto"
              />
            ) : (
              <h1 className="text-3xl font-display font-bold text-hilltop-charcoal">
                {brand.name}
              </h1>
            )}
          </Link>
          <h2 className="text-2xl font-bold text-hilltop-charcoal mb-2">
            Welcome Back
          </h2>
          <p className="text-hilltop-gray">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-hilltop-gray w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-hilltop-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hilltop-gray w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hilltop-green focus:ring-2 focus:ring-hilltop-green/20 outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-hilltop-green hover:text-hilltop-green-hover font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-hilltop-gray">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-hilltop-green hover:text-hilltop-green-hover font-semibold inline-flex items-center gap-1"
              >
                Create one
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Guest Checkout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="text-sm text-hilltop-gray hover:text-hilltop-charcoal"
          >
            Continue as guest
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
