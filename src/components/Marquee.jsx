import { motion } from 'framer-motion';
import { MARQUEE_IMAGES } from '../data/mockData';

const Marquee = () => {
  // Duplicate images for seamless loop
  const images = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

  return (
    <div className="relative py-12 overflow-hidden">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none" />
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none" />

      {/* Scrolling images */}
      <motion.div
        className="flex gap-6"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
          >
            <img
              src={imageUrl}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;

