import { Star, Eye, Sparkles, MessageSquare, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PromptCard = ({ prompt }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get icon based on tool type
  const getToolIcon = () => {
    switch (prompt.type) {
      case 'Video':
        return <Video className="w-3.5 h-3.5" />;
      case 'Text':
        return <MessageSquare className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.div
      className="group relative bg-navy-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* Tool Badge - Top Left */}
        <div className="absolute top-3 left-3 px-3 py-1.5 backdrop-blur-xl bg-navy-900/80 rounded-lg border border-white/10 flex items-center gap-1.5">
          {getToolIcon()}
          <span className="text-xs font-medium text-white">{prompt.tool}</span>
        </div>

        {/* Preview Button - Shows on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button className="px-6 py-2.5 bg-white hover:bg-slate-100 text-navy-900 font-medium rounded-lg flex items-center gap-2 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {prompt.title}
        </h3>

        {/* Rating & Price Row */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">
              {prompt.rating}
            </span>
          </div>

          {/* Price Pill */}
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {prompt.price} Credits
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;

