import { Star, Copy, Check, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptAction } from '../hooks/usePromptAction';
import toast from 'react-hot-toast';
import CreditModal from './CreditModal';

const PromptCard = ({ prompt }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const navigate = useNavigate();
  const { copyPrompt, loading } = usePromptAction();

  // Get badge color based on model
  const getModelBadgeColor = () => {
    if (prompt.model.includes('Midjourney')) {
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    } else if (prompt.model.includes('DALL-E')) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    } else if (prompt.model.includes('GPT')) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
    return 'bg-gradient-to-r from-purple-500 to-blue-500';
  };

  const handleCardClick = () => {
    navigate(`/prompt/${prompt.id}`);
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    
    const result = await copyPrompt(prompt);
    
    if (result.success) {
      setCopied(true);
      toast.success(`Copied! ${result.credits_remaining} credits remaining`, {
        duration: 3000,
        style: {
          background: '#131825',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } else if (result.error === 'insufficient_funds') {
      // Show "Watch & Earn" option
      toast((t) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white font-medium mb-1">Not enough credits!</p>
            <p className="text-slate-400 text-sm">Watch a short video to earn +10 credits</p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setShowCreditModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all"
          >
            <Gift className="w-4 h-4" />
            Watch & Earn
          </button>
        </div>
      ), {
        duration: 6000,
        style: {
          background: '#131825',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          maxWidth: '500px',
        },
      });
    } else if (result.error === 'unauthorized') {
      // Hook already redirects to login
      toast.error('Please sign in to copy prompts', {
        duration: 3000,
      });
    }
  };

  return (
    <motion.div
      className="group relative bg-navy-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={prompt.imageUrl}
          alt={prompt.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Model Badge - Top Left */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 ${getModelBadgeColor()} rounded-lg shadow-lg`}>
          <span className="text-xs font-bold text-white">{prompt.model}</span>
        </div>

        {/* Price Tag - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1.5 bg-navy-900/90 backdrop-blur-sm rounded-lg border border-white/20">
            <span className="text-xs font-bold text-white">{prompt.price} Credits</span>
          </div>
        </div>

        {/* Copy Button - Bottom Right (shows on hover) */}
        {isHovered && (
          <motion.button
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors group/btn ${
              copied 
                ? 'bg-green-500' 
                : 'bg-white hover:bg-purple-500'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={handleCopy}
            disabled={loading}
          >
            {copied ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-navy-900 group-hover/btn:text-white" />
            )}
          </motion.button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {prompt.title}
        </h3>

        {/* Author & Sales */}
        <p className="text-xs text-slate-400 mb-3">
          {prompt.author} • {prompt.sales} sales
        </p>

        {/* Rating & Category Row */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">
              {prompt.rating}
            </span>
          </div>

          {/* Category Badge */}
          <div className="px-2 py-1 bg-navy-900/50 rounded-md border border-white/10">
            <span className="text-xs text-slate-300">{prompt.category}</span>
          </div>
        </div>
      </div>

      {/* Credit Modal */}
      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </motion.div>
  );
};

export default PromptCard;

