import { useState, useEffect } from 'react';
import { X, Tv, CreditCard, ArrowLeft, Gift, Loader, CheckCircle, Zap, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromptAction } from '../hooks/usePromptAction';
import toast from 'react-hot-toast';

// YouTube Shorts IDs
const YOUTUBE_SHORTS_IDS = [
  '3nH99fQlERA',
  'kBqWcRB_89s'
];

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
  const [view, setView] = useState('menu');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(8);
  const [canClaim, setCanClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { earnCredits, loading } = usePromptAction();

  // Reset to menu when modal closes
  useEffect(() => {
    if (!isOpen) {
      setView('menu');
      setTimeRemaining(8);
      setCanClaim(false);
      setClaimed(false);
    }
  }, [isOpen]);

  // Select random video when switching to watch view
  useEffect(() => {
    if (view === 'watch') {
      const randomId = YOUTUBE_SHORTS_IDS[Math.floor(Math.random() * YOUTUBE_SHORTS_IDS.length)];
      setCurrentVideoId(randomId);
      setTimeRemaining(8);
      setCanClaim(false);
      setClaimed(false);
    }
  }, [view]);

  // Start countdown timer only on watch view
  useEffect(() => {
    if (view !== 'watch') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view]); // Only depend on view, not timeRemaining

  const handleClaim = async () => {
    if (!canClaim || loading || claimed) return;

    const result = await earnCredits(10, 'ad_reward');

    if (result.success) {
      setClaimed(true);
      toast.success(`+10 Credits earned! Total: ${result.credits_total}`, {
        duration: 3000,
        style: {
          background: '#131825',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
      });
      
      // Close modal and reset after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      toast.error(result.message || 'Failed to claim credits', {
        duration: 3000,
      });
    }
  };

  const handleBuyCredits = (plan) => {
    toast.success(`Payment integration coming soon! ${plan.name} plan selected.`, {
      duration: 3000,
      style: {
        background: '#131825',
        color: '#fff',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      },
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay - Full Screen Flex Container (STRICT CENTERING) */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md h-screen w-screen">
        {/* Modal Container - Compact & Sleek */}
        <motion.div
          className="relative w-[360px] bg-[#151925] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-gray-800 flex items-center justify-between">
            {/* Back Button (only show in watch/buy views) */}
            {view !== 'menu' && (
              <button
                onClick={() => setView('menu')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            )}
            
            {/* Title */}
            {view === 'menu' && (
              <h2 className="text-2xl font-bold text-white">Get Credits</h2>
            )}
            {view === 'watch' && (
              <h2 className="text-xl font-bold text-white">Watch & Earn</h2>
            )}
            {view === 'buy' && (
              <h2 className="text-xl font-bold text-white">Buy Credits</h2>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-auto w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* VIEW 1: Menu (Initial Choice) */}
            {view === 'menu' && (
              <div className="flex flex-col gap-3">
                {/* Watch & Earn Button (Green/Neon) */}
                <button
                  onClick={() => setView('watch')}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 hover:border-green-400 hover:scale-105 transition-all overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all" />
                  
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                      <Tv className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-white mb-0.5">📺 Watch & Earn</h3>
                      <p className="text-xs text-green-300">Get +10 credits free</p>
                    </div>
                    <div className="text-xl">→</div>
                  </div>
                </button>

                {/* Buy Credits Button (Purple/Blue) */}
                <button
                  onClick={() => setView('buy')}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 hover:border-purple-400 hover:scale-105 transition-all overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all" />
                  
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-white mb-0.5">💎 Buy Credits</h3>
                      <p className="text-xs text-purple-300">Starting at $4.99</p>
                    </div>
                    <div className="text-xl">→</div>
                  </div>
                </button>
              </div>
            )}

            {/* VIEW 2: Watch (Video Player) */}
            {view === 'watch' && (
              <div className="flex flex-col items-center">
                {/* Timer & Progress */}
                {!claimed && (
                  <div className="w-full mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">
                        {timeRemaining > 0 ? 'Reward unlocks in:' : '✨ Ready to claim!'}
                      </span>
                      <span className="text-xl font-bold text-green-400">
                        {timeRemaining}s
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((8 - timeRemaining) / 8) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Video Container with Glowing Border */}
                <div className="relative mb-4 w-full flex justify-center">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-xl blur-lg opacity-30" />
                  
                  {/* Video Iframe - Shorter height to fit entire card on screen */}
                  <div className="relative w-[240px] h-[320px] bg-black rounded-xl overflow-hidden border-2 border-green-500/50 shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&loop=1&playlist=${currentVideoId}&controls=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube Shorts"
                    />
                  </div>
                </div>

                {/* Claim Button */}
                {claimed ? (
                  <div className="w-full p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">+10 Credits Claimed!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleClaim}
                    disabled={!canClaim || loading}
                    className={`w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 ${
                      canClaim && !loading
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/50 hover:scale-105'
                        : 'bg-gray-800/50 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Claim +10 Credits
                      </>
                    )}
                  </button>
                )}

                {/* Helper Text */}
                <p className="text-xs text-slate-400 text-center mt-3">
                  Watch the entire video to unlock your reward
                </p>
              </div>
            )}

            {/* VIEW 3: Buy (Pricing Cards) */}
            {view === 'buy' && (
              <div className="space-y-3">
                {PRICING_PLANS.map((plan) => {
                  const IconComponent = plan.icon;
                  return (
                    <div
                      key={plan.id}
                      className={`relative p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                        plan.popular
                          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/50 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/30 border-gray-700 hover:border-purple-500/30'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-bold text-white shadow-lg">
                          POPULAR
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white mb-0.5">{plan.name}</h3>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                              ${plan.price}
                            </span>
                            <span className="text-slate-400 text-xs">• {plan.credits} Cr</span>
                          </div>
                        </div>

                        {/* Buy Button */}
                        <button
                          onClick={() => handleBuyCredits(plan)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'
                              : 'bg-gray-700 hover:bg-gray-600 text-white'
                          }`}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreditModal;
