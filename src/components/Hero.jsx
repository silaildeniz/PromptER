import { Sparkles } from 'lucide-react';

const Hero = ({ onExploreClick }) => {
  return (
    <div className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">10x Faster Workflows</span>
          <br />
          <span className="text-white">Professional AI Prompts</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          Discover agency-quality prompts for Midjourney, ChatGPT, and Stable Diffusion. 
          No trial and error—just copy and use.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onExploreClick}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Explore Popular Prompts
        </button>
      </div>
    </div>
  );
};

export default Hero;

