import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PromptCard from './PromptCard';

const MarqueeSection = ({ title, items, direction = 'left' }) => {
  // Duplicate items x2 for seamless infinite loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full py-8 relative z-0">
      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Trending on {title}
        </h2>
      </div>

      {/* Marquee Container with Gradient Masks */}
      <div className="relative w-full overflow-hidden">
          {/* Left Gradient Fade */}
          <div 
            className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #F5E6D3, transparent)'
            }}
          />
          
          {/* Right Gradient Fade */}
          <div 
            className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #F5E6D3, transparent)'
            }}
          />

        {/* Animated Marquee with Pause on Hover */}
        <motion.div
          className="flex gap-6"
          animate={{
            x: direction === 'left' ? [0, '-50%'] : ['-50%', 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
              <PromptCard prompt={item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeSection;

