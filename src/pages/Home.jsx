import { useState, useRef } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import Marquee from '../components/Marquee';
import PromptCard from '../components/PromptCard';
import { MOCK_PROMPTS } from '../data/mockData';
import { Search } from 'lucide-react';

const Home = ({ aiFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const promptsRef = useRef(null);

  // Filter prompts based on AI tool and media type from navbar
  let filteredPrompts = MOCK_PROMPTS;

  // First filter by AI tool and type from navbar
  if (aiFilter && aiFilter.tool && aiFilter.type) {
    filteredPrompts = filteredPrompts.filter(
      prompt => prompt.aiTool === aiFilter.tool && prompt.mediaType === aiFilter.type
    );
  }

  // Then apply category filter from FilterBar if not 'All'
  if (selectedFilter !== 'All') {
    filteredPrompts = filteredPrompts.filter(prompt => prompt.category === selectedFilter);
  }

  const handleExploreClick = () => {
    promptsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Infinite Marquee - Right after hero */}
      <Marquee />

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
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
        </div>
      </section>

      {/* Filter Bar - Below search */}
      <div ref={promptsRef}>
        <FilterBar 
          selectedFilter={selectedFilter} 
          onFilterChange={setSelectedFilter} 
        />
      </div>

      {/* Prompts Grid Section - Right below filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No prompts found in this category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

