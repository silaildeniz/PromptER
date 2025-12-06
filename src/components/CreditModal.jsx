import { X, Zap, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Pricing Plans
const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    credits: 100,
    price: 4.99,
    popular: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    credits: 500,
    price: 19.99,
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: Crown,
    credits: 1500,
    price: 49.99,
    popular: false,
    color: 'from-orange-500 to-red-500'
  }
];

const CreditModal = ({ isOpen, onClose }) => {

  const handleBuyCredits = (plan) => {
    toast.success(`Payment integration coming soon! ${plan.name} plan selected.`, {
      duration: 3000,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      >
        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-[400px] bg-[#F5E6D3] rounded-2xl border border-purple-200 shadow-2xl overflow-hidden m-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-5 border-b border-purple-200 flex items-center justify-between bg-gradient-to-r from-purple-100 to-purple-50">
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Buy Credits</h2>
              <p className="text-sm text-purple-600">Choose a plan that works for you</p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/80 hover:bg-white flex items-center justify-center transition-colors border border-purple-200"
            >
              <X className="w-5 h-5 text-purple-700" />
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="p-5 space-y-3">
            {PRICING_PLANS.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] cursor-pointer ${
                    plan.popular
                      ? 'bg-white border-purple-400 shadow-lg shadow-purple-200'
                      : 'bg-white/60 border-purple-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleBuyCredits(plan)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full text-xs font-bold text-white shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-purple-900">{plan.name}</h3>
                      <p className="text-purple-600 text-sm">{plan.credits} Credits</p>
                    </div>

                    {/* Price & Buy Button */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-900">${plan.price}</p>
                      <button
                        className={`mt-1 px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="px-5 pb-5">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-xs text-purple-600">
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreditModal;
