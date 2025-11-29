import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import Marquee from './components/Marquee';
import PromptCard from './components/PromptCard';
import { MOCK_PROMPTS } from './data/mockData';
import { Search } from 'lucide-react';

function App() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter prompts based on selected filter
  const filteredPrompts = selectedFilter === 'All' 
    ? MOCK_PROMPTS 
    : MOCK_PROMPTS.filter(prompt => prompt.type === selectedFilter);

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Only title */}
      <Hero />

      {/* Filter Bar - Below hero */}
      <FilterBar 
        selectedFilter={selectedFilter} 
        onFilterChange={setSelectedFilter} 
      />

      {/* Prompts Grid Section - Right below filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No prompts found for this category.
            </p>
          </div>
        )}
      </section>

      {/* Search Section - Moved to bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-slate-400 mb-8">
            Search our entire collection of premium AI prompts
          </p>
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

      {/* Infinite Marquee */}
      <Marquee />

      {/* Footer */}
      <footer className="border-t border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 PromptER. Premium AI Prompts Marketplace.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

