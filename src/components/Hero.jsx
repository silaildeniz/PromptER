import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-700 via-purple-500 to-gray-600 bg-clip-text text-transparent">10x Faster Workflows</span>
          <br />
          <span className="bg-gradient-to-r from-gray-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">Professional AI Prompts</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-purple-800 max-w-2xl mx-auto mb-8">
          Discover agency-quality prompts for Midjourney, ChatGPT, and Stable Diffusion. 
          No trial and error—just copy and use.
        </p>

        {/* Search Bar (Replaces CTA Button) */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for prompts, styles, or AI tools..."
              className="w-full pl-6 pr-32 py-4 bg-white/90 backdrop-blur-sm border border-purple-300 rounded-2xl text-purple-900 placeholder-purple-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-600/25">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

