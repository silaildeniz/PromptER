import { Search } from 'lucide-react';

const Hero = ({ selectedFilter, onFilterChange }) => {
  const filters = ['All', 'Video', 'Image', 'Text'];

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="gradient-text">Perfect Prompts</span>
          <br />
          <span className="text-white">for AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Discover premium prompts for Midjourney, ChatGPT, and more. 
          Save time and create stunning results instantly.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for prompts, styles, or AI tools..."
            className="w-full pl-6 pr-32 py-4 bg-navy-800/80 backdrop-blur-sm border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/25">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-navy-800/50 border border-white/10 text-slate-300 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

